import type { Meta, StoryObj } from "@storybook/react";
import { KvBreadcrumb } from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Navigation/Breadcrumbs/Breadcrumb",
	component: KvBreadcrumb
} satisfies Meta<typeof KvBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		items: [
			{
				label: "Homepage"
			},
			{
				label: "Product"
			},
			{
				label: "Contact Form"
			}
		]
	}
};
