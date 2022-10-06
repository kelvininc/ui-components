import { EBadgeState, EIconName, ETreeItemState, ITreeNodeItem } from '@kelvininc/ui-components';
import React, { useState } from 'react';

import { ComponentStory } from '@storybook/react';
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

	const handleToggleExpand = (event: CustomEvent<ITreeNodeItem>) => {
		setExpandedNodes({
			...expandedNodes,
			[event.detail.id]: !expandedNodes[event.detail.id]
		});
	};

	return <KvTree selectedNode={selectedNode} expandedNodes={expandedNodes} onNodeClick={handleItemClick} onNodeToggleExpand={handleToggleExpand} {...args} />;
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
		counterState: EBadgeState.Error
	},
	{
		id: '3',
		label: 'Node 3 is a node with a really long name that does not fit inside the box',
		icon: EIconName.AssetS
	},
	{
		id: '4',
		label: 'Node 3'
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
