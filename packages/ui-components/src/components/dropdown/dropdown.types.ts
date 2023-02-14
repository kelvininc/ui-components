import { IDropdownBase, IDropdownBaseEvents } from '../dropdown-base/dropdown-base.types';
import { ITextField } from '../text-field/text-field.types';

export interface IDropdown extends IDropdownBase {
	/** (optional) The text field options */
	inputConfig?: Partial<ITextField>;
	/** (optional) If `true` clicking on the action will not open the dropdown list. Default: false */
	disabled?: boolean;
}

export interface IDropdownEvents extends IDropdownBaseEvents {}
