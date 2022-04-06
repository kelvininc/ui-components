import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { ClickOutside } from 'stencil-click-outside';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState } from '../text-field/text-field.types';
import { DROPDOWN_DEFAULT_PLACEHOLDER } from './dropdown.types';

@Component({
	tag: 'kv-dropdown',
	styleUrl: 'dropdown.scss',
	shadow: true
})
export class KvDropdown {
	/** (optional) The text to display as the dropdown placeholder */
	@Prop({ reflect: true }) placeholder: string = DROPDOWN_DEFAULT_PLACEHOLDER;
	/** (optional) If `true` the list is opened */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** (optional) If `true` the dropdown is loading */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** (optional) The text to display on the dropdown label */
	@Prop({ reflect: true }) label?: string;
	/** (optional) The text to display on the dropdown  */
	@Prop({ reflect: true }) value?: string;
	/** (optional) The icon to display on the dropdown */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** (required) The error state for the dropdown */
	@Prop({ reflect: true }) errorState?: EValidationState = EValidationState.None;
	/** (optional) The text to display as help text  */
	@Prop({ reflect: true }) helpText?: string;
	/** (optional) If `true` the dropdown is disabled */
	@Prop({ reflect: true }) disabled?: boolean;
	/** (optional) If `true` the dropdown requires a value to be selected */
	@Prop({ reflect: true }) required?: boolean;

	/** Emitted when the dropdown opens state changes */
	@Event() openStateChange: EventEmitter<boolean>;

	// eslint-disable-next-line @stencil/own-props-must-be-private
	@ClickOutside({
		exclude: 'kv-single-select-dropdown, kv-multi-select-dropdown'
	})
	onClickOutside = () => {
		this.isOpen = false;
		this.openStateChange.emit(this.isOpen);
	};

	private onToggleOpenState = () => {
		this.isOpen = !this.isOpen;
		this.openStateChange.emit(this.isOpen);
	};

	render() {
		return (
			<Host>
				<div class="dropdown-container">
					<kv-text-field
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
						<div class="dropdown-list">
							<slot></slot>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
