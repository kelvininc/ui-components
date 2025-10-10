import { EventEmitter } from '@stencil/core';
import { EComponentSize, ITooltip } from '../../types';
import { EIconName } from '../icon/icon.types';
import { HostAttributes } from '@stencil/core/internal';

export enum EInputFieldType {
	Text = 'text',
	Number = 'number',
	Password = 'password',
	DateTime = 'datetime-local',
	Date = 'date',
	Radio = 'radio',
	Email = 'email'
}

export enum EValidationState {
	None = 'none',
	Valid = 'valid',
	Invalid = 'invalid'
}

export interface ITextFieldEvents {
	/** Emitted when a keyboard input occurred */
	textChange: EventEmitter<string>;
	/** Emitted when text field lost focus */
	textFieldBlur: EventEmitter<string>;
	/** Emitted when the right icon is clicked */
	rightActionClick: EventEmitter<MouseEvent>;
	/** Emmited when there's a click on this element */
	fieldClick: EventEmitter<MouseEvent>;
}

export interface ITextField {
	/** (optional) Text field type */
	type?: EInputFieldType;
	/** (optional) Text field label */
	label?: string;
	/** (optional) Text field's icon symbol name */
	icon?: EIconName;
	/** (optional) Icon that is added on the right of the input. Its clickable. */
	actionIcon?: EIconName;
	/** (optional) Text field input name */
	inputName?: string;
	/** (optional) Text field example values */
	examples?: string[];
	/** (optional) Text field place holder */
	placeholder?: string;
	/** (optional) Text field maximum number of characters required */
	maxLength?: number;
	/** (optional) Text field minimum number of characters required */
	minLength?: number;
	/** (optional) Text field maximum value */
	max?: string | number;
	/** (optional) Text field minimum value */
	min?: string | number;
	/** (optional) Text field interval between legal numbers */
	step?: string | number;
	/** (optional) Sets this tab item to a different styling configuration */
	size?: EComponentSize;
	/** (optional) Text field disabled */
	inputDisabled?: boolean;
	/** (optional) Text field required */
	inputRequired?: boolean;
	/** (optional) Text field loading state */
	loading?: boolean;
	/** (optional) Text field state */
	state?: EValidationState;
	/** (optional) Text field help text */
	helpText?: string | string[];
	/** (optional) Text field value */
	value?: string | number | null;
	/** (optional) Defines the prefix that adds context to displayed values */
	valuePrefix?: string;
	/** (optional) Text to display inside a badge on the right side of the displayed value */
	badge?: string;
	/** (optional) Text field is readonly */
	inputReadonly?: boolean;
	/** (optional) Text field focus state */
	forcedFocus?: boolean;
	/** (optional) Text field tooltip configuration */
	tooltipConfig?: Partial<ITooltip>;
	/** (optional) Use a input mask when the text field type is number (default true) */
	useInputMask?: boolean;
	/** (optional) Input mask regex */
	inputMaskRegex?: string;
	/** (optional) Enable/disable the resize of input (default: true) */
	fitContent?: boolean;
	/** (optional) Additional style to apply for custom CSS. */
	customStyle?: HostAttributes['style'];
	/** (optional) If true, a dirty dot indicator will be added to right side of the displayed value. */
	isDirty?: boolean;
	/** (optional) If true, the badge is not displayed */
	hideBadge?: boolean;
}

export interface IInputMaskInstanceRef extends Inputmask.Instance {
	shadowRoot: ShadowRoot;
}
