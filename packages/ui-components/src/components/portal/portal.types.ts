import { ComputePositionConfig } from '@floating-ui/dom';
import { EventEmitter } from '@stencil/core';

export interface IPortal {
	/** (required) The portal id */
	portalId: string;
	/** (required) The reference element  */
	reference: HTMLElement;
	/** (optional) options used to compute the portal position */
	options?: ComputePositionConfig;
	/** (optional) enable position auto update (default true) */
	autoUpdate?: boolean;
	/** (optional) if true portal content will gradually appear (default false) */
	animated?: boolean;
	/** (optional) if true it will render an arrow pointing to the opening element (default false) */
	withArrow?: boolean;
	/** (optional) html arrow element ref */
	arrowElement?: HTMLElement;
	/** (optional) Delay to show portal in milliseconds. (default 0) */
	delay?: number;
}

export interface IPortalEvents {
	/** Emitted when the element it's appended to the DOM */
	elementAppend: EventEmitter<void>;
}
