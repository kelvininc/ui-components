import { EIconName, IButton, IButtonEvents } from '../../types';

export interface IActionButtonTextConfig extends IButton, IButtonEvents {
	/** (required) (required) Button's text */
	text: string;
	/** (optional) Button's left icon symbol name */
	icon?: EIconName;
}
