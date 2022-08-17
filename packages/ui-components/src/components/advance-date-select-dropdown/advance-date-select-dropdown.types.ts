import { ComputePositionConfig } from '@floating-ui/dom';
import { EventEmitter } from '@stencil/core';
import { ITextField, ICalendarAdvanceTimeChange, ICalendarAdvanceDateSelector, ICalendarAdvanceDateSelectorEvents } from '../../types';

export interface IAdvanceDateSelectDropdown extends ICalendarAdvanceDateSelector {
	/** (optional) The text field dropdown custom configurations */
	inputConfig?: Partial<ITextField>;
	/** (optional) The text field date format mask in ISO 8601 format */
	dateMask?: string;
	/** (optional) The dropdown position options */
	dropdownPositionOptions?: Partial<ComputePositionConfig>;
}

export interface IAdvanceDateSelectDropdownEvents extends ICalendarAdvanceDateSelectorEvents {
	/** Emitted when the calendar selector opens state changes */
	openStateChange: EventEmitter<boolean>;
	/** Emitted when a time selector is applied */
	timeApplied: EventEmitter<ITimeChange>;
}

export interface ITimeChange {
	time: ICalendarAdvanceTimeChange;
	timezone: string;
}
