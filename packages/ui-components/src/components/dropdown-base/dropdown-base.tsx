import { ComputePositionConfig } from '@floating-ui/dom';
import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element, State } from '@stencil/core';

import { DEFAULT_POSITION_CONFIG } from './dropdown-base.config';
import { IDropdownBase, IDropdownBaseEvents } from './dropdown-base.types';
import { didClickOnElement } from '../../utils/mouse-event.helper';
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
	@Prop({ reflect: false }) zIndex?: number = DEFAULT_DROPDOWN_Z_INDEX;

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;
	/** @inheritdoc */
	@Event() clickOutside: EventEmitter<void>;

	@Element() element: HTMLKvDropdownBaseElement;

	@Listen('mousedown', { target: 'window' })
	checkForClickOutside(event: MouseEvent) {
		// Check if clicked inside the dropdown
		if (this.didClickOnDropdownAction(event) || this.didClickOnDropdownList(event)) {
			return;
		}

		if (this.isOpen && this.clickOutsideClose) {
			this.openStateChange.emit(!this.isOpen);
		}

		this.clickOutside.emit();
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

	disconnectedCallback() {
		// Requires deleting portal from outside KvPortal because KvPortal is moved to global context
		// and would only be destroyed when the global context is destroyed.
		this.portal?.remove();
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
