import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAnchorTarget, IBreadcrumbItem, KvBreadcrumbItem } from '../../components';

export default {
	title: 'Navigation/Breadcrumbs/Breadcrumb Item',
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
const CustomBreadcrumbItemTemplate: ComponentStory<typeof KvBreadcrumbItem> = ({ label, ...otherProps }: IBreadcrumbItem) => (
	<KvBreadcrumbItem label={label} {...otherProps}>
		⭐️{label}⭐️
	</KvBreadcrumbItem>
);

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

export const CustomLabel = CustomBreadcrumbItemTemplate.bind({});
CustomLabel.args = {
	label: 'Homepage',
	href: 'https://kelvin.ai',
	target: EAnchorTarget.NewTab,
	active: true
};
