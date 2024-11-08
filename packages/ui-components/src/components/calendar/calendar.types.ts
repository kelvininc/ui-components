import { EventEmitter } from '@stencil/core';
import { EAbsoluteTimePickerMode } from '../../types';

export interface ICalendar {
	/** (optional) Defines if the calendar is in single date or range mode */
	mode?: EAbsoluteTimePickerMode;
	/** (optional) The currently selected dates */
	selectedDates?: string[];
	/** (optional) Initial date */
	initialDate?: string;
	/** (optional) Disables the hovering styling when the dates are being selected, and when start or end date is not defined */
	disableHoveringStyling?: boolean;
	/** (optional) Defines if a date is hovered */
	hoveredDate?: string;
	/** (options) The disabled dates array */
	disabledDates?: string[];
	/** (optional) Minimum accepted date. Format: YYYY-MM-DD */
	minDate?: string;
	/** (optional) Maximum accepted date. Format: YYYY-MM-DD */
	maxDate?: string;
	/** (optional) Enables the previous month click icon */
	displayPreviousMonthArrow?: boolean;
	/** (optional) Enables the next month click icon */
	displayNextMonthArrow?: boolean;
}

export interface ICalendarEvents {
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
