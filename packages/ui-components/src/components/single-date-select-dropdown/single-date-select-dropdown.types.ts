import { EventEmitter } from '@stencil/core';
import { ITextField } from '../../types';
import { ICalendarSingleDateSelector, ICalendarSingleDateSelectorEvents } from '../calendar-single-date-selector/calendar-single-date-selector.types';

export interface ISingleDateSelectDropdown extends ICalendarSingleDateSelector {
	/** (optional) The text field dropdown custom configurations */
	dropdownConfig?: Partial<ITextField>;
	/** (optional) The text field date format mask */
	dateMask?: string;
}

export interface ISingleDateSelectDropdownEvents extends ICalendarSingleDateSelectorEvents {
	/** Emitted when the calendar selector opens state changes */
	openStateChange: EventEmitter<boolean>;
}
