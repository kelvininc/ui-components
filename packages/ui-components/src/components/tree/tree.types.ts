import { EIconName, EOtherIconName } from '../icon/icon.types';
import { ETreeItemStates } from '../tree-item/tree-item.types';

export interface ITreeNodeItem {
	id: string; // Should be unique
	label?: string;
	additionalLabel?: string;
	placeholder?: string;
	icon?: EIconName | EOtherIconName;
	iconState?: ETreeItemStates; // Need to validate if it should be here because can change constantly
	counter?: number; // Need to validate if it should be here because can change constantly
	counterState?: ETreeItemStates; // Need to validate if it should be here because can change constantly
	lazyLoadChildren?: boolean;
	children?: ITreeNodeItem[];
}
