import { EBadgeState, EIconName, EOtherIconName } from '@kelvininc/ui-components';
import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTreeItem, ETreeItemState } from '../../components';

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
			options: Object.values(ETreeItemState)
		},
		counterState: {
			control: 'select',
			options: Object.values(ETreeItemState)
		},
		onItemClick: {
			action: 'ItemClicked'
		},
		onToggleExpand: {
			action: 'ToggleExpandClicked'
		}
	},
	parameters: {
		notes: require('@ui-notes/tree-item/readme.md')
	}
};

const TreeItemTemplate: ComponentStory<typeof KvTreeItem> = args => <KvTreeItem {...args} />;

export const Default = TreeItemTemplate.bind(this);
Default.args = {
	label: 'Node title',
	additionalLabel: 'default node'
};
export const Selected = TreeItemTemplate.bind(this);
Selected.args = {
	label: 'Node title',
	additionalLabel: 'selected node',
	selected: true
};
export const Highlighted = TreeItemTemplate.bind(this);
Highlighted.args = {
	label: 'Node title',
	additionalLabel: 'highlighted node',
	highlighted: true
};
export const Disabled = TreeItemTemplate.bind(this);
Disabled.args = {
	label: 'Node title',
	additionalLabel: 'disabled node',
	disabled: true
};
export const NoFilled = TreeItemTemplate.bind(this);
NoFilled.args = {
	additionalLabel: 'no filled node',
	placeholder: 'Please fill the title'
};
export const WithIcon = TreeItemTemplate.bind(this);
WithIcon.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	icon: EIconName.AssetA
};
export const WithIconState = TreeItemTemplate.bind(this);
WithIconState.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	icon: EIconName.AssetA,
	iconState: ETreeItemState.Error
};
export const WithCounter = TreeItemTemplate.bind(this);
WithCounter.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	counter: 32
};
export const WithCounterState = TreeItemTemplate.bind(this);
WithCounterState.args = {
	label: 'Node title',
	additionalLabel: 'default state node',
	counter: 32,
	counterState: EBadgeState.Success
};

const ChildrenTreeTemplate: ComponentStory<typeof KvTreeItem> = args => {
	return (
		<KvTreeItem {...args} label="Node Default" expanded icon={EIconName.AssetA}>
			<KvTreeItem slot="child-slot" {...args} label="Node Disabled" disabled />
			<KvTreeItem slot="child-slot" {...args} label="Node Selected" selected />
			<KvTreeItem slot="child-slot" {...args} label="Node Highlighted" highlighted />
			<KvTreeItem slot="child-slot" {...args} label="Node Default" counter={32} expanded>
				<KvTreeItem slot="child-slot" {...args} loading />
				<KvTreeItem slot="child-slot" {...args} loading />
			</KvTreeItem>
		</KvTreeItem>
	);
};
export const WithChildren = ChildrenTreeTemplate.bind(this);
WithChildren.args = {};
