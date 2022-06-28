import { EIconName } from '../icon/icon.types';
import { ETreeItemState } from './tree-item.types';

export const STATE_ICONS: { [key in ETreeItemState]: EIconName } = {
	[ETreeItemState.Success]: EIconName.Success,
	[ETreeItemState.Error]: EIconName.Error,
	[ETreeItemState.Warning]: EIconName.Warning,
	[ETreeItemState.Info]: EIconName.Info,
	[ETreeItemState.None]: null
};
