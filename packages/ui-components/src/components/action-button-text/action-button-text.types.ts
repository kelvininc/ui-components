import { EIconName, EOtherIconName, IAnchor, IButton, IButtonEvents } from '../../types';

export interface IActionButtonTextConfig extends IButton, IButtonEvents, IAnchor {
	/** (required) (required) Button's text */
	text: string;
	/** (optional) Button's left icon symbol name */
	icon?: EIconName | EOtherIconName;
}
