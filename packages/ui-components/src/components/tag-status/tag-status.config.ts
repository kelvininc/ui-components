import { EIconName } from '../icon/icon.types';
import { ETagState, ETagStatusType, ITagStatusConfig } from './tag-status.types';

export const STATUS_CONFIG: { [key in ETagStatusType]: ITagStatusConfig } = {
	[ETagStatusType.Running]: {
		label: 'Running',
		icon: EIconName.Success,
		state: ETagState.Success
	},
	[ETagStatusType.Online]: {
		label: 'Online',
		icon: EIconName.Success,
		state: ETagState.Success
	},
	[ETagStatusType.Failed]: {
		label: 'Failed',
		icon: EIconName.Error,
		state: ETagState.Error
	},
	[ETagStatusType.Offline]: {
		label: 'Offline',
		icon: EIconName.Error,
		state: ETagState.Error
	},
	[ETagStatusType.Unknown]: {
		label: 'Unknown',
		icon: EIconName.Error,
		state: ETagState.None
	},
	[ETagStatusType.Pending]: {
		label: 'Pending Deploy',
		icon: EIconName.Building,
		state: ETagState.Warning
	},
	[ETagStatusType.Partially]: {
		label: 'Partially Online',
		icon: EIconName.Building,
		state: ETagState.Warning
	}
};
