import { EventEmitter } from '@stencil/core';
import { ICalendar, SelectedRange } from '../calendar/calendar.types';

export interface ICalendarRangeDatesSelector extends Omit<ICalendar, 'selectedDates'> {
	/** (optional) Currently selected range dates */
	selectedRangeDates?: SelectedRange;
}

export interface ICalendarRangeDatesSelectorEvents {
	/** Emitted when range dates are selected */
	selectRangeDates: EventEmitter<ISelectRangeDates>;
}

export interface ISelectRangeDates {
	event: MouseEvent;
	payload: SelectedRange;
}
