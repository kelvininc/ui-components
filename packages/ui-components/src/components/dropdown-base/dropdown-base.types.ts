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
	/**
	 * (optional) If `false` clicking outside the dropdown will not trigger state change. A click in a portal anchored
	 * inside the dropdown, as the list of a dropdown or a tooltip opened from it, is not outside. Default: true
	 */
	clickOutsideClose?: boolean;
	/**
	 * (optional) If `false` pressing Escape will not trigger state change. Escape only closes the most recently opened
	 * dropdown, so one with `escapeClose` off also keeps those opened before it open. Default: true
	 */
	escapeClose?: boolean;
	/** (optional) the dropdown list z-index (default: 9004) */
	zIndex?: number;
}

export interface IDropdownBaseEvents {
	/**
	 * Emitted when the dropdown requests a change of its open state, which its consumer applies through `isOpen`.
	 * It requests `false` on a click outside it (see `clickOutsideClose`) and on Escape (see `escapeClose`).
	 */
	openStateChange: EventEmitter<boolean>;
	/**
	 * Emitted when there's a click outside the dropdown's boundaries. A click in a portal anchored inside the
	 * dropdown, as the list of a dropdown or a tooltip opened from it, is not outside.
	 */
	clickOutside: EventEmitter<MouseEvent>;
}
