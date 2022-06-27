import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, KvMultiSelectDropdown } from '../../components';

// Required to have the correct TagName in the code sample
KvMultiSelectDropdown.displayName = 'KvMultiSelectDropdown';

export default {
	title: 'Inputs/Dropdown/Multi Select Dropdown',
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
		notes: require('@ui-notes/multi-select-dropdown/readme.md')
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
		},
		option4: {
			value: 'option4',
			label: 'Option 4'
		},
		option5: {
			value: 'option5',
			label: 'Option 5'
		},
		option6: {
			value: 'option6',
			label: 'Option 6'
		},
		option7: {
			value: 'option7',
			label: 'Option 7'
		},
		option8: {
			value: 'option8',
			label: 'Option 8'
		}
	},
	selectedOptions: ['option2', 'option3'],
	label: 'Options',
	icon: EIconName.Layer,
	searchable: true,
	selectionClearable: true
};
