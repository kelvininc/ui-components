import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';

export interface ITextArea {
	/** (optional) Icon to show to the left of the text field */
	icon?: EIconName | EOtherIconName;
	/** (optional) The text to show inside the text area */
	text?: string;
	/** (optional) The placeholder to show in the text area */
	placeholder?: string;
	/** (optional) The maximum number of characters allowed */
	maxCharLength?: number;
	/** (optional) If `true` the chars counter is displayed. Default: true */
	counter?: boolean;
}

export interface ITextAreaEvents {
	/** Emits the current text when there's a change */
	textChange: EventEmitter<string>;
}
