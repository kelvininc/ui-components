import { EventEmitter } from '@stencil/core';

export interface IRadioButtonGroupButton {
	/** (required) Adds a label aside the button */
	label: string;
	/** (optional) The value to be emitted upon click events */
	value?: string;
	/** (optional) Sets the button's styling to be disabled and disables click events */
	disabled?: boolean;
}

export interface IRadioButtonGroup {
	/** (optional) List of radio buttons */
	buttons: IRadioButtonGroupButton[];
	/** (optional) A record with the button's label/value and with if the selected value */
	selectedButtons?: Record<string, boolean>;
	/** (optional) Disables all buttons */
	disabled?: boolean;
}

export interface IRadioButtonGroupEvents {
	/** When the radio button selection changes, emit the requested tab's key */
	checkedChange: EventEmitter<string>;
}
