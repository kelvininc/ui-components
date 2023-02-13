import { ComputePositionConfig } from '@floating-ui/dom';
import { EventEmitter } from '@stencil/core';

export interface IDropdownBase {
	/** (optional) If `true` the list is opened */
	isOpen?: boolean;
	/** (optional) The dropdown position config options */
	options?: Partial<ComputePositionConfig>;
	/** (optional) A reference to the dropdown action element */
	actionElement?: HTMLElement;
	/** (optional) A reference to the dropdown list element */
	listElement?: HTMLElement;
	/** (optional) If `true` clicking outside the dropdown will not trigger state change. Default: false */
	disabled?: boolean;
}

export interface IDropdownBaseEvents {
	/** Emitted when the dropdown opens state changes */
	openStateChange: EventEmitter<boolean>;
}
