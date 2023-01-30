import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

export interface ISwitchButton {
	/** (optional) If `true` the button is disabled. Default `false` */
	disabled: boolean;
	/** (optional) If `true` the button is ON. Default `false` */
	checked: boolean;
	/** (optional) Button's size. Default `EComponentSize.Large` */
	size: EComponentSize;
}

export interface ISwitchButtonEvents {
	/** Emitted when switch's state changes */
	switchChange: EventEmitter<boolean>;
}
