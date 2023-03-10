import { EActionButtonType, EIconName, EOtherIconName, IAnchor, IButton, IButtonEvents } from '../../types';
import { IButtonIcon } from './action-button.types';

export interface IActionButtonIconConfig extends IButton, IButtonIcon, IButtonEvents, IAnchor {
	/** (required) Button's icon symbol name */
	icon: EIconName | EOtherIconName;
	/** (required) Button's type */
	type: EActionButtonType;
}
