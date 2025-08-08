import { EventEmitter } from '@stencil/core';

export interface ICheckbox {
	/** (optional) If `true` the checkbox is with checked state. Default: false */
	checked?: boolean;
	/** (optional) If `true` the checkbox is with disabled state. Default: false */
	disabled?: boolean;
	/** (optional) If `true` the checkbox is with indeterminate state. Default: false */
	indeterminate?: boolean;
	/** (optional) The label text for the checkbox. */
	label?: string;
}

export interface ICheckboxEvents {
	/** Emitted when the checkbox checked state changes */
	clickCheckbox: EventEmitter<MouseEvent>;
}
