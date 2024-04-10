import { ComputePositionConfig } from '@floating-ui/dom';
import { ITextField } from '../text-field/text-field.types';
import { IRelativeTimePickerOption, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { EventEmitter } from '@stencil/core';
import { ETooltipPosition } from '../../types';

export interface ITimePicker {
	/** (optional) Configuration of the dropdown input */
	inputConfig?: Partial<ITextField>;
	/** (optional) Dropdown possible positions */
	dropdownPositionOptions?: Partial<ComputePositionConfig>;
	/** (optional) Defines if the dropdown is disabled */
	disabled?: boolean;
	/** (optional) Determines if the show calendar toggle is enabled */
	showCalendar?: boolean;
	/** (optional) Selected time key */
	selectedTimeOption?: ITimePickerTimeState | ITimePickerTime;
	/** (optional) Relative time picker options*/
	relativeTimePickerOptions?: IRelativeTimePickerOption[][];
	/** (optional) Timezones */
	timezones?: ITimezoneOffset[];
	/** (optional) Determines if the customize interval otion is visible */
	displayCustomizeInterval?: boolean;
	/** (optional) Determines if the timezone dropdown is visible */
	displayTimezoneDropdown?: boolean;
	/** (optional) Lets the timezone visible but doens't let the user change it */
	disableTimezoneSelection?: boolean;
	/** (optional) calendar minimum date to be navigated */
	calendarInputMinDate?: number;
	/** (optional) calendar maximum date to be navigated */
	calendarInputMaxDate?: number;
	/** (optional) The time picker's z-index (default: 9003) */
	zIndex?: number;
	/** (optional) Positioning of the tooltip */
	tooltipPosition?: ETooltipPosition;
}

export interface ITimePickerEvents {
	/** Emitted when time range changes */
	timeRangeChange: EventEmitter<ITimePickerTime>;
	/** Emitted when dropdown state changes */
	dropdownStateChange: EventEmitter<boolean>;
	/** Emitted when cancel button is clicked */
	cancelClicked: EventEmitter<CustomEvent<MouseEvent>>;
	/** Emitted when show calendar button state changes */
	showCalendarStateChange: EventEmitter<boolean>;
}

export interface ITimePickerTimeState {
	key: string;
	range: SelectedTimestamp;
	timezone?: ITimePickerTimezone;
}

export interface ITimePickerTime {
	key: string;
	range: [number] | [number, number];
	timezone: ITimePickerTimezone;
}

export type SelectedTimestamp = [] | [number] | [number, number];

export interface ITimezoneOffset {
	name: string;
	offset: number;
	label: string;
}
