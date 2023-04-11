import { EventEmitter } from '@stencil/core';
import { IRadioListItem } from '../radio-list-item/radio-list-item.types';

export interface IRadioList {
	/** (optional) Form field label */
	label?: string;
	/** (required) The configuration for the buttons to render */
	options: IRadioListItem[];
	/** (optional) The desired selected option */
	selectedOption?: string | number;
	/** (optional) The options to show up as disabled */
	disabledOptions?: Record<string | number, boolean>;
	/** (optional) Form field required */
	required?: boolean;
}

export interface IRadioListEvents {
	/** Emits when an option is selected */
	optionSelected: EventEmitter<string | number>;
}
