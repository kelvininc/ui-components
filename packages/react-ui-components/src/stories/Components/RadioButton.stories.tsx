import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvRadioButton } from '../../components';

export default {
	title: 'Components/Radio Button',
	component: 'kv-radio-button',
	parameters: {
		notes: require('@ui-notes/radio-button/readme.md')
	}
};

KvRadioButton.displayName = 'KvRadioButton';

const RadioButtonTemplate: ComponentStory<typeof KvRadioButton> = args => <KvRadioButton {...args} />;

export const Default = RadioButtonTemplate.bind({});
Default.args = {
	checked: false
};

export const DefaultWithLabel = RadioButtonTemplate.bind({});
DefaultWithLabel.args = {
	...Default.args,
	label: 'Yes'
};

export const Checked = RadioButtonTemplate.bind({});
Checked.args = {
	checked: true
};

export const CheckedWithLabel = RadioButtonTemplate.bind({});
CheckedWithLabel.args = {
	...Checked.args,
	label: 'Yes'
};

export const Disabled = RadioButtonTemplate.bind({});
Disabled.args = {
	disabled: true
};

export const DisabledWithLabel = RadioButtonTemplate.bind({});
DisabledWithLabel.args = {
	...Disabled.args,
	label: 'Yes'
};
