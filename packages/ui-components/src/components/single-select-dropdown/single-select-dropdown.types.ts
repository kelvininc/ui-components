import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export interface ISingleSelectDropdownOption {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface ISingleSelectDropdownOptions {
	[key: string]: ISingleSelectDropdownOption;
}

export interface ISingleSelectDropdown {
	/** (optional) The text to display as the dropdown placeholder */
	placeholder: string;
	/** (optional) If `true` the list is opened */
	isOpen?: boolean;
	/** (optional) If `true` the list dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
	/** (optional) If `true` the dropdown is searchable */
	searchable?: boolean;
	/** (optional) If `true` dropdown requires a value to be selected */
	required?: boolean;
	/** (optional) The text to display on the dropdown label */
	label?: string;
	/** (optional) The text to display on the dropdown  */
	displayValue?: string;
	/** (required) The error state for the dropdown */
	errorState?: EValidationState;
	/** (optional) The text to display as help text  */
	helpText?: string | string[];
	/** (optional) If `true` the dropdown is disabled */
	disabled?: boolean;
	/** (required) The text to display when there are no options */
	noDataAvailableLabel?: string;
	/** (optional) The object with the dropdown options */
	options?: ISingleSelectDropdownOptions;
	/** (optional) The value of the selected option */
	selectedOption?: string;
}

export interface ISingleSelectDropdownEvents {
	/** Emitted when the selected option change */
	optionSelected: EventEmitter<string>;
	/** Emitted when the search term changes */
	searchChange: EventEmitter<string>;
}
