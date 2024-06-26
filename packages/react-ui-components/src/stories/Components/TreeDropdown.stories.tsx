import { EIconName, ITreeNodeItem } from '@kelvininc/ui-components';
import React, { useState } from 'react';

import { ComponentStory } from '@storybook/react';
import { KvTreeDropdown } from '../../components';

// Required to have the correct TagName in the code sample
KvTreeDropdown.displayName = 'KvDropdownTree';

export default {
	title: 'Data Display/Tree/Tree Dropdown',
	component: 'kv-tree-dropdown',
	argTypes: {},
	parameters: {
		notes: require('@ui-notes/tree/readme.md')
	}
};
const TreeDropdownTemplate: ComponentStory<typeof KvTreeDropdown> = args => {
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

	return (
		<KvTreeDropdown
			selectedNode={selectedNode}
			expandedNodes={expandedNodes}
			onNodeClick={handleItemClick}
			onNodeToggleExpand={handleToggleExpand}
			showTooltip
			tooltipDelay={1000}
			{...args}
		/>
	);
};

const nodes: ITreeNodeItem[] = [
	{
		id: '1',
		label: 'Business Units A',
		icon: EIconName.Asset,
		children: [
			{
				id: '1-houston',
				label: 'Houston - US',
				icon: EIconName.Bullet
			},
			{
				id: '1-denver',
				label: 'Denver - US',
				icon: EIconName.Bullet
			},
			{
				id: '1-lisbon',
				label: 'Lisbon - Portugal',
				icon: EIconName.Bullet
			},
			{
				id: '1-melbourne',
				label: 'Melbourne - Australia',
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: '2',
		label: 'Business Units B',
		icon: EIconName.Asset,
		children: [
			{
				id: '2-houston',
				label: 'Houston - US',
				icon: EIconName.Bullet
			},
			{
				id: '2-denver',
				label: 'Denver - US',
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: '3',
		label: 'Site D',
		icon: EIconName.Asset
	},
	{
		id: '4',
		label: 'Process Map ABC',
		icon: EIconName.Asset
	},
	{
		id: '5',
		label: 'Enterprise Process Map 01 (Production)',
		icon: EIconName.Asset
	}
];

const tree: ITreeNodeItem[] = [
	{
		id: '1',
		label: 'Business Units A',
		icon: EIconName.Asset,
		children: [
			{
				id: '1-houston',
				label: 'Houston - US',
				icon: EIconName.Bullet,
				children: [
					{
						id: '1-houston-1',
						label: 'Process Map ABC',
						icon: EIconName.Asset
					},
					{
						id: '1-houston-2',
						label: 'Production Line K',
						icon: EIconName.Asset
					}
				]
			},
			{
				id: '1-denver',
				label: 'Denver - US',
				icon: EIconName.Bullet
			},
			{
				id: '1-lisbon',
				label: 'Lisbon - Portugal',
				icon: EIconName.Bullet
			},
			{
				id: '1-melbourne',
				label: 'Melbourne - Australia',
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: '2',
		label: 'Business Units B',
		icon: EIconName.Asset,
		children: [
			{
				id: '2-houston',
				label: 'Houston - US',
				icon: EIconName.Bullet
			},
			{
				id: '2-denver',
				label: 'Denver - US',
				icon: EIconName.Bullet
			}
		]
	},
	{
		id: '3',
		label: 'Site D',
		icon: EIconName.Asset
	},
	{
		id: '4',
		label: 'Process Map ABC',
		icon: EIconName.Asset
	},
	{
		id: '5',
		label: 'Enterprise Process Map 01 (Production)',
		icon: EIconName.Asset
	}
];

export const Default = TreeDropdownTemplate.bind(this);
Default.args = {
	nodes: nodes
};

export const Nested = TreeDropdownTemplate.bind(this);
Nested.args = {
	nodes: tree
};
