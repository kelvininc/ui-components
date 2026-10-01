import { ComputePositionConfig } from '@floating-ui/dom';
import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element, State, Watch } from '@stencil/core';

import { DEFAULT_POSITION_CONFIG } from './dropdown-base.config';
import { IDropdownBase, IDropdownBaseEvents } from './dropdown-base.types';
import { addOpenDropdown, isInPortalAnchoredWithin, isTopmostOpenDropdown, removeOpenDropdown, trackOpenDropdown } from './dropdown-base.helper';
import { didClickOnElement } from '../../utils/mouse-event.helper';
import { isImeComposition } from '../../utils/keyboard-event.helper';
import { DEFAULT_DROPDOWN_Z_INDEX } from '../../globals/config';

@Component({
	tag: 'kv-dropdown-base',
	styleUrl: 'dropdown-base.scss',
	shadow: false
})
export class KvDropdownBase implements IDropdownBase, IDropdownBaseEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: false }) options?: Partial<ComputePositionConfig> = DEFAULT_POSITION_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: false }) actionElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: false }) listElement?: HTMLElement = null;
	/** @inheritdoc */
	@Prop({ reflect: true }) clickOutsideClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: true }) escapeClose?: boolean = true;
	/** @inheritdoc */
	@Prop({ reflect: false }) zIndex?: number = DEFAULT_DROPDOWN_Z_INDEX;

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() clickOutside: EventEmitter<MouseEvent>;

	@Element() element: HTMLKvDropdownBaseElement;

	@Watch('isOpen')
	isOpenChangeHandler(isOpen: boolean) {
		if (isOpen) {
			addOpenDropdown(this.element);
		} else {
			removeOpenDropdown(this.element);
		}
	}

	/**
	 * Escape closes the most recently opened dropdown only, as a click inside it closes those opened from it but not
	 * itself. The window is listened to as the key bubbles, so that whatever handles it first takes precedence: a
	 * component that stops it, as kv-select-create-option cancelling its form, or marks it as handled, as kv-modal.
	 * A dropdown with `escapeClose` off still takes the key, so those opened before it stay open.
	 */
	@Listen('keydown', { target: 'window' })
	closeOnEscape(event: KeyboardEvent) {
		if (event.key !== 'Escape' || event.defaultPrevented || isImeComposition(event)) {
			return;
		}

		if (!this.isOpen || !this.escapeClose || !isTopmostOpenDropdown(this.element)) {
			return;
		}

		event.preventDefault();
		this.openStateChange.emit(false);
	}

	@Listen('mousedown', { target: 'window' })
	checkForClickOutside(event: MouseEvent) {
		// Check if clicked inside the dropdown, or in the list of a dropdown opened from inside it
		if (this.didClickOnDropdownAction(event) || this.didClickOnDropdownList(event) || this.didClickOnPortalAnchoredInside(event)) {
			return;
		}

		if (this.isOpen && this.clickOutsideClose) {
			this.openStateChange.emit(!this.isOpen);
		}

		this.clickOutside.emit(event);
	}

	private portal: HTMLElement;
	@State() action: HTMLDivElement;

	private getActionElement = (): HTMLElement | null => {
		return this.actionElement ?? this.action;
	};

	private getListElement = (): HTMLElement | null => {
		return this.listElement ?? this.portal;
	};

	private didClickOnDropdownAction = (event: MouseEvent): boolean => {
		const dropdownActionElement = this.getActionElement();

		return didClickOnElement(dropdownActionElement, event);
	};

	private didClickOnDropdownList = (event: MouseEvent): boolean => {
		const dropdownListElement = this.getListElement();

		return didClickOnElement(dropdownListElement, event);
	};

	// A dropdown, or a tooltip, opened from inside this one is portaled to the body, outside its list
	private didClickOnPortalAnchoredInside = (event: MouseEvent): boolean =>
		isInPortalAnchoredWithin(event.composedPath(), this.portal, [this.getActionElement(), this.getListElement(), this.portal]);

	connectedCallback() {
		// Open from the start, or reconnected after a move, which leaves its place among the open dropdowns as it was
		if (this.isOpen) {
			trackOpenDropdown(this.element);
		}
	}

	disconnectedCallback() {
		// Stencil also calls this when the element is only moved, which happens to every dropdown inside
		// another dropdown's list as that list's kv-portal moves itself to the body. So the element is
		// checked after the move: a browser has already reinserted it by now, but Stencil's mock-doc only
		// reinserts it once this callback returns.
		queueMicrotask(() => {
			if (this.element.isConnected) {
				return;
			}

			removeOpenDropdown(this.element);
			// Requires deleting portal from outside KvPortal because KvPortal is moved to global context
			// and would only be destroyed when the global context is destroyed.
			this.portal?.remove();
		});
	}

	render() {
		return (
			<Host>
				<div id="dropdown-action" ref={el => (this.action = el)}>
					<slot name="action"></slot>
				</div>

				<kv-portal animated ref={el => (this.portal = el)} show={this.isOpen} reference={this.getActionElement()} options={this.options} zIndex={this.zIndex}>
					<div class="dropdown-base-list">
						{/* Shadow Root should be false to slot work here */}
						<slot name="list"></slot>
					</div>
				</kv-portal>
			</Host>
		);
	}
}
