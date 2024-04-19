import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvBreadcrumbItem } from '../../components';

export default {
	title: 'Navigation/Breadcrumbs/Breadcrumb Item',
	component: 'kv-breadcrumb-item',
	argTypes: {
		active: {
			control: false
		}
	},
	parameters: {
		notes: require('@ui-notes/breadcrumb-item/readme.md')
	}
};

KvBreadcrumbItem.displayName = 'KvBreadcrumbItem';

const BreadcrumbItemTemplate: ComponentStory<typeof KvBreadcrumbItem> = args => <KvBreadcrumbItem {...args} />;

export const Inactive = BreadcrumbItemTemplate.bind({});
Inactive.args = {
	label: 'Homepage'
};

export const Active = BreadcrumbItemTemplate.bind({});
Active.args = {
	label: 'Homepage',
	active: true
};
