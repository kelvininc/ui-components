import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvSelectOption } from '../../components';

// Required to have the correct TagName in the code sample
KvSelectOption.displayName = 'KvSelectOption';

export default {
	title: 'Select/Select Item',
	component: 'kv-select-option',
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
		disabled: {
			control: { type: 'boolean' }
		},
		togglable: {
			control: { type: 'boolean' }
		}
	},
	parameters: {
		notes: require('@ui-notes/select-option/readme.md')
	}
};

const SelectOptionTemplate: ComponentStory<typeof KvSelectOption> = args => <KvSelectOption {...args}></KvSelectOption>;

export const Default = SelectOptionTemplate.bind({});
Default.args = {
	label: 'Label 1',
	value: 'label-1',
	selected: true,
	togglable: true,
	disabled: false
};
