import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvTabNavigation, EComponentSize } from '../../components';

// Required to have the correct TagName in the code sample
KvTabNavigation.displayName = 'KvTabNavigation';

export default {
	title: 'Navigation/Tabs/Tab Navigation',
	component: 'kv-tab-navigation',
	argTypes: {
		selectedTabKey: {
			control: 'text'
		},
		size: {
			control: 'select',
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/tab-navigation/readme.md')
	}
};

const TabNavigationTemplate: ComponentStory<typeof KvTabNavigation> = args => {
	const [selectedTab, setTab] = useState(args.selectedTabKey);

	const handleTabChange = (event: CustomEvent<string>) => {
		setTab(event.detail);
	};

	return <KvTabNavigation tabs={args.tabs} selectedTabKey={selectedTab} onTabChange={handleTabChange} notifications={args.notifications} size={args.size}></KvTabNavigation>;
};

export const Default = TabNavigationTemplate.bind({});
Default.args = {
	tabs: [
		{
			tabKey: 'assets',
			label: 'Assets'
		},
		{
			tabKey: 'components',
			label: 'Components'
		},
		{
			tabKey: 'parts',
			label: 'Parts'
		},
		{
			tabKey: 'sensors',
			label: 'Sensors'
		}
	],
	selectedTabKey: 'assets',
	notifications: {
		components: {
			active: true
		}
	}
};
