import { EventEmitter } from '@stencil/core';
import { EIconName } from '../icon/icon.types';

export const CLOSE_ICON = {
	icon: EIconName.Close
};

export enum EToasterType {
	Info = 'info',
	Warning = 'warning',
	Error = 'error',
	Success = 'success'
}

export interface EToasterIconTypeClass {
	icon: EIconName;
}

export interface IToaster {
	/** (required) Main message to display */
	header: string;
	/** (optional) Secondary message to display */
	description?: string;
	/** (required) Type of toaster */
	type: EToasterType;
	/** (optional) Time to live of the toaster */
	ttl?: number;
}

export interface IToasterEvents {
	/** Emitted when close button is clicked */
	clickCloseButton: EventEmitter<MouseEvent>;
	/** Emitted when ttl is defined and expires */
	ttlExpired: EventEmitter<CloseEvent>;
}
