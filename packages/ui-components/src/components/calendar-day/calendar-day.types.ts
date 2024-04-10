import { EventEmitter } from '@stencil/core';

export interface ICalendarDay {
	/** (required) Calendar day */
	day: number;
	/** (optional) If `true`, the day is disabled */
	disabled?: boolean;
	/** (optional) If `true`, the day is with active */
	active?: boolean;
	/** (optional) If `true`, the day is between the two selected dates */
	isBetweenSelectedDates?: boolean;
	/** (optional) If `true`, the day is in range from a start date to the current hovered day */
	inHoverRange?: boolean;
	/** (optional) If `true` the day is the start or the end of the range */
	isEdge?: boolean;
	/** (optional) If `true`, the day is the day of `today`date */
	isToday?: boolean;
}

export interface ICalendarDayEvents {
	/** Emitted when day button is clicked */
	clickDay: EventEmitter<number>;
	/** Emitted when day button is mouse enter */
	mouseEnterDay: EventEmitter<number>;
	/** Emitted when day button is mouse leave */
	mouseLeaveDay: EventEmitter<number>;
}
