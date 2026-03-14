import type { Meta, StoryObj } from "@storybook/react";

import {
	KvTabItem,
	ETabItemType,
	EIconName,
	KvBadge,
	EBadgeType,
	KvTagStatus,
	ETagState
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Navigation/Tabs/Tab Item",
	component: KvTabItem,
	argTypes: {
		tabKey: {
			control: "text"
		},
		type: {
			control: "radio",
			options: Object.values(ETabItemType)
		}
	}
} satisfies Meta<typeof KvTabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		tabKey: "tab1",
		label: "Tab Item"
	}
};

export const Secondary: Story = {
	args: {
		tabKey: "tab1",
		label: "Tab Item",
		type: ETabItemType.Secondary
	}
};

export const SecondaryWithIcon: Story = {
	args: {
		tabKey: "tab1",
		label: "Tab Item",
		icon: EIconName.Add,
		type: ETabItemType.Secondary
	}
};

export const SecondaryOnlyIcon: Story = {
	args: {
		tabKey: "tab1",
		icon: EIconName.Add,
		type: ETabItemType.Secondary
	}
};

export const SecondaryWithBadge: Story = {
	render: function Renderer(args) {
		return (
			<KvTabItem
				tabKey={args.tabKey}
				type={args.type}
				label={args.label}
				disabled={args.disabled}
				selected={args.selected}
			>
				<KvBadge slot="right-slot" type={EBadgeType.Secondary}>
					+3
				</KvBadge>
			</KvTabItem>
		);
	},
	args: {
		tabKey: "tab1",
		label: "Tab Item",
		type: ETabItemType.Secondary
	}
};

export const SecondaryWithTagStatus: Story = {
	render: function Renderer(args) {
		return (
			<KvTabItem
				tabKey={args.tabKey}
				type={args.type}
				label={args.label}
				disabled={args.disabled}
				selected={args.selected}
			>
				<KvTagStatus
					slot="right-slot"
					icon={EIconName.Error}
					state={ETagState.Error}
				/>
			</KvTabItem>
		);
	},
	args: {
		tabKey: "tab1",
		label: "Tab Item",
		type: ETabItemType.Secondary
	}
};
