import { EventEmitter } from '@stencil/core';
import { ETooltipPosition } from '../../utils/types/components';

export interface IToggleTip {
	/** (optional) Text of toggletip */
	text?: string;
	/** (optional) Position of toggletip */
	position?: ETooltipPosition;
	/** (optional) Array of allowed positions of toggle tip (if defined the 'position' is ignored) */
	allowedPositions?: ETooltipPosition[];
	/** (optional) Set open state of toggle tip, default false */
	isOpen?: boolean;
	/** (optional) if true it will ignore outside clicks to close the toggle tip */
	isFixed?: boolean;
	/** (optional) if true it will render an arrow pointing to the opening element */
	withArrow?: boolean;
	/** (optional) if true it will disable clicks to open toggle tip */
	disabled?: boolean;
	/** (optional) html toggle tip opening element ref */
	openElement?: HTMLElement;
	/** (optional) html toggle tip container ref */
	containerElement?: HTMLElement;
	/** (optional) html arrow element ref */
	arrowElement?: HTMLElement;
}

export interface IToggleTipEvents {
	/** Emitted when the dropdown opens state changes */
	openStateChange: EventEmitter<boolean>;
}
