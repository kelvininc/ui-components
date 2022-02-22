import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAnchorTarget, KvBreadcrumb } from '../../components';

export default {
	title: "Components/Breadcrumb",
	component: 'kv-breadcrumb',
	parameters: {
		notes: require('@ui-notes/breadcrumb/readme.md')
	}
}

KvBreadcrumb.displayName = 'KvBreadcrumb';

const BreadcrumbTemplate: ComponentStory<typeof KvBreadcrumb> = (args) => <KvBreadcrumb {...args} />;

export const Primary = BreadcrumbTemplate.bind({});
Primary.args = {
	items: [
		{
			label: 'Homepage',
			href: 'https://kelvin.ai',
			target: EAnchorTarget.NewTab
		},
		{
			label: 'Product',
			href: 'https://kelvin.ai/product/',
			target: EAnchorTarget.NewTab
		},
		{
			label: 'Contact Form',
			href: 'https://kelvin.ai/product#form',
			target: EAnchorTarget.NewTab
		}
	]
};
