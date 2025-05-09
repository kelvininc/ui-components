import { EActionButtonType, EIconName, IButton, IButtonEvents } from '../../types';
import { IButtonIcon } from './action-button.types';

export interface IActionButtonIconConfig extends IButton, IButtonIcon, IButtonEvents {
	/** (required) Button's icon symbol name */
	icon: EIconName;
	/** (required) Button's type */
	type: EActionButtonType;
}
