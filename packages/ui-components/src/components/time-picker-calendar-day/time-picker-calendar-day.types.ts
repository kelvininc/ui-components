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
	clickDay: EventEmitter<IClickDayEvent>;
	/** Emitted when day button is mouse enter */
	mouseEnterDay: EventEmitter<IMouseEnterEvent>;
	/** Emitted when day button is mouse leave */
	mouseLeaveDay: EventEmitter<IMouseLeaveEvent>;
}

export interface IClickDayEvent {
	event: MouseEvent;
	payload: number;
}

export interface IMouseEnterEvent {
	event: MouseEvent;
	payload: number;
}

export interface IMouseLeaveEvent {
	event: MouseEvent;
	payload: number;
}
