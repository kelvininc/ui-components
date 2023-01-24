import { EventEmitter } from '@stencil/core';
import { ITextField } from '../text-field/text-field.types';

export interface IInlineEditableHeader extends Partial<ITextField> {
	/** (optional) The control prop to change between editing and display */
	isEditing: boolean;
}

export interface IInlineEditableHeaderEvents {
	/** Fires when the user clicks on the confirm button. */
	changeConfirmed: EventEmitter<void>;
	/** Fires when the user clicks on the cancel button. */
	changeDiscarded: EventEmitter<void>;
	/** Fires on every keydown event on the text field */
	textFieldChange: EventEmitter<string | number>;
	/** Fires when losing focus on the text field. */
	textFieldBlur: EventEmitter<string | number>;
	/** Fires when the user double clicks on the text. */
	doubleClick: EventEmitter<void>;
}
