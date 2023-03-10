import { ComputePositionConfig } from '@floating-ui/dom';
import { EventEmitter } from '@stencil/core';
import { ITextField, ICalendarAdvanceTimeChange, ICalendarAdvancedDateSelector, ICalendarTimezone } from '../../types';

export interface IAdvancedDateSelectDropdown extends ICalendarAdvancedDateSelector {
	/** (optional) The text field dropdown custom configurations */
	inputConfig?: Partial<ITextField>;
	/** (optional) The text field date format mask in ISO 8601 format */
	dateMask?: string;
	/** (optional) The dropdown position options */
	dropdownPositionOptions?: Partial<ComputePositionConfig>;
	/** (optional) If `true` clicking on the input will not open the calendar dropdown. Default: false */
	disabled?: boolean;
}

export interface IAdvancedDateSelectDropdownEvents {
	/** Emitted when the calendar dropdown open state changes */
	dropdownStateChange: EventEmitter<boolean>;
	/** Emitted when the range calendar dropdown open state changes */
	rangeDropdownStateChange: EventEmitter<boolean>;
	/** Emitted when the timezone dropdown open state changes */
	timezoneDropdownStateChange: EventEmitter<boolean>;
	/** Emitted when a time selector is applied */
	timeApplied: EventEmitter<ITimeChange>;
}

export interface ITimeChange {
	time: ICalendarAdvanceTimeChange;
	timezone: ICalendarTimezone;
}
