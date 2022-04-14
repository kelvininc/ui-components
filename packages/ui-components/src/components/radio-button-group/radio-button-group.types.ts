import { EventEmitter } from '@stencil/core';
import { IRadioButton } from '../radio-button/radio-button.types';

export interface IRadioButtonGroup {
	/** (optional) List of radio buttons */
	buttons: IRadioButton[];

	/** (optional) The array of selected options */
	selectedButtons?: string[];
}

export interface IRadioButtonGroupEvents {
	/** When the radio button selection changes, emit the requested tab's key */
	checkedChange: EventEmitter<string>;
}
