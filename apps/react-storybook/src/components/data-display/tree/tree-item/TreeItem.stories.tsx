import { EBadgeState, EIconName, EOtherIconName } from '@kelvininc/react-ui-components';
import { KvTreeItem, ETreeItemState } from '@kelvininc/react-ui-components';
import { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

const meta = {
	title: 'Data Display/Tree/Tree Item',
	component: KvTreeItem,
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
} satisfies Meta<typeof KvTreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'default node'
	}
};

export const Selected: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'selected node',
		selected: true
	}
};

export const Highlighted: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'highlighted node',
		highlighted: true
	}
};

export const Disabled: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'disabled node',
		disabled: true
	}
};

export const NoFilled: Story = {
	args: {
		additionalLabel: 'no filled node',
		placeholder: 'Please fill the title'
	}
};

export const WithIcon: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'default state node',
		icon: EIconName.AssetA
	}
};

export const WithIconState: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'default state node',
		icon: EIconName.AssetA,
		iconState: ETreeItemState.Error
	}
};

export const WithCounter: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'default state node',
		counter: 32
	}
};

export const WithCounterState: Story = {
	args: {
		label: 'Node title',
		additionalLabel: 'default state node',
		counter: 32,
		counterState: EBadgeState.Success
	}
};


const ChildrenTreeTemplate: StoryFn<ComponentProps<typeof KvTreeItem>> = args => {
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

export const WithChildren: Story = {
	render: ChildrenTreeTemplate,
	args: {}
}
