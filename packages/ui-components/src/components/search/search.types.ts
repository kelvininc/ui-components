import { EventEmitter } from '@stencil/core';
import { ITextField, ITextFieldEvents } from '../text-field/text-field.types';

export interface ISearch extends Omit<ITextField, 'icon' | 'actionIcon' | 'value'> {
	/** (required) Search term to display. kv-search is controlled: update it from `textChange`, or the clear button won't show and clicking it won't clear the text */
	value: string | number | null | undefined;
}

export interface ISearchEvents extends ITextFieldEvents {
	/** Emitted when a keyboard input occurred, and with an empty string when the reset button is clicked */
	textChange: EventEmitter<string>;
	/** Emitted when the reset button is clicked */
	clickResetButton: EventEmitter<MouseEvent>;
}
