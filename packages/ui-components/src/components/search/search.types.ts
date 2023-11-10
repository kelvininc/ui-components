import { EventEmitter } from '@stencil/core';
import { ITextField, ITextFieldEvents } from '../text-field/text-field.types';

export interface ISearch extends Omit<ITextField, 'icon' | 'actionIcon'> {}

export interface ISearchEvents extends ITextFieldEvents {
	/** Emitted when the reset button is clicked */
	clickResetButton: EventEmitter<MouseEvent>;
}
