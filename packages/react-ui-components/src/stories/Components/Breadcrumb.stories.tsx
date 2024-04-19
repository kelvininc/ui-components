import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvBreadcrumb } from '../../components';

export default {
	title: 'Navigation/Breadcrumbs/Breadcrumb',
	component: 'kv-breadcrumb',
	parameters: {
		notes: require('@ui-notes/breadcrumb/readme.md')
	}
};

KvBreadcrumb.displayName = 'KvBreadcrumb';

const BreadcrumbTemplate: ComponentStory<typeof KvBreadcrumb> = args => <KvBreadcrumb {...args} />;

export const Primary = BreadcrumbTemplate.bind({});
Primary.args = {
	items: [
		{
			label: 'Homepage'
		},
		{
			label: 'Product'
		},
		{
			label: 'Contact Form'
		}
	]
};
