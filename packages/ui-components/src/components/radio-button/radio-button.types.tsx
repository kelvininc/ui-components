import { EventEmitter } from '@stencil/core';

export interface IRadioButton {
	/** (required) Adds a label aside the button */
	label: string;
	/** (optional) The value to be emitted upon click events */
	value?: string;
	/** (optional) Sets the button's styling to be disabled and disables click events */
	disabled?: boolean;
	/** (optional) Sets the button as checked */
	checked?: boolean;
	/** (optional) Defines if the item click event should prevent default behaviour. */
	preventDefault?: boolean;
}

export interface IRadioButtonEvents {
	/** Emits when a button is clicked */
	checkedChange: EventEmitter<string>;
}
