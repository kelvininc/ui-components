import { EventEmitter } from '@stencil/core';

export interface IModal {
	/** (optional) Modal title */
	modalTitle: string;
	/** (optional) Modal center */
	center: boolean;
	/** (optional) Modal close when click outside */
	closeClickOutside: boolean;
}

export interface IModalEvents {
	/** Emitted when clicking the close button */
	clickCloseButton: EventEmitter<MouseEvent>;
}
