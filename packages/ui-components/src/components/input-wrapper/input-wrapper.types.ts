import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';

export interface IInputWrapper {
	/** Defines the state of the component */
	contentVisible: boolean;
	/** Label that is shown when the component is in Default state */
	label?: string;
	/** Icon that is displayed when the component is hovered and is in default state */
	icon?: EIconName;
}

export interface IInputWrapperEvents {
	/** Event emitted when the component is clicked to display the wrapped content*/
	contentClick: EventEmitter<boolean>;
}
