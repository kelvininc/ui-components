import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, KvMultiSelectDropdown } from '../../components';

// Required to have the correct TagName in the code sample
KvMultiSelectDropdown.displayName = 'KvMultiSelectDropdown';

export default {
	title: 'Dropdown/Multi Select Dropdown',
	component: 'kv-multi-select-dropdown',
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
		selectionClearable: {
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
		selectedOptions: {
			control: { type: 'array' }
		}
	},
	parameters: {
		notes: require('@ui-notes/single-select-dropdown/readme.md')
	}
};

const MultiSelectDropdownTemplate: ComponentStory<typeof KvMultiSelectDropdown> = args => <KvMultiSelectDropdown {...args} />;

export const Default = MultiSelectDropdownTemplate.bind({});
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
	selectedOptions: ['option2', 'option3'],
	label: 'Options',
	icon: EIconName.Layer,
	searchable: true,
	selectionClearable: true
};
