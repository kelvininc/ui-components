import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvDropdownList, KvDropdownListItem } from '../../components';

export default {
	title: 'Dropdown/Dropdown List',
	component: 'kv-dropdown-list',
	parameters: {
		notes: require('@ui-notes/dropdown-list/readme.md')
	}
};

KvDropdownList.displayName = 'KvDropdownList';

const DropdownListTemplate: ComponentStory<typeof KvDropdownList> = args => (
	<KvDropdownList {...args}>
		<KvDropdownListItem label="First label here" value="value-01" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Second label here" value="value-02" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Third label here" value="value-03" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Fourth label here" value="value-04" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Fifth label here" value="value-05" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Sixth label here" value="value-06" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Seventh label here" value="value-07" togglable={true}></KvDropdownListItem>
		<KvDropdownListItem label="Eigth label here" value="value-08" togglable={true}></KvDropdownListItem>
	</KvDropdownList>
);

export const Default = DropdownListTemplate.bind({});
Default.args = {
	searchable: true,
	searchPlaceholder: 'Search Assets',
	selectionClearable: true,
	selectionClearEnabled: true
};
