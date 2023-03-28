import { EventEmitter } from '@stencil/core';
import { IAnchor } from '../../types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

export interface IToggleButton extends IAnchor {
	/** (required) The value to be emitted upon click events */
	value: string;
	/** (optional) The button's icon. Only valid for toggle button icon */
	icon?: EIconName | EOtherIconName;
	/** (optional) The button's label. Only valid for toggle button text */
	label?: string;
	/** (optional) Sets the button's styling to be disabled and disables click events */
	disabled?: boolean;
	/** (optional) Sets the button as checked */
	checked?: boolean;
	/** (optional) Defines if the item click event should prevent default behaviour. */
	preventDefault?: boolean;
	/** (optional) Sets if the button is a radio button */
	withRadio?: boolean;
}

export interface IToggleButtonEvents {
	/** Emits when a button is clicked */
	checkedChange: EventEmitter<string>;
}
