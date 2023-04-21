import { EventEmitter } from '@stencil/core';

export interface ITimePickerCalendarDay {
	/** (required) Calendar day */
	day: Number;
	/** (optional) If `true`, the day is disabled */
	disabled?: boolean;
	/** (optional) If `true`, the day is with active */
	active?: boolean;
	/** (optional) If `true`, the day is in range from a start date to the current hovered day */
	inRange?: boolean;
	/** (optional) If `true` the day is the start of the range */
	isRangeStartDate?: boolean;
	/** (optional) If `true` the day is the end of the range */
	isRangeEndDate?: boolean;
	/** (optional) If `true`, the day is the day of `today`date */
	isToday?: boolean;
	/** (optional) If `true`, the day is between to selected dates */
	isBetweenSelectedDates?: boolean;
}

export interface ITimePickerCalendarDayEvents {
	/** Emitted when day button is clicked */
	clickDay: EventEmitter<number>;
	/** Emitted when day button is mouse enter */
	mouseEnterDay: EventEmitter<number>;
	/** Emitted when day button is mouse leave */
	mouseLeaveDay: EventEmitter<number>;
}
