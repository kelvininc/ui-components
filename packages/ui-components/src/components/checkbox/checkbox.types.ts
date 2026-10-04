import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

// kv-checkbox renders a kv-radio in checkbox mode, but takes only the props a checkbox has. It
// doesn't extend IRadio, so props kv-radio adds for its own uses don't show up on the checkbox
export interface ICheckbox {
	/** (optional) The label text for the checkbox. */
	label?: string;
	/** (optional) Sets this component item to a different styling configuration */
	size?: EComponentSize;
	/** (optional) If `true` the checkbox is with checked state. Default: false */
	checked?: boolean;
	/** (optional) If `true` the checkbox is with disabled state. Default: false */
	disabled?: boolean;
	/** (optional) If `true` the checkbox is with indeterminate state, reported to assistive tech as mixed. Default: false */
	indeterminate?: boolean;
	/** (optional) Accessible name, for when the checkbox has no visible label (e.g. a table's row selector). Defaults to `label` */
	accessibleLabel?: string;
}

export interface ICheckboxEvents {
	/** Emitted when the checkbox checked state changes */
	clickCheckbox: EventEmitter<Event>;
}
