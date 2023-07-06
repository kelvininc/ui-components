import { EventEmitter } from '@stencil/core';
import { ETooltipPosition, ICustomCss } from '../../utils/types/components';
import { ComputePositionConfig } from '@floating-ui/dom';

export interface IToggleTip extends ICustomCss {
	/** (optional) Text of toggletip */
	text?: string;
	/** (optional) Position of toggletip */
	position?: ETooltipPosition;
	/** (optional) Array of allowed positions of toggle tip (if defined the 'position' is ignored) */
	allowedPositions?: ETooltipPosition[];
	/** (optional) Object with tooltip position options */
	options?: Partial<ComputePositionConfig>;
	/** (optional) Set open state of toggle tip, default false */
	isOpen?: boolean;
	/** (optional) if true it will ignore outside clicks to close the toggle tip */
	isFixed?: boolean;
	/** (optional) if true it will render an arrow pointing to the opening element */
	withArrow?: boolean;
	/** (optional) if true it will disable clicks to open toggle tip */
	disabled?: boolean;
}

export interface IToggleTipEvents {
	/** Emitted when the dropdown opens state changes */
	openStateChange: EventEmitter<boolean>;
}
