import { EventEmitter } from '@stencil/core';

export interface IRadioListItem {
	/** (required) The unique id that serves as a key for this item */
	optionId: string | number;
	/** (required) The label to display */
	label: string;
	/** (optional) The description that can contain links in the [text](url) format */
	description?: string;
	/** (optional) Defines if this option is checked */
	checked?: boolean;
	/** (optional) Defines if this option is disabled */
	disabled?: boolean;
}

export interface IRadioListItemEvents {
	/** Emits when this option is clicked */
	optionClick: EventEmitter<string | number>;
}
