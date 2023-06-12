import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';

export interface ITextArea {
	/** (optional) Icon to show to the left of the text field */
	icon?: EIconName | EOtherIconName;
	/** (optional) The text to show inside the text area */
	text?: string;
	/** (optional) The placeholder to show in the text area */
	placeholder?: string;
	/** (required) The maximum number of characters allowed */
	maxCharLength: number;
}

export interface ITextAreaEvents {
	/** Emits the current text when there's a change */
	textChange: EventEmitter<string>;
	/** Emits the current text when the text area loses focus */
	textChangeBlur: EventEmitter<string>;
}
