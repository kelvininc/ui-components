import { EventEmitter } from '@stencil/core';
import { EValidationState } from '../../types';

export interface ISelectCreateOption {
	/** (optional) The placeholder to be passed to the text field. Default: `Option Name` */
	placeholder?: string;
	/** (optional) If `true` the input and actions will be disabled. Default: `false`. */
	disabled?: boolean;
	/** (optional) The text field state */
	state?: EValidationState;
	/** (optional) The text field help text */
	helpText?: string | string[];
}

export interface ISelectCreateOptionEvents {
	/** Emitted when the create button is pressed */
	create: EventEmitter<string>;
	/** Emitted when the cancel button is pressed */
	cancel: EventEmitter<void>;
	/** Emitted when the value changes */
	valueChanged: EventEmitter<string>;
}
