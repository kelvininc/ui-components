import { EventEmitter } from '@stencil/core';
import { EComponentSize, EIconName, EOtherIconName, EValidationState } from '../../types';

export enum EDateTimeInputTypeStyle {
	Separated = 'separated',
	MergedLeft = 'merged-left',
	MergedRight = 'merged-right'
}

export interface IDateTimeInputEvents {
	/** Emitted when a keyboard input occurred */
	textChange: EventEmitter<string>;
	/** Emitted when date time lost focus */
	dateTimeBlur: EventEmitter<string>;
	/** Emitted when the input is foccused */
	inputFocus: EventEmitter<FocusEvent>;
	/** Emitted when the right icon is clicked */
	rightIconClick: EventEmitter<string>;
}

export interface IDateTimeInput {
	/** (optional) Date time input label */
	label?: string;
	/** (optional) Date time input name */
	inputName?: string;
	/** (optional) Format of the provided date */
	dateFormat?: string;
	/** (optional) Date time place holder */
	placeholder?: string;
	/** (optional) Sets this tab item to a different styling configuration */
	size: EComponentSize;
	/** (optional) Date time value */
	value?: string | number | null;
	/** (optional) Date time focus state */
	forcedFocus?: boolean;
	/** (optional) Similar to forcedFocus but does not emmit events */
	highlighted?: boolean;
	/** (optional) Use a input mask when the Date time type is a Datetime (default true) */
	useInputMask?: boolean;
	/** (optional) Date time input disabled */
	disabled?: boolean;
	/** (optional) Date time input required */
	required?: boolean;
	/** (optional) Date time input state */
	state?: EValidationState;
	/** (optional) Date time input help text */
	helpText?: string | string[];
	/** (optional) Specifies if the inputs should be joined together or separated */
	inputStyleType?: EDateTimeInputTypeStyle;
	/** (optional) Input right icon */
	rightIcon?: EIconName | EOtherIconName;
	/** (optional) Input left icon */
	leftIcon?: EIconName | EOtherIconName;
}
