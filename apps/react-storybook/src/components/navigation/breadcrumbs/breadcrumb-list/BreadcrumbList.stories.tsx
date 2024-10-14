import type { Meta, StoryObj } from '@storybook/react';

import { KvBreadcrumbList, KvBreadcrumbItem } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Navigation/Breadcrumbs/Breadcrumb List',
	component: KvBreadcrumbList,
	render: (args) => (
		<KvBreadcrumbList {...args}>
			<KvBreadcrumbItem label="First label here"></KvBreadcrumbItem>
			<KvBreadcrumbItem label="Second label here"></KvBreadcrumbItem>
			<KvBreadcrumbItem label="Last label here" active></KvBreadcrumbItem>
		</KvBreadcrumbList>
	)
} satisfies Meta<typeof KvBreadcrumbList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {}
}
