import type { Meta, StoryObj } from "@storybook/react";
import {
	EComponentSize,
	EIconName,
	KvActionMenu,
	type IActionMenuItem
} from "@kelvininc/react-ui-components/client";

const topicActions: IActionMenuItem[] = [
	{ id: "move-up", label: "Move up", icon: EIconName.ArrowUpward },
	{ id: "move-down", label: "Move down", icon: EIconName.ArrowDownward },
	{
		id: "remove",
		label: "Remove Topic 1",
		icon: EIconName.Delete,
		destructive: true,
		separatorBefore: true
	}
];

const meta = {
	title: "Dropdown/Action Menu",
	component: KvActionMenu,
	args: {
		accessibleLabel: "Topic 1 actions",
		icon: EIconName.More,
		size: EComponentSize.Small,
		items: topicActions
	},
	argTypes: {
		onItemSelected: { action: "itemSelected" },
		disabled: { control: "boolean" },
		items: { control: "object" },
		icon: { control: "select", options: Object.values(EIconName) },
		size: { control: "radio", options: Object.values(EComponentSize) }
	}
} satisfies Meta<typeof KvActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ObjectItem: Story = {};

export const FirstItem: Story = {
	args: {
		items: topicActions.map((item) => ({
			...item,
			disabled: item.id === "move-up"
		}))
	}
};

export const LastItem: Story = {
	args: {
		items: topicActions.map((item) => ({
			...item,
			disabled: item.id === "move-down"
		}))
	}
};

export const ReorderGrip: Story = {
	args: {
		accessibleLabel: "Reorder Topic 1",
		icon: EIconName.DragDrop,
		items: topicActions.filter((item) => item.id !== "remove")
	}
};

export const Disabled: Story = {
	args: { disabled: true }
};
