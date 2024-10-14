import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { KvTree, ITreeNodeItem } from '@kelvininc/react-ui-components';
import { ComponentProps, useState } from 'react';
import { TREE_NODES_MOCK } from '../../../../mocks/tree.mock';

const meta = {
	title: 'Data Display/Tree/Tree',
	component: KvTree,
	argTypes: {},
} satisfies Meta<typeof KvTree>;

export default meta;
type Story = StoryObj<typeof meta>;

const TreeTemplate: StoryFn<ComponentProps<typeof KvTree>> = args => {
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


export const Default: Story = {
	render: TreeTemplate,
	args: {
		nodes: TREE_NODES_MOCK,
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
	}
}
