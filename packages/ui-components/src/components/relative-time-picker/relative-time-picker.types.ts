import { EventEmitter } from '@stencil/core';
import { DateInput, SelectedRange } from '../../types';
import dayjs from 'dayjs';

export interface IRelativeTimePicker {
	/** (optional) Selected time range key */
	selectedTimeKey?: string;
	/** (optional) Selectable relative time options */
	options?: IRelativeTimePickerOption[][];
	/** (optional) Currently selected timezone name */
	selectedTimezone?: string;
	/** (optional) List of all selectable timezones */
	timezones?: string[];
	/** (optional) Defines if the customize interval select option is available */
	customizeIntervalOptionVisible?: boolean;
	/** (optional) Defines if the timezone select option is available */
	timezoneSelectVisible?: boolean;
}

export interface IRelativeTimePickerEvents {
	/** Emitted when the selected time key changes */
	selectedRelativeTimeChange: EventEmitter<ITimePickerRelativeTime>;
	/** Emitted when customize interval is clicked */
	customizeIntervalClicked: EventEmitter<string>;
	/** Emitted when selected timezone changes */
	timezoneChange: EventEmitter<ITimePickerTimezone>;
}

export interface IRelativeTimePickerOption {
	/** (required) Option label ex: Last Week, Last 24h */
	label: string;
	/** (required) value of the option selected */
	value: string;
	/** (required) Specifies the type of relative time config to be considered for the time calculation */
	comparisonConfig: ERelativeTimeComparisonConfig;
	/** (optional) used to format the time range label description ex: 14 Feb until 12:39 */
	labelRangeFormatter?: IDateTimeRangeFormatter;
	/** (optional) start date (Date, Time or DateTime can be defined with the dateTimeFormatter) */
	startDate?: DateTimeCalculation;
	/** (optional) end date (Date, Time or DateTime can be defined with the dateTimeFormatter) */
	endDate?: DateTimeCalculation;
}

export type DateTimeCalculation = {
	// Date which the calculation should be relative to.
	// if undefined, now will be used
	date?: DateInput;
	// the amount of units to add to the relative time
	// if this number is negative, the amount will be subtracted
	amount?: number;
	// the unit type to add/subtract to the relative time
	unit?: dayjs.ManipulateType | dayjs.QUnitType;
};

export interface IDateTimeRangeFormatter {
	/** Defines how the initial date is formatted on the relative time select description
	 * 	If empty, now start date will be displayed
	 */
	startDateFormatter?: string;
	/** Defines how the initial date is formatted on the relative time select description
	 *  If empty, now end date will be displayed
	 */
	endDateFormatter?: string;
	/** Defines how the start date and end date are separated. Ex: "[until]" => <start-date> until <end-date>
	 *  If empty, no separator will appear between dates
	 */
	separator?: string;
}

/** Defines how the time calculation should be done */
export enum ERelativeTimeComparisonConfig {
	/** Subtract or add an amount of units (day, hour, months, quarters, ...)
	 * but takes into consideration the start and end date
	 * Ex: (last quarter, last week, yesterday)
	 */
	AbsoluteAmountOfUnits = 'absoluteAmountOfUnits',
	/** Subtract or add an amount of units (day, hour, months, quarters, ...)
	 * but compares the unit with current timestamp
	 * Ex: (last 5 minutes, last 24 hours)
	 */
	RelativeAmountOfUnits = 'relativeAmountOfUnits',
	/** Compare a start date (with date, time, or dateTime) with now */
	StartDate = 'startDate',
	/** Compare an end date (with date, time, or dateTime) with now */
	EndDate = 'endDate',
	/** Compare an absolute start date with an end date */
	StartDateEndDate = 'startDateEndDate'
}

export interface IRelativeTimeDropdownOption {
	key: string;
	label: string;
	value: string;
	description?: string;
	range: SelectedRange;
}

export type ITimePickerRelativeTime = {
	key: string;
	range: SelectedRange;
};

export type ITimePickerTimezone = {
	name: string;
	offset: number;
};

export type SelectedRangeDetail = {
	range: SelectedRange;
	description: string;
};
