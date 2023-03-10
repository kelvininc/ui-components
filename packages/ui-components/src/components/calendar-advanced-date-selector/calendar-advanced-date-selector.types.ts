import { EventEmitter } from '@stencil/core';
import dayjs from 'dayjs';
import { SelectedRange, DateInput, ITextField } from '../../types';

export interface ICalendarAdvancedDateSelector {
	/** (optional) The selected time range */
	selectedTime?: ICalendarAdvanceSelectedTime;
	/** (optional) The absolute time custom configurations */
	absoluteTimeConfig?: ICalendarAdvanceAbsoluteTimeConfig;
	/** (optional) The absolute time custom configurations */
	relativeTimeConfig?: ICalendarAdvanceRelativeTimeConfig;
	/** (optional) Currently selected timezone name */
	selectedTimezone?: string;
	/** (optional) List with all selectable timezones */
	timezones?: string[];
}

export interface ICalendarAdvancedDateSelectorEvents {
	/** Emitted when the relative time selector changes */
	relativeTimeChange: EventEmitter<ICalendarAdvanceTime>;
	/** Emitted when the absolute time selector changes */
	absoluteTimeChange: EventEmitter<ICalendarAdvanceTime>;
	/** Emitted when selected timezone changes */
	timezoneChange: EventEmitter<string>;
	/** Emitted when the range calendar dropdown open state changes */
	rangeDropdownStateChange: EventEmitter<boolean>;
	/** Emitted when the timezone dropdown open state changes */
	timezoneDropdownStateChange: EventEmitter<boolean>;
}
export interface ICalendarAdvanceAbsoluteTimeConfig {
	/** (optional) Absolute time selector calendars initial date */
	initialDate?: string;
	/** (options) Absolute time selector dates array */
	disabledDates?: string[];
	/** (optional) Absolute time selector minimum accepted date */
	minDate?: string;
	/** (optional) Absolute time selector maximum accepted date */
	maxDate?: string;
	/** (optional) The start date text field input custom configurations */
	startInputConfig?: IInputConfig;
	/** (optional) The end date text field input custom configurations */
	endInputConfig?: IInputConfig;
}

export interface IInputConfig extends Partial<ITextField> {
	/** (optional) Text field date format mask */
	dateMask?: string;
}

export interface ICalendarAdvanceRelativeTimeConfig {
	/** (optional) Relative time options */
	options?: RelativeTimeOption[];
}

export type TimeCalculation = {
	// time which the calculation should be relative to.
	// if undefined, now will be used
	relativeDate?: DateInput;
	// the amount of units to add to the relative time
	// if this number is negative, the amount will be subtracted
	amount: number;
	// the unit type to add/subtract to the relative time
	unit: dayjs.ManipulateType;
};

export type RelativeTimeOption = {
	/** (required) The text to display on the item */
	label: string;
	/** (required) The item value */
	value: string;
	/** (optional) If `true` the item is disabled */
	disabled?: boolean;
	/** (optional) The relative time start date range. If undefined, now will be used */
	startDate?: TimeCalculation;
	/** (optional) The relative time end date range. If undefined, now will be used */
	endDate?: TimeCalculation;
};

export enum ECalendarAdvanceTimeType {
	Absolute = 'absolute',
	Relative = 'relative'
}

export type ICalendarAdvanceTime = {
	key: string;
	range: SelectedRange;
};

export interface ICalendarAdvanceSelectedTime {
	type: ECalendarAdvanceTimeType;
	key?: string;
}

export interface ICalendarAdvanceTimeChange {
	type: ECalendarAdvanceTimeType;
	payload?: ICalendarAdvanceTime;
}

export interface ITimezoneOffset {
	name: string;
	offset: number;
	label: string;
}

export type ICalendarTimezone = Omit<ITimezoneOffset, 'label'>;
