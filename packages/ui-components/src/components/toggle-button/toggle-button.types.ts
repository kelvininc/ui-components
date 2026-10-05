import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';
import { EIconName } from '../icon/icon.types';
import { ERadioControlType } from '../radio/radio.types';

export interface IToggleButton<T = string | number> {
	/** (required) The value to be emitted upon click events */
	value: T;
	/** (optional) The button's icon. Only valid for toggle button icon */
	icon?: EIconName;
	/** (optional) The button's label. Only valid for toggle button text */
	label?: string;
	/** (optional) Nonblank accessible name for the control. Takes precedence over label and tooltip. */
	accessibleLabel?: string;
	/** (optional) Sets the button's styling to be disabled and disables click events */
	disabled?: boolean;
	/** (optional) Sets the button as checked */
	checked?: boolean;
	/** (optional) Defines if the item click event should prevent default behaviour. */
	preventDefault?: boolean;
	/** (optional) Sets if the button is a radio button */
	withRadio?: boolean;
	/** (optional) What the radio is to assistive tech. Use `checkbox` when pressing a checked button unchecks it, or several buttons can be checked at once. Default: `radio` */
	radioControlType?: ERadioControlType;
	/** (optional) If true, Tab skips the inner radio. Radio groups keep one enabled Tab stop. */
	skipTabStop?: boolean;
	/** (optional) Button's size */
	size?: EComponentSize;
	/** (optional) Tooltip text */
	tooltip?: string;
	/** (optional) Custom attributes on the toggle element. A plain button's type, disabled, aria-label and aria-pressed come from component props. */
	customAttributes?: Record<string, string>;
}

export interface IToggleButtonEvents<T = string | number> {
	/** Emits when a button is clicked */
	checkedChange: EventEmitter<T>;
}
