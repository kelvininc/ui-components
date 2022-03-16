import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../utils/types';

export enum EActionButtonType {
	Primary = 'primary',
	Secondary = 'secondary',
	Tertiary = 'tertiary',
	Danger = 'danger'
}

export interface IButton {
	/** (required) Button's type */
	type: EActionButtonType;
	/** (optional) If `true` the button is disabled */
	disabled: boolean;
	/** (optional) If `true` the button is active */
	active: boolean;
	/** (optional) Button's size */
	size: EComponentSize;
}

export interface IButtonEvents {
	/** Emitted when action button is clicked */
	clickButton: EventEmitter<MouseEvent>;
	/** Emitted when action button is focused */
	focusButton: EventEmitter<FocusEvent>;
	/** Emitted when action button is blur */
	blurButton: EventEmitter<FocusEvent>;
}
