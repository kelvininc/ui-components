import { EventEmitter } from '@stencil/core';

export enum EToggleState {
	Selected = 'selected',
	Indeterminate = 'indeterminate',
	None = 'none'
}

export interface ISelectOption {
	/** (required) The text to display on the item */
	label: string;
	/** (required) The item value */
	value: string;
	/** (optional) Description of the item displayed on the left */
	description?: string;
	/** (optional) If `true` the item is disabled */
	disabled?: boolean;
	/** (optional) If `true` the item is selected */
	selected?: boolean;
	/** (optional) If `true` the item is highlighted */
	highlighted?: boolean;
	/** (optional) If `true` the item is togglable */
	togglable?: boolean;
	/** (optional) If `false` the item is only for presenting and cannot be selected. */
	selectable?: boolean;
	/** (optional) The level depth at which the option is rendered */
	level?: number;
	/** (optional) The toggle button state */
	state?: EToggleState;
	/** (optional) The children items of this option */
	options?: Record<string, ISelectOption>;
}

export interface ISelectOptionEvents {
	/** Emitted when the user clicks on the item */
	itemSelected: EventEmitter<string>;
}
