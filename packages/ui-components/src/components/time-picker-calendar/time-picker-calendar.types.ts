import { EventEmitter } from '@stencil/core';

export interface ITimePickerCalendar {
	/** (optional) The currently selected dates */
	selectedDates?: string[];
	/** (optional) Initial date */
	initialDate?: string;
	/** (optional) Defines if a date is hovered */
	hoveredDate?: string;
	/** (options) The disabled dates array */
	disabledDates?: string[];
	/** (optional) Minimum accepted date */
	minDate?: string;
	/** (optional) Maximum accepted date */
	maxDate?: string;
	/** (optional) Enables the previous month click icon */
	displayPreviousMonthArrow?: boolean;
	/** (optional) Enables the next month click icon */
	displayNextMonthArrow?: boolean;
}

export interface ITimePickerCalendarEvents {
	/** Emitted when a month changes */
	changeMonth: EventEmitter<IChangeMonthEvent>;
	/** Emitted when a year changes */
	changeYear: EventEmitter<IChangeYearEvent>;
	/** Emitted when a date is clicked */
	clickDate: EventEmitter<IClickDateEvent>;
	/** Emitted when the hovered date changes */
	hoveredDateChange: EventEmitter<string>;
}

export interface IClickDateEvent {
	date: string;
}

export interface IChangeMonthEvent {
	month: number;
}

export interface IChangeYearEvent {
	year: number;
}