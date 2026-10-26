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
	/** (optional) Accessible name, for when the visible label sits outside the radio (e.g. kv-radio-list-item). Defaults to `label` */
	accessibleLabel?: string;
	/** @internal What the control is to assistive tech. Default: `radio` */
	controlType?: ERadioControlType;
	/** @internal With `controlType` `checkbox`, reports the mixed state. Default: false */
	indeterminate?: boolean;
	/** (optional) If `true` Tab skips this radio. A radio group keeps one Tab stop (its selection, or the first option) and moves between options with the arrow keys. Default: false */
	skipTabStop?: boolean;
}

export enum ERadioControlType {
	Radio = 'radio',
	Checkbox = 'checkbox'
}

export interface IRadioEvents {
	/** Emitted when the radio checked state changes */
	checkedChange: EventEmitter<Event>;
}
