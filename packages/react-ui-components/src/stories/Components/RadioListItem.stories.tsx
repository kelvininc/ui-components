import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRadioListItem } from '../../components';

export default {
	title: 'Inputs/Radio List Item',
	component: 'kv-radio-list-item',
	argTypes: {
		optionId: {
			control: {
				type: 'text'
			}
		},
		label: {
			control: {
				type: 'text'
			}
		},
		description: {
			control: {
				type: 'text'
			}
		},
		checked: {
			control: {
				type: 'boolean'
			}
		},
		disabled: {
			control: {
				type: 'boolean'
			}
		}
	},
	parameters: {
		notes: require('@ui-notes/radio-list-item/readme.md')
	}
};

KvRadioListItem.displayName = 'KvRadioListItem';

const RadioListItemTemplate: ComponentStory<typeof KvRadioListItem> = args => <KvRadioListItem {...args} />;

export const Default = RadioListItemTemplate.bind(this);

Default.args = {
	optionId: 'k3s',
	label: 'K3S',
	description: 'To create an edge cluster, use the Kelvin installation script for K3S. For more information, see the [documentation](https://docs.kelvininc.com/4.10.2/) here.'
};

export const Selected = RadioListItemTemplate.bind(this);
Selected.args = {
	...Default.args,
	checked: true
};

export const Disabled = RadioListItemTemplate.bind(this);
Disabled.args = {
	...Default.args,
	disabled: true
};
