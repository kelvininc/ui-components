import { EventEmitter } from '@stencil/core';
import { EAnchorTarget, EIconName, EOtherIconName, IAnchor, IButton } from '../../types';

export interface IActionButtonSplitConfig extends IButton, IAnchor, IButtonSplitEvents {
	/** (required) Right button icon symbol name */
	splitIcon: EIconName | EOtherIconName;
	/** (required) (required) Button's text */
	text: string;
	/** (optional) Button's left icon symbol name */
	icon?: EIconName | EOtherIconName;
	/** (optional) The left button anchor's link to open when clicking */
	leftHref?: string;
	/** (optional) The left button anchor's target */
	leftTarget?: EAnchorTarget;
	/** (optional) The left button anchor's download filename */
	leftDownload?: string;
	/** (optional) The right button anchor's link to open when clicking */
	rightHref?: string;
	/** (optional) The right button anchor's target */
	rightTarget?: EAnchorTarget;
	/** (optional) The right button anchor's download filename */
	rightDownload?: string;
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
