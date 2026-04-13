import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

export enum EAlertType {
	Info = 'info',
	Error = 'error',
	Success = 'success',
	Warning = 'warning'
}

export interface IAlertConfig {
	/** (required) Defines the type of alert to show, possible values are defined in `EAlertType` */
	type: EAlertType;
	/** (optional) Defines the size of the component, defaults to EComponentType.Large */
	size?: EComponentSize;
	/** (optional) Defines if the icon should be shown, defaults to `true` */
	showIcon?: boolean;
	/** (required) Defines the label (title) text to show */
	label: string;
	/** (optional) Defines the description text to show */
	description?: string;
	/** (optional) Defines if the close button should be shown, defaults to `false` */
	closable?: boolean;
}

export interface IAlertEvents {
	/** Emitted when the close button is clicked */
	clickCloseButton: EventEmitter<MouseEvent>;
}
