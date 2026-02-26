import { EventEmitter } from '@stencil/core';
import { IRadio } from '../radio/radio.types';

export interface ICheckbox extends IRadio {
	/** (optional) If `true` the checkbox is with indeterminate state. Default: false */
	indeterminate?: boolean;
}

export interface ICheckboxEvents {
	/** Emitted when the checkbox checked state changes */
	clickCheckbox: EventEmitter<Event>;
}
