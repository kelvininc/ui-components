import { EventEmitter } from '@stencil/core';
import { ITextField } from '../text-field/text-field.types';
import { EAbsoluteTimePickerMode, ETooltipPosition, ITimePickerTimezone, ITimezoneOffset, SelectedTimestamp } from '../../types';
import { ComputePositionConfig } from '@floating-ui/dom';

export interface IAbsoluteTimePickerDropdown {
	/** (optional) Defines if the calendar is in single date or range mode */
	mode?: EAbsoluteTimePickerMode;
	/** (optional) Enables the back button displayed on top */
	displayBackButton?: boolean;
	/** (optional) Selected dates */
	selectedDates?: SelectedTimestamp;
	/** (optional) Initial Date */
	initialDate?: string;
	/** (optional) Disabled dates */
	disabledDates?: string[];
	/** (optional) calendar minimum date to be navigated in timestamp */
	calendarInputMinDate?: number;
	/** (optional) calendar maximum date to be navigated in timestamp */
	calendarInputMaxDate?: number;
	/** (optional) dropdown input config */
	inputConfig?: Partial<ITextField>;
	/** (optional) Dropdown positioning config */
	dropdownPositionOptions?: Partial<ComputePositionConfig>;
	/** (optional) Positioning of the tooltip */
	tooltipPosition?: ETooltipPosition;
	/** (Optional) Timezone of the selected dates */
	timezone?: ITimePickerTimezone;
	/** (optional) Available Timezones */
	timezones?: ITimezoneOffset[];
	/** (optional) Title displayed on top of the component */
	headerTitle?: string;
	/** (optional) If `true` the dropdown is disabled. Default: `false`. */
	disabled?: boolean;
	/** (optional) If `true`the calendar dropdown is will be open. Default: `false`  */
	dropdownOpen?: boolean;
}

export interface IAbsoluteTimePickerDropdownEvents {
	/** Selected dates change */
	selectedDatesChange: EventEmitter<SelectedTimestamp>;
	/** Cancel button clicked */
	cancelClicked: EventEmitter<CustomEvent<MouseEvent>>;
	/** Dropdown open state change */
	dropdownStateChange: EventEmitter<boolean>;
}

export interface IAbsoluteTimeLimits {
	minDate?: number;
	maxDate?: number;
}

export enum EAbsoluteTimeError {
	EndDateBeforeStartDate = 'end-date-before-start-date',
	StartDateBeforeMinimumDate = 'start-date-before-minimum-date',
	EndDateAfterMaximumDate = 'end-date-after-maximum-date'
}
