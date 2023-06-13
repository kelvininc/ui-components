import { EventEmitter } from '@stencil/core';
import { ICustomCss } from '../../types';

export interface IModalConfig extends ICustomCss {
	/** (optional) Defines the modal title label */
	headerTitle?: string;
	/** (optional) Defines if the modal has an overlay background */
	showOverlay?: boolean;
	/** (optional) Defines if the modal shows the close button */
	showCloseButton?: boolean;
}

export interface IModalEvents {
	/** Emitted when the close button is clicked */
	clickClose: EventEmitter<void>;
	/** Emitted when the overlay container is clicked */
	clickOverlay: EventEmitter<void>;
}
