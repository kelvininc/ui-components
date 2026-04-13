import { EIconName, IButton, IButtonEvents } from '../../types';

export interface IActionButtonTextConfig extends IButton, IButtonEvents {
	/** (optional) Button's text */
	text?: string;
	/** (optional) Button's left icon symbol name */
	icon?: EIconName;
	/** (optional) Button's right icon symbol name */
	rightIcon?: EIconName;
}
