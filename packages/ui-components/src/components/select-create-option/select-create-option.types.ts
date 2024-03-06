import { EventEmitter } from '@stencil/core';

export interface ISelectCreateOption {
	/** The placeholder to be passed to the text field. Default: `Option Name` */
	placeholder?: string;
}

export interface ISelectCreateOptionEvents {
	/** Emitted when the create button is pressed */
	create: EventEmitter<string>;
	/** Emitted when the cancel button is pressed */
	cancel: EventEmitter<void>;
}
