import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRadioButtonGroup } from '../../components';

export default {
	title: 'Inputs/Radio Button Group',
	component: 'kv-radio-button-group',
	parameters: {
		notes: require('@ui-notes/radio-button-group/readme.md')
	}
};

KvRadioButtonGroup.displayName = 'KvRadioButtonGroup';

const RadioButtonGroupTemplate: ComponentStory<typeof KvRadioButtonGroup> = args => <KvRadioButtonGroup {...args} />;

export const Default = RadioButtonGroupTemplate.bind({});
Default.args = {
	buttons: {
		opt1: {
			label: 'Option 1'
		},
		opt2: {
			label: 'Option 2'
		},
		opt3: {
			label: 'Option 3',
			disabled: true
		},
		opt4: {
			label: 'Option 4',
			active: true
		}
	}
};
