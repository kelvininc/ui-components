import { EventEmitter } from '@stencil/core';

export interface ITimePickerSelectOption {
	/** (required) The text to display on the item */
	label: string;
	/** (required) The item value */
	value: string;
	/** (optional) The description of the text displayed */
	description?: string;
	/** (optional) If `true` the item is selected */
	selected?: boolean;
	/** (optional) Custom attributes to be applied to the option container element */
	customAttributes?: Record<string, string>;
}

export interface ITimePickerSelectOptionEvents {
	/** Emitted when the user clicks on the item */
	itemSelected: EventEmitter<string>;
}
