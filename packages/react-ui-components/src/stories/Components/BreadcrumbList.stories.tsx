import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAnchorTarget, KvBreadcrumbList, KvBreadcrumbItem } from '../../components';

export default {
	title: 'Components/Breadcrumb List',
	component: 'kv-breadcrumb-list',
	parameters: {
		notes: require('@ui-notes/breadcrumb-list/readme.md')
	}
};

KvBreadcrumbList.displayName = 'KvBreadcrumbList';

const BreadcrumbListTemplate: ComponentStory<typeof KvBreadcrumbList> = args => (
	<KvBreadcrumbList {...args}>
		<KvBreadcrumbItem label="First label here" href="Your link here" target={EAnchorTarget.NewTab}></KvBreadcrumbItem>
		<KvBreadcrumbItem label="Second label here" href="Your link here" target={EAnchorTarget.NewTab}></KvBreadcrumbItem>
		<KvBreadcrumbItem label="Last label here" href="Your link here" target={EAnchorTarget.NewTab} active></KvBreadcrumbItem>
	</KvBreadcrumbList>
);

export const Default = BreadcrumbListTemplate.bind({});
Default.args = {
	separator: '/'
};
