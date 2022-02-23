import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAnchorTarget, KvBreadcrumbItem } from '../../components';

export default {
	title: 'Components/Breadcrumb Item',
	component: 'kv-breadcrumb-item',
	argTypes: {
		target: {
			control: { type: 'inline-radio' },
			options: Object.values(EAnchorTarget)
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
	label: 'Homepage',
	href: 'https://kelvin.ai',
	target: EAnchorTarget.NewTab
};

export const Active = BreadcrumbItemTemplate.bind({});
Active.argTypes = {
	...Active.argTypes,
	active: {
		control: false
	}
};

Active.args = {
	label: 'Homepage',
	href: 'https://kelvin.ai',
	target: EAnchorTarget.NewTab,
	active: true
};
