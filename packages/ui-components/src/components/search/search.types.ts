import { EventEmitter } from '@stencil/core';

export interface ISearchEvents {
	/** Emitted when the reset buccon is clicked */
	clickResetButton: EventEmitter<MouseEvent>;
}
