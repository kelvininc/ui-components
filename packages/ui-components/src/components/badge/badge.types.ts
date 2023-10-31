export interface IBadge {
	/** (optional) Defines the badge state.*/
	state?: EBadgeState;
}

export enum EBadgeState {
	None = 'none',
	Info = 'info',
	Secondary = 'secondary',
	Warning = 'warning',
	Error = 'error',
	Success = 'success'
}
