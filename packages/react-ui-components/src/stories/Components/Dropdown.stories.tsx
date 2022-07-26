import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvDropdown, KvDropdownList, KvDropdownListItem, EIconName, EOtherIconName, EValidationState } from '../../components';

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
		<KvDropdownList searchable={true}>
			<KvDropdownListItem label="First label here" value="value-01" togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Second label here" value="value-02" togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Third label here" value="value-03" disabled togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Fourth label here" value="value-04" togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Fifth label here" value="value-05" togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Sixth label here" value="value-06" togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Seventh label here" value="value-07" togglable={true}></KvDropdownListItem>
			<KvDropdownListItem label="Eigth label here" value="value-08" togglable={true}></KvDropdownListItem>
		</KvDropdownList>
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
