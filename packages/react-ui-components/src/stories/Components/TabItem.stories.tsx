import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTabItem, EComponentSize, EIconName } from '../../components';

// Required to have the correct TagName in the code sample
KvTabItem.displayName = 'KvTabItem';

export default {
	title: 'Navigation/Tabs/Tab Item',
	component: 'kv-tab-item',
	argTypes: {
		tabKey: {
			control: 'text'
		},
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/tab-item/readme.md')
	}
};

const TabItemTemplate: ComponentStory<typeof KvTabItem> = args => <KvTabItem {...args} />;

export const Default = TabItemTemplate.bind(this);
Default.args = {
	tabKey: 'tab1',
	label: 'Tab Item'
};

export const Disabled = TabItemTemplate.bind(this);
Disabled.args = {
	...Default.args,
	disabled: true
};

export const Selected = TabItemTemplate.bind(this);
Selected.args = {
	...Default.args,
	selected: true
};

export const WithNotification = TabItemTemplate.bind(this);
WithNotification.args = {
	...Default.args,
	hasNotification: true
};

export const WithIcon = TabItemTemplate.bind(this);
WithNotification.args = {
	...Default.args,
	icon: EIconName.Warning
};

export const SelectedWithNotification = TabItemTemplate.bind(this);
SelectedWithNotification.args = {
	...WithNotification.args,
	selected: true
};
