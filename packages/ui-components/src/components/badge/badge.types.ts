export interface IBadge {
	/** (optional) Defines the badge type.*/
	type?: EBadgeType;
	/** (optional) If `true` the badge is in disabled state. */
	disabled?: boolean;
}

export enum EBadgeType {
	Primary = 'primary',
	Secondary = 'secondary'
}
