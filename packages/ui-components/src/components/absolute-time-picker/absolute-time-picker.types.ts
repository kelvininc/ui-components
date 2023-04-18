import { EventEmitter } from '@stencil/core';
import { SelectedRange } from '../../types';

export interface IAbsoluteTimePicker {
	/** (optional) Title disaplayed on top of the component */
	headerTitle?: string;
	/** (optional) Enables the back button displayed on top */
	displayBackButton?: boolean;
	/** (optional) Selected dates */
	selectedRangeDates?: string[];
	/** (optional) Initial Date */
	initialDate?: string;
	/** (optional) Disabled dates */
	disabledDates?: string[];
	/** (optional) use to determine if the chart inputs have custom strings */
	relativeTimeConfig?: IRelativeTimeInput;
	/** (optional) calendar minimum date to be navigated */
	calendarInputMinDate?: string;
	/** (optional) calendar maximum date to be navigated */
	calendarInputMaxDate?: string;
}

export interface IAbsoluteTimePickerEvents {
	/** Selected range dates change */
	selectRangeDatesChange: EventEmitter<IAbsoluteSelectedRangeDates>;
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
	To = 'to'
}
