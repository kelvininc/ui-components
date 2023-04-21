import { EComponentSize, EIconName, KvDropdown, KvSelect, KvSelectOption } from '../../components';

import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/client-api';

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
		inputConfig: {
			control: { type: 'object' }
		}
	},
	parameters: {
		notes: require('@ui-notes/dropdown/readme.md')
	}
};

KvDropdown.displayName = 'KvDropdown';

const DropdownTemplate: ComponentStory<typeof KvDropdown> = args => {
	const [{ isOpen }, updateArgs] = useArgs();
	const onDropdownChange = ({ detail: openState }: CustomEvent<boolean>) => updateArgs({ isOpen: openState });

	return (
		<KvDropdown isOpen={isOpen} onOpenStateChange={onDropdownChange} {...args}>
			<KvSelect searchable={true}>
				<KvSelectOption label="This select option has a really really really long first label here " value="value-01" togglable={true}></KvSelectOption>
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
};

export const Default = DropdownTemplate.bind({});
Default.args = {
	inputConfig: {
		label: 'Options',
		icon: EIconName.Layer,
		required: true,
		placeholder: 'Select an option',
		helpText: 'You can select several options',
		size: EComponentSize.Large
	}
};

export const Disabled = DropdownTemplate.bind({});
Disabled.args = {
	disabled: true,
	inputConfig: {
		label: 'Options',
		icon: EIconName.Layer,
		required: true,
		placeholder: 'Select an option',
		helpText: 'You can select several options',
		size: EComponentSize.Large
	}
};
