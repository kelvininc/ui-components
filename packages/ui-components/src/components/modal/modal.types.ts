import { EventEmitter } from '@stencil/core';

export interface IModalConfig {
	/** (optional) Defines the modal title label */
	headerTitle?: string;
	/** (optional) Defines if the modal has an overlay background */
	showOverlay?: boolean;
	/** (optional) Defines if the modal can be closed with a click on the overlay */
	closeOnOverlayClick?: boolean;
	/** (optional) Defines if the modal shows the close button */
	showCloseButton?: boolean;
}

export interface IModalEvents {
	/** Emitted when the close button is clicked */
	clickClose: EventEmitter<void>;
}
