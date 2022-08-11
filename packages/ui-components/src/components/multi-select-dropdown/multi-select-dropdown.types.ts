import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export interface IMultiSelectDropdownOption {
	label: string;
	value: string;
	disabled?: boolean;
}

export interface IMultiSelectDropdownOptions {
	[key: string]: IMultiSelectDropdownOption;
}

export interface IMultiSelectDropdown {
	/** (required) The text to display as the dropdown placeholder */
	placeholder?: string;
	/** (optional) If `true` the dropdown is opened */
	isOpen?: boolean;
	/** (optional) If `true` the dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
	/** (optional) If `true` the dropdown is searchable */
	searchable?: boolean;
	/** (optional) If `true` dropdown items can be cleared */
	selectionClearable?: boolean;
	/** (optional) The clear search action text */
	clearSelectionLabel?: string;
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
	options?: IMultiSelectDropdownOptions;
	/** (optional) The array of selected options */
	selectedOptions?: string[] | number[];
}

export interface IMultiSelectDropdownEvents {
	/** Emitted when the selected options change */
	optionsSelected: EventEmitter<string[] | number[]>;
	/** Emitted when the search term changes */
	searchChange: EventEmitter<string>;
	/** Emitted when the selection is cleared */
	selectionCleared: EventEmitter<void>;
}
