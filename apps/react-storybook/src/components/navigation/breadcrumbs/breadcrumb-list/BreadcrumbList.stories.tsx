import type { Meta, StoryObj } from "@storybook/react";

import {
	KvBreadcrumbList,
	KvBreadcrumbItem,
	KvLink
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Navigation/Breadcrumbs/Breadcrumb List",
	component: KvBreadcrumbList,
	render: (args) => (
		<KvBreadcrumbList {...args}>
			<KvBreadcrumbItem label="First label here"></KvBreadcrumbItem>
			<KvBreadcrumbItem label="Second label here"></KvBreadcrumbItem>
			<KvBreadcrumbItem active>
				<a>
					<KvLink label="Last label here" />
				</a>
			</KvBreadcrumbItem>
		</KvBreadcrumbList>
	)
} satisfies Meta<typeof KvBreadcrumbList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {}
};
