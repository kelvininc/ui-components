import { EventEmitter } from '@stencil/core';
import { ICustomCss, ITimezoneOffset, SelectedTimestamp } from '../../types';
import { DateTimeCalculation, IDateTimeRangeFormatter, ERelativeTimeRangeKey } from '../../utils/relative-time/relative-time.types';

/**
 * @deprecated Import from '@kelvininc/ui-components/utils/dates' instead
 */
export { EUnitReference, DateTimeCalculation, IDateTimeRangeFormatter } from '../../utils/relative-time/relative-time.types';

export interface IRelativeTimePicker extends ICustomCss {
	/** (optional) Selected time range key */
	selectedTimeKey?: string;
	/** (optional) Selectable relative time options */
	options?: IRelativeTimePickerOption[][];
	/** (optional) Currently selected timezone name */
	selectedTimezone?: string;
	/** (optional) List of all selectable timezones */
	timezones?: ITimezoneOffset[];
	/** (optional) Defines if the customize interval select option is available */
	customIntervalOptionEnabled?: boolean;
	/** (optional) Defines if the timezone select option is available */
	timezoneSelectionEnabled?: boolean;
	/** (optional) Lets the timezone visible but doens't let the user change it */
	disableTimezoneSelection?: boolean;
	/** (optional) Determines if the input wrapper content containing the timezone is visible
	 * if true, the dropdown will be visible; if false, the content will display the timezone title
	 */
	timezoneContentVisible?: boolean;
}

export interface IRelativeTimePickerEvents {
	/** Emitted when the selected time key changes */
	selectedRelativeTimeChange: EventEmitter<ITimePickerRelativeTime>;
	/** Emitted when customize interval is clicked */
	customizeIntervalClicked: EventEmitter<string>;
	/** Emitted when selected timezone changes */
	timezoneChange: EventEmitter<ITimePickerTimezone>;
	/** Emitted when the input wrapper containing the timezone is clicked */
	timezoneInputClicked: EventEmitter<boolean>;
	/** Emitted when the timezone dropdown open state changes */
	timezoneDropdownStateChange: EventEmitter<boolean>;
}

export interface IRelativeTimePickerOption {
	/** (required) Option label ex: Last Week, Last 24h */
	label: string;
	/** (required) value of the option selected */
	value: ERelativeTimeRangeKey;
	/** (required) Specifies the type of relative time config to be considered for the time calculation */
	comparisonConfig: ERelativeTimeComparisonConfig;
	/** (optional) used to format the time range label description ex: 14 Feb until 12:39 */
	labelRangeFormatter?: IDateTimeRangeFormatter;
	/** (optional) start date (Date, Time or DateTime can be defined with the dateTimeFormatter) */
	startDate?: DateTimeCalculation;
	/** (optional) end date (Date, Time or DateTime can be defined with the dateTimeFormatter) */
	endDate?: DateTimeCalculation;
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
	range: SelectedTimestamp;
}

export type ITimePickerRelativeTime = {
	key: string;
	range: SelectedTimestamp;
};

export type ITimePickerTimezone = {
	name: string;
	offset: number;
};
