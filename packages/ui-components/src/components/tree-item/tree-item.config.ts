import { EIconName } from '../icon/icon.types';
import { ETreeItemStates } from './tree-item.types';

export const STATE_ICONS: { [key in ETreeItemStates]: EIconName } = {
	[ETreeItemStates.Success]: EIconName.Success,
	[ETreeItemStates.Error]: EIconName.Error,
	[ETreeItemStates.Warning]: EIconName.Warning,
	[ETreeItemStates.Info]: EIconName.Info,
	[ETreeItemStates.None]: null
};
