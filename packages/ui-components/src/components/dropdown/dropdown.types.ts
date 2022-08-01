import { IDropdownBase, IDropdownBaseEvents } from '../dropdown-base/dropdown-base.types';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export interface IDropdown extends IDropdownBase {
	/** (optional) The text to display as the dropdown placeholder */
	placeholder: string;
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
	helpText?: string | string[];
	/** (optional) If `true` the dropdown is disabled */
	disabled?: boolean;
	/** (optional) If `true` the dropdown requires a value to be selected */
	required?: boolean;
}

export interface IDropdownEvents extends IDropdownBaseEvents {}
