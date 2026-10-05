import { EActionButtonType, EIconName, IButton, IButtonEvents, IButtonMenuState } from '../../types';

export interface IActionButtonIconConfig extends IButton, IButtonEvents, IButtonMenuState {
	/** (required) Button's icon symbol name */
	icon: EIconName;
	/** (required) Button's type */
	type: EActionButtonType;
}
