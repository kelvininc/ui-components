import { EventEmitter } from '@stencil/core';
import { EAbsoluteTimePickerMode, ITimePickerTimezone } from '../../types';
import { IDateTimeInput } from '../date-time-input/date-time-input.types';

export type SelectedTime = [number] | [number, number];
export type SelectedTimeState = [] | [number] | [number, number];

export type SingleTime = string | undefined;
export type TimeRange = {
	from?: string;
	to?: string;
};

/**
 * The subset of `kv-date-time-input` props that can be customized on the picker's inputs.
 * Props the component controls internally (value, date format, input mask, focus, style, disabled
 * state and the dropdown toggle icon) are intentionally excluded because overriding them would break
 * the picker.
 */
export type IAbsoluteTimeDateTimeInputConfig = Omit<Partial<IDateTimeInput>, 'value' | 'dateFormat' | 'useInputMask' | 'forcedFocus' | 'inputStyleType' | 'disabled' | 'rightIcon'>;

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
	/** (optional) Customizes the "from" date-time input (also used as the single input in single mode). Merged over the built-in defaults. */
	fromInputConfig?: IAbsoluteTimeDateTimeInputConfig;
	/** (optional) Customizes the "to" date-time input (range mode only). Merged over the built-in defaults. */
	toInputConfig?: IAbsoluteTimeDateTimeInputConfig;
	/** (optional) Number of month calendars shown in the dropdown. Minimum 1, no upper limit. Default 2. */
	numberOfCalendars?: number;
}

export interface IAbsoluteTimePickerDropdownInputEvents {
	/** Selected time change */
	selectedTimeChange: EventEmitter<SelectedTime>;
	/** Dropdown open state change */
	dropdownStateChange: EventEmitter<boolean>;
}
