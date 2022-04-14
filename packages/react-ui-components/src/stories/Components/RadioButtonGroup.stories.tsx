import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRadioButtonGroup } from '../../components';

export default {
	title: 'Inputs/Radio Button Group',
	component: 'kv-radio-button-group',
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/radio-button-group/readme.md')
	}
};

KvRadioButtonGroup.displayName = 'KvRadioButtonGroup';

const RadioButtonGroupTemplate: ComponentStory<typeof KvRadioButtonGroup> = args => <KvRadioButtonGroup {...args} />;

export const DefaultState = RadioButtonGroupTemplate.bind({});
DefaultState.args = {
	buttons: [
		{
			label: 'Option 1',
			value: 'opt1'
		},
		{
			label: 'Option 2',
			value: 'opt2'
		},
		{
			label: 'Option 3',
			value: 'opt3',
			disabled: true
		},
		{
			label: 'Option 4',
			value: 'opt4',
			checked: true
		},
		{
			label: 'Option 5',
			value: 'opt5'
		}
	]
};
