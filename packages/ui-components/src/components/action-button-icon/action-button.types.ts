import { EBadgeState } from '../badge/badge.types';

export interface IButtonIcon {
	/** (optional) Defines button's badge label. If set, an badge will be displayed in the end of action icon button.*/
	badgeLabel?: string;
	/** (optional) Defines button's badge type. */
	badgeState?: EBadgeState;
}
