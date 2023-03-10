import { autoUpdate, computePosition, ComputePositionConfig } from '@floating-ui/dom';
import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core';
import { isNil } from 'lodash-es';

import { DEFAULT_POSITION_CONFIG } from './dropdown-base.config';
import { didClickOnElement } from './dropdown-base.helper';
import { IDropdownBase, IDropdownBaseEvents } from './dropdown-base.types';

@Component({
	tag: 'kv-dropdown-base',
	styleUrl: 'dropdown-base.scss',
	shadow: true
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
	@Prop({ reflect: true }) disabled?: boolean = false;

	/** @inheritdoc */
	@Event({ bubbles: false }) openStateChange: EventEmitter<boolean>;

	@Element() element: HTMLKvDropdownBaseElement;

	@Listen('click', { target: 'window' })
	checkForClickOutside(event: MouseEvent) {
		if (this.disabled) {
			return;
		}

		// Check if clicked inside the dropdown
		if (this.didClickOnDropdownAction(event) || this.didClickOnDropdownList(event)) {
			return;
		}

		if (this.isOpen) {
			this.openStateChange.emit(!this.isOpen);
		}
	}

	private getActionElement = (): HTMLElement | null => {
		return this.actionElement ?? (this.element.shadowRoot.querySelector('#dropdown-action') as HTMLElement | null);
	};

	private getListElement = (): HTMLElement | null => {
		return this.listElement ?? (this.element.shadowRoot.querySelector('#dropdown-list') as HTMLElement | null);
	};

	private didClickOnDropdownAction = (event: MouseEvent): boolean => {
		const dropdownActionElement = this.getActionElement();

		return didClickOnElement(dropdownActionElement, event);
	};

	private didClickOnDropdownList = (event: MouseEvent): boolean => {
		const dropdownListElement = this.getListElement();

		return didClickOnElement(dropdownListElement, event);
	};

	private closePositionAutoUpdate: () => void;

	componentDidRender() {
		const dropdownAction = this.getActionElement();
		const dropdownList = this.getListElement();

		if (this.isOpen) {
			this.closePositionAutoUpdate = autoUpdate(dropdownAction, dropdownList, () => {
				computePosition(dropdownAction, dropdownList, this.options).then(({ x, y }) => {
					dropdownList.style.left = `${x}px`;
					dropdownList.style.top = `${y}px`;
				});
			});
		} else {
			if (!isNil(this.closePositionAutoUpdate)) {
				this.closePositionAutoUpdate();
			}
		}
	}

	render() {
		return (
			<Host>
				<div class="dropdown-container">
					<div id="dropdown-action" class="dropdown-action">
						<slot name="action"></slot>
					</div>

					{this.isOpen && (
						<div id="dropdown-list" class="dropdown-list">
							<slot name="list"></slot>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
