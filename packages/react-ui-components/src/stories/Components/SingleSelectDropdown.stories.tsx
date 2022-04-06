import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, KvSingleSelectDropdown } from '../../components';

// Required to have the correct TagName in the code sample
KvSingleSelectDropdown.displayName = 'KvSingleSelectDropdown';

export default {
	title: 'Dropdown/Single Select Dropdown',
	component: 'kv-single-select-dropdown',
	argTypes: {
		isOpen: {
			control: { type: 'boolean' }
		},
		icon: {
			control: { type: 'text' }
		},
		placeholder: {
			control: { type: 'text' }
		},
		searchable: {
			control: { type: 'boolean' }
		},
		required: {
			control: { type: 'boolean' }
		},
		disabled: {
			control: { type: 'boolean' }
		},
		label: {
			control: { type: 'text' }
		},
		helpText: {
			control: { type: 'text' }
		},
		errorState: {
			control: { type: 'text' }
		},
		selectedOption: {
			control: { type: 'text' }
		}
	},
	parameters: {
		notes: require('@ui-notes/multi-select-dropdown/readme.md')
	}
};

const SingleSelectDropdownTemplate: ComponentStory<typeof KvSingleSelectDropdown> = args => <KvSingleSelectDropdown {...args} />;

export const Default = SingleSelectDropdownTemplate.bind({});
Default.args = {
	options: {
		option1: {
			value: 'option1',
			label: 'Option 1'
		},
		option2: {
			value: 'option2',
			label: 'Option 2'
		},
		option3: {
			value: 'option3',
			label: 'Option 3'
		}
	},
	selectedOption: 'option2',
	label: 'Options',
	placeholder: 'optione',
	icon: EIconName.Layer
};
