import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

export interface IDateTimeInputEvents {
	/** Emitted when a keyboard input occurred */
	textChange: EventEmitter<string>;
	/** Emitted when date time lost focus */
	dateTimeBlur: EventEmitter<string>;
	/** Emitted when the input is foccused */
	inputFocus: EventEmitter<FocusEvent>;
}

export interface IDateTimeInput {
	/** (optional) Date time input label */
	label?: string;
	/** (optional) Date time input name */
	inputName?: string;
	/** (optional) Date time place holder */
	placeholder?: string;
	/** (optional) Date time maximum value */
	max?: string;
	/** (optional) Date time minimum value */
	min?: string;
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
}
