import { EventEmitter } from '@stencil/core';

export interface ICalendar {
	/** (optional) The currently selected dates */
	selectedDates?: string[];
	/** (optional) Initial date */
	initialDate?: string;
	/** (options) The disabled dates array */
	disabledDates?: string[];
	/** (optional) Minimum accepted date */
	minDate?: string;
	/** (optional) Maximum accepted date */
	maxDate?: string;
}

export interface ICalendarEvents {
	/** Emitted when a month changes */
	changeMonth: EventEmitter<IChangeMonthEvent>;
	/** Emitted when a year changes */
	changeYear: EventEmitter<IChangeYearEvent>;
	/** Emitted when a date is clicked */
	clickDate: EventEmitter<IClickDateEvent>;
}

export interface IClickDateEvent {
	event: MouseEvent;
	payload: string;
}

export interface IChangeMonthEvent {
	event: MouseEvent;
	payload: number;
}

export interface IChangeYearEvent {
	event: MouseEvent;
	payload: number;
}

export type SelectedRange = [] | [string] | [string, string];
