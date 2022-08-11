import { EventEmitter } from '@stencil/core';

export interface IDropdownListItem {
	/** (required) The text to display on the item */
	label: string;
	/** (required) The item value */
	value: string;
	/** (optional) If `true` the item is disabled */
	disabled?: boolean;
	/** (optional) If `true` the item is selected */
	selected?: boolean;
	/** (optional)  If `true` the item is togglable */
	togglable?: boolean;
}

export interface IDropdownListItemEvents {
	/** Emitted when the user clicks on the item */
	itemSelected: EventEmitter<string>;
}
