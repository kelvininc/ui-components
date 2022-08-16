import { EventEmitter } from '@stencil/core';
import { ICalendar } from '../calendar/calendar.types';

export interface ICalendarRangeDatesSelector extends Omit<ICalendar, 'selectedDates'> {
	/** (optional) Currently selected range dates */
	selectedRangeDates?: [] | [string] | [string, string];
}

export interface ICalendarRangeDatesSelectorEvents {
	/** Emitted when range dates are selected */
	selectRangeDates: EventEmitter<ISelectRangeDates>;
}

export interface ISelectRangeDates {
	event: MouseEvent;
	payload: [] | [string] | [string, string];
}
