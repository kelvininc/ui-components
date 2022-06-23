import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvDropdownListItem } from '../../components';

// Required to have the correct TagName in the code sample
KvDropdownListItem.displayName = 'KvDropdownListItem';

export default {
	title: 'Dropdown/Dropdown List Item',
	component: 'kv-dropdown-list-item',
	argTypes: {
		label: {
			control: { type: 'text' }
		},
		value: {
			control: { type: 'text' }
		},
		selected: {
			control: { type: 'boolean' }
		},
		togglable: {
			control: { type: 'boolean' }
		}
	},
	parameters: {
		notes: require('@ui-notes/dropdown-list-item/readme.md')
	}
};

const DropdownListItemTemplate: ComponentStory<typeof KvDropdownListItem> = args => <KvDropdownListItem {...args}></KvDropdownListItem>;

export const Default = DropdownListItemTemplate.bind({});
Default.args = {
	label: 'Label 1',
	value: 'label-1',
	selected: true,
	togglable: true
};
