import { EventEmitter } from '@stencil/core';

export enum EInputFieldType {
	Text = 'text',
	Number = 'number',
	Password = 'password'
}

export enum EValidationState {
	None = 'none',
	Valid = 'valid',
	Invalid = 'invalid'
}

export interface ITextFieldEvents {
	/** Emitted when text field's value changes */
	textChange: EventEmitter<string>;
	/** Emitted when text field lost focus */
	textFieldBlur: EventEmitter<string>;
}
