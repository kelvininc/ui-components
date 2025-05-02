import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ITreeNodeItem } from '@kelvininc/react-ui-components';
import { ComponentProps, useState } from 'react';
import { KvTreeDropdown } from '@kelvininc/react-ui-components';

import { TREE_ENTITIES_NESTED_NODES_MOCK, TREE_ENTITIES_NODES_MOCK } from '../../../../mocks/tree.mock';

const meta = {
	title: 'Data Display/Tree/Tree Dropdown',
	component: KvTreeDropdown,
	argTypes: {}
} satisfies Meta<typeof KvTreeDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const TreeDropdownTemplate: StoryFn<ComponentProps<typeof KvTreeDropdown>> = args => {
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

export const Default: Story = {
	render: TreeDropdownTemplate,
	args: {
		nodes: TREE_ENTITIES_NODES_MOCK
	}
};

export const Nested: Story = {
	render: TreeDropdownTemplate,
	args: {
		nodes: TREE_ENTITIES_NESTED_NODES_MOCK
	}
};
