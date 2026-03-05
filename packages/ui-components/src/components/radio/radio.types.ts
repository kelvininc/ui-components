import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

export interface IRadio {
	/** (optional) The label text for the radio. */
	label?: string;
	/** (optional) Sets this component item to a different styling configuration */
	size?: EComponentSize;
	/** (optional) If `true` the radio is with checked state. Default: false */
	checked?: boolean;
	/** (optional) If `true` the radio is with disabled state. Default: false */
	disabled?: boolean;
}

export interface IRadioEvents {
	/** Emitted when the radio checked state changes */
	checkedChange: EventEmitter<Event>;
}
