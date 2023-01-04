import { EIconName } from '../icon/icon.types';

export interface ITagStatus {
	/** (optional) Defines the status tag type.*/
	type?: ETagStatusType;
}

export enum ETagStatusType {
	Running = 'running',
	Online = 'online',
	Failed = 'failed',
	Offline = 'offline',
	Unknown = 'unknown',
	Pending = 'pending',
	Partially = 'partially'
}

export enum ETagState {
	None = 'none',
	Success = 'success',
	Warning = 'warning',
	Error = 'error'
}

export interface ITagStatusConfig {
	label: string;
	icon: EIconName;
	state: ETagState;
}
