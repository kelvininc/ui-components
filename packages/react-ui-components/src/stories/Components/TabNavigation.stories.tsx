import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTabNavigation, EComponentSize } from '../../components';
import { useArgs } from '@storybook/client-api';

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
			control: 'radio',
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/tab-navigation/readme.md')
	}
};

const TabNavigationTemplate: ComponentStory<typeof KvTabNavigation> = args => {
	const [, updateArgs] = useArgs();

	const handleTabChange = (event: CustomEvent<string>) => {
		updateArgs({ selectedTabKey: event.detail });
	};

	return <KvTabNavigation tabs={args.tabs} selectedTabKey={args.selectedTabKey} notifications={args.notifications} size={args.size} onTabChange={handleTabChange} />;
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
