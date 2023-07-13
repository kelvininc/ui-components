import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';

export interface LabelsInputItem {
	/** (required) The value this input item represents */
	value: string;
	/** (required) The label to show on this input item */
	label: string;
	/** (required) The icon to show on the input input */
	icon: EIconName;
	/** (optional) Defines if this item is selected, defaults to `false` */
	selected?: boolean;
	/** (optional) Defines if this item is disabled, defaults to `false` */
	disabled?: boolean;
}

export interface LabelsInputItemEvents {
	/** Emitted when there's a click on the assigned icon */
	itemClick: EventEmitter<string>;
}
