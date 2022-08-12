import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvDropdown, KvSelect, KvSelectOption, EIconName, EOtherIconName, EValidationState } from '../../components';

export default {
	title: 'Dropdown/Dropdown',
	component: 'kv-dropdown',
	argTypes: {
		placeholder: {
			control: { type: 'text' }
		},
		isOpen: {
			control: { type: 'boolean' }
		},
		loading: {
			control: { type: 'boolean' }
		},
		disabled: {
			control: { type: 'boolean' }
		},
		required: {
			control: { type: 'boolean' }
		},
		label: {
			control: { type: 'text' }
		},
		value: {
			control: { type: 'text' }
		},
		helpText: {
			control: { type: 'text' }
		},
		icon: {
			control: { type: 'select' },
			options: ['', ...Object.values(EIconName), ...Object.values(EOtherIconName)]
		},
		errorState: {
			control: { type: 'select' },
			options: ['', ...Object.values(EValidationState)]
		}
	},
	parameters: {
		notes: require('@ui-notes/dropdown/readme.md')
	}
};

KvDropdown.displayName = 'KvDropdown';

const DropdownTemplate: ComponentStory<typeof KvDropdown> = args => (
	<KvDropdown {...args}>
		<KvSelect searchable={true}>
			<KvSelectOption label="First label here" value="value-01" togglable={true}></KvSelectOption>
			<KvSelectOption label="Second label here" value="value-02" togglable={true}></KvSelectOption>
			<KvSelectOption label="Third label here" value="value-03" disabled togglable={true}></KvSelectOption>
			<KvSelectOption label="Fourth label here" value="value-04" togglable={true}></KvSelectOption>
			<KvSelectOption label="Fifth label here" value="value-05" togglable={true}></KvSelectOption>
			<KvSelectOption label="Sixth label here" value="value-06" togglable={true}></KvSelectOption>
			<KvSelectOption label="Seventh label here" value="value-07" togglable={true}></KvSelectOption>
			<KvSelectOption label="Eigth label here" value="value-08" togglable={true}></KvSelectOption>
		</KvSelect>
	</KvDropdown>
);

export const Default = DropdownTemplate.bind({});
Default.args = {
	placeholder: 'Select an option',
	label: 'Options',
	icon: EIconName.Layer,
	required: true,
	helpText: 'You can select several options'
};
