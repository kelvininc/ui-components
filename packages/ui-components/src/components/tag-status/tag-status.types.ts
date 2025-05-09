import { EComponentSize } from '../../types';
import { EIconName } from '../icon/icon.types';

export interface ITagStatus {
	/** (required) Defines the color of the icon.*/
	state: ETagState;
	/** (required) Defines the icon to be displayed.*/
	icon: EIconName;
	/** (optional) Defines the content of the label.*/
	label?: string;
	/** (optional) Defines the tag status size. Default: 'small'.*/
	size?: EComponentSize;
}

export enum ETagState {
	Unknown = 'unknown',
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
	Info = 'info'
}
