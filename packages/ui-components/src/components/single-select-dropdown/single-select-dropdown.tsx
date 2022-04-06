import { Component, Host, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { isEmpty, isNil } from 'lodash-es';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import {
	ISingleSelectDropdownOption,
	ISingleSelectDropdown,
	ISingleSelectDropdownOptions,
	ISingleSelectDropdownEvents,
	SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE
} from './single-select-dropdown.types';

@Component({
	tag: 'kv-single-select-dropdown',
	styleUrl: 'single-select-dropdown.scss',
	shadow: true
})
export class KvSingleSelectDropdown implements ISingleSelectDropdown, ISingleSelectDropdownEvents {
	/** (optional) The text to display as the dropdown placeholder */
	@Prop({ reflect: true }) placeholder: string;
	/** (optional) If `true` the list is opened */
	@Prop({ reflect: true }) isOpen?: boolean = false;
	/** (optional) If `true` the list dropdown is loading */
	@Prop({ reflect: true }) loading?: boolean = false;
	/** (optional) The icon to display on the dropdown */
	@Prop({ reflect: true }) icon?: EIconName | EOtherIconName;
	/** (optional) If `true` the dropdown is searchable */
	@Prop({ reflect: true }) searchable?: boolean = false;
	/** (optional) If `true` dropdown requires a value to be selected */
	@Prop({ reflect: true }) required?: boolean = false;
	/** (optional) The text to display on the dropdown label */
	@Prop({ reflect: true }) label?: string;
	/** (optional) The text to display on the dropdown  */
	@Prop({ reflect: true }) value?: string;
	/** (required) The error state for the dropdown */
	@Prop({ reflect: true }) errorState?: EValidationState = EValidationState.None;
	/** (optional) The text to display as help text  */
	@Prop({ reflect: true }) helpText?: string;
	/** (optional) If `true` the dropdown is disabled */
	@Prop({ reflect: true }) disabled?: boolean = false;
	/** (required) The text to display when there are no options */
	@Prop({ reflect: true }) noDataAvailableLabel?: string = SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE;
	/** (optional) The object with the dropdown options */
	@Prop({ reflect: true }) options?: ISingleSelectDropdownOptions = {};
	/** (optional) The value of the selected option */
	@Prop({ reflect: true }) selectedOption?: string;

	/** Emitted when the selected option change */
	@Event() optionSelected: EventEmitter<string>;
	/** Emitted when the search term changes */
	@Event() searchChange: EventEmitter<string>;

	private selectOption = (event: CustomEvent<string>) => {
		const selectedOption = event.detail;
		const option = this.options[selectedOption];

		this.value = option.label;
		this.optionSelected.emit(option.value);
		this.isOpen = false;
	};

	private onSearchChange = (event: CustomEvent<string>) => {
		this.searchChange.emit(event.detail);
	};

	private openStateChangeHandler = (event: CustomEvent<boolean>) => {
		this.isOpen = event.detail;
	};

	componentWillLoad() {
		if (isNil(this.value) && this.selectedOption?.length > 0 && !isEmpty(this.options)) {
			this.value = this.options[this.selectedOption].label;
		}
	}

	@Watch('options')
	optionsChangeHandler(newValue: { [key: string]: ISingleSelectDropdownOption }) {
		if (!isNil(this.selectedOption) && !isNil(newValue[this.selectedOption])) {
			this.value = newValue[this.selectedOption].label;
		} else {
			this.value = undefined;
			this.selectedOption = undefined;
		}
	}

	render() {
		return (
			<Host>
				<kv-dropdown
					isOpen={this.isOpen}
					label={this.label}
					value={this.value}
					loading={this.loading}
					icon={this.icon}
					disabled={this.disabled}
					required={this.required}
					placeholder={this.placeholder}
					errorState={this.errorState}
					helpText={this.helpText}
					onOpenStateChange={this.openStateChangeHandler}
				>
					<kv-dropdown-list searchable={this.searchable} onSearchChange={this.onSearchChange}>
						{isEmpty(this.options) && <kv-dropdown-list-item class="no-data" label={this.noDataAvailableLabel} value={null} />}
						{Object.values(this.options).map(option => (
							<kv-dropdown-list-item label={option.label} value={option.value} selected={option.value === this.selectedOption} onItemSelected={this.selectOption} />
						))}
					</kv-dropdown-list>
				</kv-dropdown>
			</Host>
		);
	}
}
