import { EIconName, EOtherIconName } from '../icon/icon.types';

export interface ITagStatus {
	/** (required) Defines the color of the icon.*/
	state: ETagState;
	/** (required) Defines the icon to be displayed.*/
	icon: EIconName | EOtherIconName;
	/** (optional) Defines the content of the label.*/
	label?: string;
}

export enum ETagState {
	Unknown = 'unknown',
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
	Info = 'info'
}
