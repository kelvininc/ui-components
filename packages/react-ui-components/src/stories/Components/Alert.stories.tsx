import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EAlertType, EComponentSize, KvAlert } from '../../components';

export default {
	title: 'Feedback/Alert',
	component: 'kv-alert',
	argTypes: {
		type: {
			control: {
				type: 'select'
			},
			options: Object.values(EAlertType)
		},
		size: {
			control: {
				type: 'radio'
			},
			options: Object.values(EComponentSize)
		},
		showIcon: {
			control: {
				type: 'boolean'
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
		}
	},
	parameters: {
		notes: require('@ui-notes/alert/readme.md')
	}
};

const AlertTemplate: ComponentStory<typeof KvAlert> = args => <KvAlert {...args} />;

export const Default = AlertTemplate.bind(this);
Default.args = {
	type: EAlertType.Info,
	size: EComponentSize.Large,
	label: 'Main Message',
	description: 'Secondary Message'
};

export const NoIcon = AlertTemplate.bind(this);
NoIcon.args = {
	type: EAlertType.Info,
	showIcon: false,
	label: 'Main Message',
	description: 'Secondary Message'
};

export const SmallSize = AlertTemplate.bind(this);
SmallSize.args = {
	type: EAlertType.Info,
	size: EComponentSize.Small,
	label: 'Main Message',
	description: 'Secondary Message'
};
