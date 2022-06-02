import { EIconName, ETreeItemState, ITreeNodeItem } from '@kelvininc/ui-components';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvTree } from '../../components';

// Required to have the correct TagName in the code sample
KvTree.displayName = 'KvTree';

export default {
	title: 'Data Display/Tree/Tree',
	component: 'kv-tree',
	argTypes: {},
	parameters: {
		notes: require('@ui-notes/tree/readme.md')
	}
};
const TreeTemplate: ComponentStory<typeof KvTree> = args => {
	const [selectedNode, setNode] = useState(args.selectedNode);
	const [expandedNodes, setExpandedNodes] = useState(args.expandedNodes || {});

	const handleItemClick = (event: CustomEvent<ITreeNodeItem>) => {
		setNode(event.detail.id);
	};

	const allowDrop = (element: any, to: { parent: ITreeNodeItem; index: number }, $event?: any) => {
		console.log('handleAllowDrop element:', element);
		console.log('\t parent:', to.parent, to.index);
		return to.parent ? false : true;
	};

	const handleToggleExpand = (event: CustomEvent<ITreeNodeItem>) => {
		setExpandedNodes({
			...expandedNodes,
			[event.detail.id]: !expandedNodes[event.detail.id]
		});
	};

	return (
		<KvTree
			allowDrag={(item: ITreeNodeItem) => item.id !== '2'}
			selectedNode={selectedNode}
			expandedNodes={expandedNodes}
			onNodeClick={handleItemClick}
			onNodeToggleExpand={handleToggleExpand}
			allowDrop={allowDrop}
			{...args}
		/>
	);
};

const nodes: ITreeNodeItem[] = [
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
		counterState: ETreeItemState.Error
	},
	{
		id: '3',
		label: 'Node 3'
	},
	{
		id: '4',
		label: 'Node 4',
		icon: EIconName.AssetA,
		children: [
			{
				id: '4.2',
				label: 'Node 4.2 (Disabled)',
				icon: EIconName.AssetC
			},
			{
				id: '4.3',
				label: 'Node 4.3',
				icon: EIconName.AssetP
			},
			{
				id: '4.4',
				label: 'Node 4.4 (Highlighted)',
				icon: EIconName.AssetP
			},
			{
				id: '4.5',
				label: 'Node 4.5',
				icon: EIconName.AssetC,
				children: [
					{
						id: '4.5.1',
						label: 'Node 4.5.1',
						icon: EIconName.AssetS
					},
					{
						id: '4.5.2',
						label: 'Node 4.5.2',
						icon: EIconName.AssetS
					}
				]
			}
		]
	},
	{
		id: '5',
		label: 'Node 5',
		icon: EIconName.AssetA,
		children: [
			{
				id: '5.2',
				label: 'Node 5.2 (Disabled)',
				icon: EIconName.AssetC
			},
			{
				id: '5.3',
				label: 'Node 5.3',
				icon: EIconName.AssetP
			},
			{
				id: '5.4',
				label: 'Node 5.4 (Highlighted)',
				icon: EIconName.AssetP
			},
			{
				id: '5.5',
				label: 'Node 5.5',
				icon: EIconName.AssetC,
				children: [
					{
						id: '5.5.1',
						label: 'Node 5.5.1',
						icon: EIconName.AssetS
					},
					{
						id: '5.5.2',
						label: 'Node 5.5.2',
						icon: EIconName.AssetS
					}
				]
			}
		]
	},
	{
		id: '6',
		label: 'Node 6',
		icon: EIconName.AssetA,
		children: [
			{
				id: '6.2',
				label: 'Node 6.2 (Disabled)',
				icon: EIconName.AssetC
			},
			{
				id: '6.3',
				label: 'Node 6.3',
				icon: EIconName.AssetP
			},
			{
				id: '6.4',
				label: 'Node 6.4 (Highlighted)',
				icon: EIconName.AssetP
			},
			{
				id: '6.5',
				label: 'Node 6.5',
				icon: EIconName.AssetC,
				children: [
					{
						id: '6.5.1',
						label: 'Node 6.5.1',
						icon: EIconName.AssetS
					},
					{
						id: '6.5.2',
						label: 'Node 6.5.2',
						icon: EIconName.AssetS
					}
				]
			}
		]
	}
];

export const Default = TreeTemplate.bind(this);
Default.args = {
	nodes: nodes,
	disabledNodes: {
		'1.2': true
	},
	highlightedNodes: {
		'1.4': true
	},
	loadingNodes: {
		'1.5.2': true
	},
	hiddenNodes: {}
};
