import { Placement } from '@floating-ui/dom';
import { EventEmitter } from '@stencil/core';

export interface IDropdownBase {
	/** (optional) If `true` the list is opened */
	isOpen?: boolean;
	/** (optional) The dropdown placement relative to the container */
	placement?: Placement;
}

export interface IDropdownBaseEvents {
	/** Emitted when the dropdown opens state changes */
	openStateChange: EventEmitter<boolean>;
}
