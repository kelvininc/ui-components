import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTabItem, KvTabList, EComponentSize } from '../../components';

// Required to have the correct TagName in the code sample
KvTabList.displayName = 'KvTabList';

export default {
	title: 'Components/Tab List',
	component: 'kv-tab-list',
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
		notes: require('@ui-notes/tab-list/readme.md')
	}
};

const TabListTemplate: ComponentStory<typeof KvTabList> = args => (
	<KvTabList {...args}>
		<KvTabItem tabKey={'tab1'} label={'Tab 1'} selected></KvTabItem>
		<KvTabItem tabKey={'tab2'} label={'Tab 1'} hasNotification></KvTabItem>
		<KvTabItem tabKey={'tab3'} label={'Tab 1'}></KvTabItem>
	</KvTabList>
);

export const Default = TabListTemplate.bind(this);
Default.args = {
	selectedTabKey: 'tab1'
};
