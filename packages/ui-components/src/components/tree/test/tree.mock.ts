import { EIconName } from '../../icon/icon.types';
import { ETreeItemState } from '../../tree-item/tree-item.types';
import { ITreeNodeItem } from '../tree.types';
import { EBadgeState } from '../../badge/badge.types';

export const NODES: ITreeNodeItem[] = [
	{
		id: '1',
		label: 'Node 1',
		icon: EIconName.AssetA,
		children: [
			{
				id: '1.2',
				label: 'Node 1.2 (Disabled)',
				icon: EIconName.AssetC
			},
			{
				id: '1.3',
				label: 'Node 1.3',
				icon: EIconName.AssetP
			},
			{
				id: '1.4',
				label: 'Node 1.4 (Highlighted)',
				icon: EIconName.AssetP
			},
			{
				id: '1.5',
				label: 'Node 1.5',
				icon: EIconName.AssetC,
				children: [
					{
						id: '1.5.1',
						label: 'Node 1.5.1',
						icon: EIconName.AssetS
					},
					{
						id: '1.5.2',
						label: 'Node 1.5.2',
						icon: EIconName.AssetS
					}
				]
			}
		]
	},
	{
		id: '2',
		label: 'Node 2',
		icon: EIconName.AssetSStatus,
		iconState: ETreeItemState.Error,
		counter: 32,
		counterState: EBadgeState.Error
	},
	{
		id: '3',
		label: 'Node 3'
	}
];
