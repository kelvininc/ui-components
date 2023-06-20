import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { EComponentSize } from '../../types';
import { ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from '../select-multi-options/select-multi-options.types';

export interface IMultiSelectDropdownOption {
	label: string;
	value: string;
	disabled?: boolean;
	group?: string;
}

export interface IMultiSelectDropdownOptions {
	[key: string]: IMultiSelectDropdownOption;
}

export interface IMultiSelectDropdown extends Omit<ISelectMultiOptionsConfig, 'searchValue'> {
	/** (required) The text to display as the dropdown placeholder */
	placeholder?: string;
	/** (optional) If `true` the dropdown is opened */
	isOpen?: boolean;
	/** (optional) If `true` the dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
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
	/** (optional) The size of the input */
	inputSize?: EComponentSize;
}

export interface IMultiSelectDropdownEvents extends ISelectMultiOptionsEvents {
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
}
