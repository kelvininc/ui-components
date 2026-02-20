import { EIconName } from '../icon/icon.types';
import { ETreeItemState } from '../tree-item/tree-item.types';
import { EBadgeType } from '../badge/badge.types';

export interface ITreeNodeItem {
	id: string; // Should be unique
	label?: string;
	additionalLabel?: string;
	placeholder?: string;
	icon?: EIconName;
	iconState?: ETreeItemState; // Need to validate if it should be here because can change constantly
	counter?: number; // Need to validate if it should be here because can change constantly
	counterState?: EBadgeType;
	lazyLoadChildren?: boolean;
	metadata?: any;
	children?: ITreeNodeItem[];
	preventDefault?: boolean;
}
