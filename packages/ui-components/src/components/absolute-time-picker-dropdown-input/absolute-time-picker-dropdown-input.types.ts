import { EventEmitter } from '@stencil/core';
import { EAbsoluteTimePickerMode, ITimePickerTimezone } from '../../types';

export type SelectedTime = [number] | [number, number];
export type SelectedTimeState = [] | [number] | [number, number];

export type SingleTime = string | undefined;
export type TimeRange = {
	from?: string;
	to?: string;
};

export interface IAbsoluteTimePickerDropdownInput {
	/** (optional) Selected time in timestamp */
	selectedTime?: SelectedTime | SelectedTimeState;
	/** (optional) Timezone of the provided timestamp */
	timezone?: ITimePickerTimezone;
	/** (optional) Mode of the input: single, range */
	mode?: EAbsoluteTimePickerMode;
	/** (optional) Determines if the dropdown is open */
	isDropdownOpen?: boolean;
	/** (optional) Defines if the inputs for inserting the dates are disabled. */
	disabled?: boolean;
	/** (optional) Initial date displayed on the calendars */
	initialDate?: number;
	/** (optional) calendar from input minimum date */
	minimumFromInputDate?: number;
	/** (optional) calendar to input minimum date */
	minimumToInputDate?: number;
	/** (optional) calendar single input minimum date */
	minimumSingleInputDate?: number;
}

export interface IAbsoluteTimePickerDropdownInputEvents {
	/** Selected time change */
	selectedTimeChange: EventEmitter<SelectedTime>;
	/** Dropdown open state change */
	dropdownStateChange: EventEmitter<boolean>;
}
