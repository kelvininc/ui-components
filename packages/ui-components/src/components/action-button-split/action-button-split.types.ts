import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName, IButton } from '../../types';

export interface IActionButtonSplitConfig extends IButton, IButtonSplitEvents {
	/** (required) Right button icon symbol name */
	splitIcon: EIconName | EOtherIconName;
	/** (required) (required) Button's text */
	text: string;
	/** (optional) Button's left icon symbol name */
	icon?: EIconName | EOtherIconName;
}

export interface IButtonSplitEvents {
	/** Emitted when left button is clicked */
	clickLeftButton: EventEmitter<MouseEvent>;
	/** Emitted when right button is clicked */
	clickRightButton: EventEmitter<MouseEvent>;
	/** Emitted when left button is focused */
	focusLeftButton: EventEmitter<FocusEvent>;
	/** Emitted when right button is focused */
	focusRightButton: EventEmitter<FocusEvent>;
	/** Emitted when left button is blur */
	blurLeftButton: EventEmitter<FocusEvent>;
	/** Emitted when right button is blur */
	blurRightButton: EventEmitter<FocusEvent>;
}
