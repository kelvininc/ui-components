import { EventEmitter } from '@stencil/core';
import { EAbsoluteTimeError, EValidationState, SelectedRange } from '../../types';

export enum EAbsoluteTimePickerMode {
	Single = 'single',
	Range = 'range'
}

export interface IAbsoluteTimePicker {
	/** (optional) Defines if the calendar is in single date or range mode */
	mode?: EAbsoluteTimePickerMode;
	/** (optional) Title disaplayed on top of the component */
	headerTitle?: string;
	/** (optional) Enables the back button displayed on top */
	displayBackButton?: boolean;
	/** (optional) Selected dates */
	selectedDates?: string[];
	/** (optional) Initial Date */
	initialDate?: string;
	/** (optional) Disabled dates */
	disabledDates?: string[];
	/** (optional) use to determine if the chart inputs have custom strings */
	relativeTimeConfig?: IRelativeTimeInput;
	/** (optional) calendar minimum date to be navigated format: DD-MM-YYYY HH:mm:ss */
	calendarInputMinDate?: string;
	/** (optional) calendar maximum date to be navigated format: DD-MM-YYYY HH:mm:ss */
	calendarInputMaxDate?: string;
	/** (optional) It is used to determine if the time picker as date time input error */
	error?: EAbsoluteTimeError;
}

export interface IAbsoluteTimePickerEvents {
	/** Selected dates change */
	selectedDatesChange: EventEmitter<IAbsoluteSelectedRangeDates>;
	/** Emitted when the back button is clicked */
	backButtonClicked: EventEmitter<MouseEvent>;
	/** Emitted when the input is clicked and it were displaying custom text */
	relativeTimeConfigReset: EventEmitter<MouseEvent>;
	/** Emitted when there is a change in the relative config */
	relativeTimeConfigChange: EventEmitter<IAbsoluteSelectedRangeDates>;
}

export interface IAbsoluteSelectedRangeDates {
	range: SelectedRange;
}

export interface IRelativeTimeInput {
	mode: ERelativeTimeInputMode;
	from: string;
	to: string;
}

export enum ERelativeTimeInputMode {
	Text = 'text',
	Date = 'date'
}

export enum EInputSource {
	From = 'from',
	To = 'to',
	Single = 'single'
}

export interface DateInputState {
	state: EValidationState;
	helpText: string;
}
