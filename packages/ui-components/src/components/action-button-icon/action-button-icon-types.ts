import { EActionButtonType, EIconName, IButton, IButtonEvents } from '../../types';

export interface IActionButtonIconConfig extends IButton, IButtonEvents {
	/** (required) Button's icon symbol name */
	icon: EIconName;
	/** (required) Button's type */
	type: EActionButtonType;
}
