import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

export interface IRadioListItem {
	/** (required) The unique id that serves as a key for this item */
	optionId: string | number;
	/** (optional) Visible label and accessible radio name. Set this even when a label is slotted. */
	label?: string;
	/** Elements describing the radio, including help in an ancestor tree. Clear with an empty array. */
	accessibleDescriptionElements?: readonly Element[];
	/** (optional) The description that can contain links in the [text](url) format */
	description?: string;
	/** (optional) Button's size */
	size?: EComponentSize;
	/** (optional) Defines if this option is checked */
	checked?: boolean;
	/** (optional) Defines if this option is disabled */
	disabled?: boolean;
	/** (optional) If `true` Tab skips this option's radio. A radio group keeps one Tab stop and moves between options with the arrow keys. Default: false */
	skipTabStop?: boolean;
}

export interface IRadioListItemEvents {
	/** Emits when this option is clicked */
	optionClick: EventEmitter<string | number>;
}
