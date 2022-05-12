import { EIconName, EOtherIconName } from '@kelvininc/ui-components';
import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTreeItem, ETreeItemStates } from '../../components';

// Required to have the correct TagName in the code sample
KvTreeItem.displayName = 'KvTreeItem';

export default {
	title: 'Data Display/Tree/Tree Item',
	component: 'kv-tree-item',
	argTypes: {
		icon: {
			control: 'select',
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
		},
		iconState: {
			control: 'select',
			options: Object.values(ETreeItemStates)
		},
		counterState: {
			control: 'select',
			options: Object.values(ETreeItemStates)
		}
	},
	parameters: {
		notes: require('@ui-notes/tree-item/readme.md')
	}
};

const handleToggleExpand = (e: any) => console.log('onToggleExpand', e);
const handleItemClick = (e: any) => console.log('onItemClick', e);

const TreeItemTemplate: ComponentStory<typeof KvTreeItem> = args => <KvTreeItem {...args} />;

export const Default = TreeItemTemplate.bind(this);
Default.args = {
	label: 'Node title',
	additionalLabel: 'default node',
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const Selected = TreeItemTemplate.bind(this);
Selected.args = {
	label: 'Node title',
	additionalLabel: 'selected node',
	selected: true,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const Highlighted = TreeItemTemplate.bind(this);
Highlighted.args = {
	label: 'Node title',
	additionalLabel: 'highlighted node',
	highlighted: true,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const Disabled = TreeItemTemplate.bind(this);
Disabled.args = {
	label: 'Node title',
	additionalLabel: 'disabled node',
	disabled: true,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const NoFilled = TreeItemTemplate.bind(this);
NoFilled.args = {
	additionalLabel: 'no filled node',
	placeholder: 'Please fill the title',
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const WithIcon = TreeItemTemplate.bind(this);
WithIcon.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	icon: EIconName.AssetA,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const WithIconState = TreeItemTemplate.bind(this);
WithIconState.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	icon: EIconName.AssetA,
	iconState: ETreeItemStates.Error,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const WithCounter = TreeItemTemplate.bind(this);
WithCounter.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	counter: 32,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
export const WithCounterState = TreeItemTemplate.bind(this);
WithCounterState.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	counter: 32,
	counterState: ETreeItemStates.Success,
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};

const ChildrenTreeTemplate: ComponentStory<typeof KvTreeItem> = args => {
	return (
		<KvTreeItem label="Node Default" expanded icon={EIconName.AssetA}>
			<KvTreeItem slot="child-slot" label="Node Disabled" disabled />
			<KvTreeItem slot="child-slot" label="Node Selected" selected />
			<KvTreeItem slot="child-slot" label="Node Highlighted" highlighted />
			<KvTreeItem slot="child-slot" label="Node Default" counter="32" expanded>
				<KvTreeItem slot="child-slot" loading />
				<KvTreeItem slot="child-slot" loading />
			</KvTreeItem>
		</KvTreeItem>
	);
};
export const WithChildren = ChildrenTreeTemplate.bind(this);
WithChildren.args = {
	onItemClick: handleItemClick,
	onToggleExpand: handleToggleExpand
};
