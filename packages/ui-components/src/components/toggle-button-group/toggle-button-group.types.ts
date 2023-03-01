import { EventEmitter } from '@stencil/core';
import { IToggleButton } from '../../types';

export interface IToggleButtonGroup {
	/** (optional) List of toggle buttons */
	buttons: IToggleButton[];
	/** (optional) Sets  */
	withRadio?: boolean;
	/** (optional) Sets styling to be disabled and disables click events for all buttons */
	disabled?: boolean;
	/** (optional) A record with the button's label/value and with if the selected value */
	selectedButtons?: Record<string, boolean>;
	/** (optional) A record with the button's label/value and the if the respective button is disabled */
	disabledButtons?: Record<string, boolean>;
	/** (optional) A record with the button's label/value and the if the respective button is a radio button */
	radioButtons?: Record<string, boolean>;
}

export interface IToggleButtonGroupEvents {
	/** When the toggle button selection changes, emit the requested tab's key */
	checkedChange: EventEmitter<string>;
}
