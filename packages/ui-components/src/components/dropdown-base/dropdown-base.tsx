import { autoUpdate, computePosition, flip, offset, Placement } from '@floating-ui/dom';
import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core';
import { isTargetOnElement, getSlotElement } from './dropdown-base.helper';
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
	@Prop({ reflect: true }) placement?: Placement = 'bottom';

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;

	@Element() element: HTMLKvDropdownBaseElement;

	@Listen('click', { target: 'window' })
	checkForClickOutside(event: MouseEvent) {
		// Check if clicked inside the dropdown
		if (this.didClickOnDropdownAction(event) || this.didClickOnDropdownList(event)) {
			return;
		}

		if (this.isOpen) {
			this.openStateChange.emit(!this.isOpen);
		}
	}

	private didClickOnDropdownAction = (event: MouseEvent): boolean => {
		const dropdownActionElement = this.element.shadowRoot.querySelector('#dropdown-action') as HTMLElement | undefined;

		if (dropdownActionElement) {
			const slotElement = getSlotElement(dropdownActionElement);

			if (slotElement) {
				return isTargetOnElement(event, slotElement);
			}
		}

		return false;
	};

	private didClickOnDropdownList = (event: MouseEvent): boolean => {
		const dropdownListElement = this.element.shadowRoot.querySelector('#dropdown-list') as HTMLElement | undefined;

		if (dropdownListElement) {
			const hostElement = getSlotElement(dropdownListElement);

			if (hostElement) {
				if (isTargetOnElement(event, hostElement)) {
					return true;
				}

				const selectElement = getSlotElement(hostElement);

				if (selectElement) {
					return isTargetOnElement(event, selectElement);
				}
			}
		}

		return false;
	};

	private closePositionAutoUpdate: () => void;

	componentDidRender() {
		const dropdownAction = this.element.shadowRoot.querySelector('#dropdown-action') as HTMLElement;
		const dropdownList = this.element.shadowRoot.querySelector('#dropdown-list') as HTMLElement;

		if (this.isOpen) {
			this.closePositionAutoUpdate = autoUpdate(dropdownAction, dropdownList, () => {
				computePosition(dropdownAction, dropdownList, {
					placement: this.placement,
					middleware: [
						offset(8),
						flip({
							padding: 16,
							fallbackPlacements: ['top-end', 'bottom-end', 'top-start', 'bottom-start']
						})
					]
				}).then(({ x, y }) => {
					dropdownList.style.left = `${x}px`;
					dropdownList.style.top = `${y}px`;
				});
			});
		} else {
			if (this.closePositionAutoUpdate) {
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
