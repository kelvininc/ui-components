import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export interface IDropdown {
	/** (optional) The text to display as the dropdown placeholder */
	placeholder: string;
	/** (optional) If `true` the list is opened */
	isOpen?: boolean;
	/** (optional) If `true` the dropdown is loading */
	loading?: boolean;
	/** (optional) The text to display on the dropdown label */
	label?: string;
	/** (optional) The text to display on the dropdown  */
	value?: string;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
	/** (required) The error state for the dropdown */
	errorState?: EValidationState;
	/** (optional) The text to display as help text  */
	helpText?: string;
	/** (optional) If `true` the dropdown is disabled */
	disabled?: boolean;
	/** (optional) If `true` the dropdown requires a value to be selected */
	required?: boolean;
}

export interface IDropdownEvents {
	/** Emitted when the dropdown opens state changes */
	openStateChange: EventEmitter<boolean>;
}
