import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvBreadcrumbList, KvBreadcrumbItem } from '../../components';

export default {
	title: 'Navigation/Breadcrumbs/Breadcrumb List',
	component: 'kv-breadcrumb-list',
	parameters: {
		notes: require('@ui-notes/breadcrumb-list/readme.md')
	}
};

KvBreadcrumbList.displayName = 'KvBreadcrumbList';

const BreadcrumbListTemplate: ComponentStory<typeof KvBreadcrumbList> = args => (
	<KvBreadcrumbList {...args}>
		<KvBreadcrumbItem label="First label here"></KvBreadcrumbItem>
		<KvBreadcrumbItem label="Second label here"></KvBreadcrumbItem>
		<KvBreadcrumbItem label="Last label here" active></KvBreadcrumbItem>
	</KvBreadcrumbList>
);

export const Default = BreadcrumbListTemplate.bind({});
