import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { KvBadge, EBadgeType } from "@kelvininc/react-ui-components/client";
import { ComponentProps } from "react";

const BadgeTemplate: StoryFn<ComponentProps<typeof KvBadge>> = (args) => (
	<KvBadge {...args}>12</KvBadge>
);

const meta = {
	title: "Data Display/Badge",
	component: KvBadge,
	argTypes: {
		type: {
			control: { type: "select" },
			options: Object.values(EBadgeType)
		}
	},
	render: BadgeTemplate
} satisfies Meta<typeof KvBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryType: Story = {
	args: {
		type: EBadgeType.Primary
	}
};

export const SecondaryType: Story = {
	args: {
		type: EBadgeType.Secondary
	}
};
