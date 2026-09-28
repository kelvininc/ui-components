import { ComputePositionConfig } from '@floating-ui/dom';
import { ITextField } from '../text-field/text-field.types';
import { IRelativeTimePickerOption, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { EventEmitter } from '@stencil/core';
import { EAbsoluteTimePickerMode, ETooltipPosition } from '../../types';

export interface ITimePicker {
	/** (optional) Configuration of the dropdown input */
	inputConfig?: Partial<ITextField>;
	/** (optional) Dropdown possible positions */
	dropdownPositionOptions?: Partial<ComputePositionConfig>;
	/** (optional) Defines if the dropdown panel is open. Two-way: the component assigns it as the user opens and closes the panel, and emits `dropdownStateChange` alongside */
	isOpen?: boolean;
	/** (optional) The element the panel is positioned against, and which the click-outside check treats as "inside". Defaults to the picker's own action wrapper, which is what a projected `dropdown-action` trigger sits in */
	actionElement?: HTMLElement | null;
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
	/** (optional) Determines if the customize interval option is visible */
	displayCustomizeInterval?: boolean;
	/** (optional) Determines if the timezone dropdown is visible */
	displayTimezoneDropdown?: boolean;
	/** (optional) Determines if the "Show Calendar" toggle is visible in the footer. Hiding it does not prevent `showCalendar` from being set programmatically */
	displayCalendarToggle?: boolean;
	/** (optional) Defines if the custom interval calendar selects a single date or a range. In single mode, the custom option and the calendar title read "Custom Date" instead of "Custom Interval" */
	calendarMode?: EAbsoluteTimePickerMode;
	/** (optional) Lets the timezone visible but doesn't let the user change it */
	disableTimezoneSelection?: boolean;
	/** (optional) Earliest date, in timestamp, that can be picked or typed in the calendar; Apply is disabled for a custom selection before it. Defaults to 01-01-2018 00:00:00 in the selected timezone */
	calendarInputMinDate?: number;
	/** (optional) Latest date, in timestamp, that can be picked or typed in the calendar; Apply is disabled for a custom selection after it. Defaults to 31-12-3000 23:59:59 in the selected timezone */
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

export enum ETimePickerView {
	RelativeTimePicker = 'relativeTimePicker',
	AbsoluteTimePicker = 'absoluteTimePicker',
	FullView = 'fullView'
}
