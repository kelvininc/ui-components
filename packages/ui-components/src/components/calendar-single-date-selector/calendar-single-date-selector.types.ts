import { EventEmitter } from '@stencil/core';
import { ICalendar } from '../calendar/calendar.types';

export interface ICalendarSingleDateSelector extends Omit<ICalendar, 'selectedDates'> {
	/** (optional) Currently selected date */
	selectedDate?: string;
}

export interface ICalendarSingleDateSelectorEvents {
	/** Emitted when day is selected */
	selectDate: EventEmitter<ISelectDate>;
}

export interface ISelectDate {
	event: MouseEvent;
	payload?: string;
}
