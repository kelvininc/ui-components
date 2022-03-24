import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRadioButton } from '../../components';

export default {
	title: 'Inputs/Radio Button',
	component: 'kv-radio-button',
	parameters: {
		notes: require('@ui-notes/radio-button/readme.md')
	}
};

KvRadioButton.displayName = 'KvRadioButton';

const RadioButtonTemplate: ComponentStory<typeof KvRadioButton> = args => <KvRadioButton {...args} />;

export const DefaultWithLabel = RadioButtonTemplate.bind({});
DefaultWithLabel.args = {
	checked: false,
	label: 'Option 1'
};

export const CheckedWithLabel = RadioButtonTemplate.bind({});
CheckedWithLabel.args = {
	checked: true,
	label: 'Option 1'
};

export const Disabled = RadioButtonTemplate.bind({});
Disabled.args = {
	disabled: true,
	label: 'Option 1'
};
