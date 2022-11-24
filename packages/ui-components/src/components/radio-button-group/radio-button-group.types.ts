import { EventEmitter } from '@stencil/core';
import { IRadioButton } from '../../types';

export interface IRadioButtonGroup {
	/** (optional) List of radio buttons */
	buttons: IRadioButton[];
	/** (optional) A record with the button's label/value and with if the selected value */
	selectedButtons?: Record<string, boolean>;
	/** (optional) Disables all buttons */
	disabled?: boolean;
}

export interface IRadioButtonGroupEvents {
	/** When the radio button selection changes, emit the requested tab's key */
	checkedChange: EventEmitter<string>;
}
