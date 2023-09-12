import { ISelectMultiOptionsConfig, ISelectMultiOptionsEvents } from '../select-multi-options/select-multi-options.types';

export interface ILabelsDropdown extends ISelectMultiOptionsConfig {
	/** (Optional) Allows outside implementation to open/close dropdown on demand */
	isOpen?: boolean;
}

export interface ILabelsDropdownEvents extends Omit<ISelectMultiOptionsEvents, 'dismiss' | 'optionSelected'> {}
