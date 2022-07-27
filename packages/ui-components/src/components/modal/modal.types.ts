import { EventEmitter } from '@stencil/core';

export interface IModalConfig {
	/** (optional) The modal title label */
	label?: string;
	/** (optional) The modal has a backdrop */
	hasBackdrop?: boolean;
	/** (optional) The modal shows the close button */
	showCloseButton?: boolean;
}

export interface IModalEvents {
	/** Emitted when the close button is clicked */
	clickClose: EventEmitter<void>;
}
