import { IDropdownBase, IDropdownBaseEvents } from '../dropdown-base/dropdown-base.types';
import { ITextField } from '../text-field/text-field.types';

export interface IDropdown extends IDropdownBase {
	/** (optional) The text field options */
	inputConfig?: Partial<ITextField>;
}

export interface IDropdownEvents extends IDropdownBaseEvents {}
