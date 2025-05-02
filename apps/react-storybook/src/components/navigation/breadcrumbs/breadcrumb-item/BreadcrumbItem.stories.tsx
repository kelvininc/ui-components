import type { Meta, StoryObj } from '@storybook/react';
import { KvBreadcrumbItem } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Navigation/Breadcrumbs/Breadcrumb Item',
	component: KvBreadcrumbItem,
	argTypes: {
		active: {
			control: false
		}
	}
} satisfies Meta<typeof KvBreadcrumbItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
	args: {
		label: 'Homepage'
	}
};

export const Active: Story = {
	args: {
		label: 'Homepage',
		active: true
	}
};
