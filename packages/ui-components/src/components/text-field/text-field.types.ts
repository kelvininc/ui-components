import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';
import { EIconName, EOtherIconName } from '../icon/icon.types';

export enum EInputFieldType {
	Text = 'text',
	Number = 'number',
	Password = 'password',
	DateTime = 'datetime-local',
	Radio = 'radio'
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

export interface ITextField {
	/** (optional) Text field type */
	type?: EInputFieldType;
	/** (optional) Text field label */
	label?: string;
	/** (optional) Text field's icon symbol name */
	icon?: EIconName | EOtherIconName;
	/** (optional) Text field input name */
	inputName?: string;
	/** (optional) Text field place holder */
	placeholder?: string;
	/** (optional) Text field maximum number of characters required */
	maxLength?: number;
	/** (optional) Text field minimum number of characters required */
	minLength?: number;
	/** (optional) Text field maximum value */
	max?: number | string;
	/** (optional) Text field minimum value */
	min?: number | string;
	/** (optional) Text field interval between legal numbers */
	step?: number | string;
	/** (optional) Sets this tab item to a different styling configuration */
	size: EComponentSize;
	/** (optional) Text field disabled */
	disabled?: boolean;
	/** (optional) Text field required */
	required?: boolean;
	/** (optional) Text field loading state */
	loading?: boolean;
	/** (optional) Text field state */
	state?: EValidationState;
	/** (optional) Text field help text */
	helpText?: string | string[];
	/** (optional) Text field value */
	value?: string;
}
