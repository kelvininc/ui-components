import type { Meta, StoryObj } from "@storybook/react";

import {
	EAnchorTarget,
	EIconName,
	KvLink
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Navigation/Link",
	component: KvLink,
	argTypes: {
		leftIcon: {
			control: { type: "select" },
			options: ["", ...Object.values(EIconName)]
		},
		rightIcon: {
			control: { type: "select" },
			options: ["", ...Object.values(EIconName)]
		}
	}
} satisfies Meta<typeof KvLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
	args: {
		label: "Link Label"
	}
};

export const LabelWithAnchorAndIcon: Story = {
	args: {
		label: "Link Label",
		href: "https://kelvin.ai",
		target: EAnchorTarget.NewTab,
		rightIcon: EIconName.ExternalLink
	}
};

export const LabelWithIcon: Story = {
	args: {
		label: "Link Label",
		leftIcon: EIconName.ExternalLink
	}
};

export const LabelAndSubtitle: Story = {
	args: {
		label: "Link Label",
		subtitle: "Link Subtitle"
	}
};
