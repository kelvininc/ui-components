import { EventEmitter } from '@stencil/core';

export interface ICalendarDay {
	/** (required) Calendar day */
	day: Number;
	/** (optional) If `true`, the day is disabled */
	disabled?: boolean;
	/** (optional) If `true`, the day is with active style */
	active?: boolean;
	/** (optional) If `true`, the day is with 'in-range' style */
	inRange?: boolean;
	/** (optional) If `true`, the day is left rounded style */
	leftRounded?: boolean;
	/** (optional) If `true`, the day is right rounded style */
	rightRounded?: boolean;
}

export interface ICalendarDayEvents {
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
