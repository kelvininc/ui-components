import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvSelect, KvSelectOption } from '../../components';

export default {
	title: 'Select/Select',
	component: 'kv-select',
	parameters: {
		notes: require('@ui-notes/select/readme.md')
	}
};

KvSelect.displayName = 'KvSelect';

const SelectTemplate: ComponentStory<typeof KvSelect> = args => (
	<KvSelect {...args}>
		<KvSelectOption label="First label here" value="value-01" togglable={true}></KvSelectOption>
		<KvSelectOption label="Second label here" value="value-02" togglable={true}></KvSelectOption>
		<KvSelectOption label="Third label here" value="value-03" togglable={true}></KvSelectOption>
		<KvSelectOption label="Fourth label here" value="value-04" togglable={true}></KvSelectOption>
		<KvSelectOption label="Fifth label here" value="value-05" togglable={true}></KvSelectOption>
		<KvSelectOption label="Sixth label here" value="value-06" togglable={true}></KvSelectOption>
		<KvSelectOption label="Seventh label here" value="value-07" togglable={true}></KvSelectOption>
		<KvSelectOption label="Eigth label here" value="value-08" togglable={true}></KvSelectOption>
	</KvSelect>
);

export const Default = SelectTemplate.bind({});
Default.args = {
	searchable: true,
	searchPlaceholder: 'Search Assets',
	selectionClearable: true,
	selectionClearEnabled: true
};
