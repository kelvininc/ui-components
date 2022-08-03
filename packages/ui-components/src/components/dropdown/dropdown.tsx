import { autoUpdate, computePosition, flip, offset } from '@floating-ui/dom';
import { Component, Host, h, Prop, Event, EventEmitter, Listen, Element } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState } from '../text-field/text-field.types';
import { DROPDOWN_DEFAULT_PLACEHOLDER } from './dropdown.config';
import { IDropdown, IDropdownEvents } from './dropdown.types';

@Component({
	tag: 'kv-dropdown',
	styleUrl: 'dropdown.scss',
	shadow: true
})
export class KvDropdown implements IDropdown, IDropdownEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) placeholder: string = DROPDOWN_DEFAULT_PLACEHOLDER;
	/** @inheritdoc */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) label?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) value?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** @inheritdoc */
	@Prop({ reflect: true }) errorState?: EValidationState = EValidationState.None;
	/** @inheritdoc */
	@Prop({ reflect: true }) helpText?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) required?: boolean;

	/** @inheritdoc */
	@Event() openStateChange: EventEmitter<boolean>;

	@Element() el: HTMLKvDropdownElement;

	@Listen('click', { target: 'window' })
	checkForClickOutside(ev: { path: HTMLElement[] }) {
		if (ev.path.some(element => element === this.el)) {
			return;
		}

		this.isOpen = false;
		this.openStateChange.emit(this.isOpen);
	}

	private onToggleOpenState = () => {
		this.isOpen = !this.isOpen;
		this.openStateChange.emit(this.isOpen);
	};

	private closePositionAutoUpdate;

	componentDidRender() {
		const inputContainer = this.el.shadowRoot.querySelector('#dropdown-input');
		const input = inputContainer.shadowRoot.querySelector('input');
		const dropdownList = this.el.shadowRoot.querySelector('#dropdown-list') as HTMLElement;

		if (this.isOpen) {
			this.closePositionAutoUpdate = autoUpdate(input, dropdownList, () => {
				computePosition(input, dropdownList, {
					placement: 'bottom',
					middleware: [
						offset(8),
						flip({
							padding: 15,
							fallbackPlacements: ['top']
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
					<kv-text-field
						id="dropdown-input"
						label={this.label}
						value={this.value}
						loading={this.loading}
						type={EInputFieldType.Text}
						placeholder={this.placeholder}
						icon={this.icon}
						onClick={this.onToggleOpenState}
						uneditable={true}
						forcedFocus={this.isOpen}
						state={this.errorState}
						disabled={this.disabled}
						required={this.required}
						helpText={this.helpText}
					>
						<kv-icon slot="right-slot" name={this.isOpen ? EIconName.ArrowDropUp : EIconName.ArrowDropDown} customClass="icon-24" />
					</kv-text-field>

					{this.isOpen && (
						<div id="dropdown-list" class="dropdown-list">
							<slot></slot>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
