import type { Meta, StoryObj } from "@storybook/react";
import {
	EIconName,
	ETagColor,
	KvTag
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Data Display/Tag",
	component: KvTag,
	argTypes: {
		label: { control: { type: "text" } },
		color: {
			control: { type: "select" },
			options: Object.values(ETagColor)
		},
		icon: {
			control: { type: "select" },
			options: ["", ...Object.values(EIconName)]
		},
		badgeLabel: { control: { type: "text" } }
	}
} satisfies Meta<typeof KvTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
	args: {
		color: ETagColor.Neutral,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};

export const Brand: Story = {
	args: {
		color: ETagColor.Brand,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};

export const Purple: Story = {
	args: {
		color: ETagColor.Purple,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};

export const Green: Story = {
	args: {
		color: ETagColor.Green,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};

export const Yellow: Story = {
	args: {
		color: ETagColor.Yellow,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};

export const Red: Story = {
	args: {
		color: ETagColor.Red,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};

export const Blue: Story = {
	args: {
		color: ETagColor.Blue,
		label: "Tag Name",
		icon: EIconName.Add,
		badgeLabel: "0"
	}
};
