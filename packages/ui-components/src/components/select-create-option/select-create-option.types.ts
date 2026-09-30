import { EventEmitter } from '@stencil/core';
import { EComponentSize, ITextField } from '../../types';

export interface ISelectCreateOption {
	/** (optional) The new option value. */
	value?: string;
	/** (optional) If `true` the input and the create action are disabled. The cancel action stays available. Default: `false`. */
	disabled?: boolean;
	/** (optional) If `true` the new option is being submitted: the create action shows its loading state, the input is read-only and neither action can be triggered. Default: `false`. */
	loading?: boolean;
	/** (optional) The text field custom config. */
	inputConfig?: Partial<ITextField>;
	/** (optional) The input and actions size. Default: `small´ */
	size?: EComponentSize;
}

export interface ISelectCreateOptionEvents {
	/** Emitted when the create button is pressed, or Enter in the input */
	clickCreate: EventEmitter<MouseEvent | KeyboardEvent>;
	/** Emitted when the cancel button is pressed, or Escape in the form */
	clickCancel: EventEmitter<MouseEvent | KeyboardEvent>;
	/** Emitted when the value changes */
	valueChanged: EventEmitter<string>;
}
