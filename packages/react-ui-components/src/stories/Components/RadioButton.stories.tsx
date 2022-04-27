import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/client-api';
import { KvRadioButton } from '../../components';

export default {
	title: 'Inputs/Radio Button',
	component: 'kv-radio-button',
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/radio-button/readme.md')
	}
};

KvRadioButton.displayName = 'KvRadioButton';

const RadioButtonTemplate: ComponentStory<typeof KvRadioButton> = args => {
	const [{ checked }, updateArgs] = useArgs();
	const onCheckedChange = () => updateArgs({ checked: !(checked === true) });

	return <KvRadioButton {...args} onCheckedChange={onCheckedChange} />;
};

export const DefaultState = RadioButtonTemplate.bind({});
DefaultState.args = {
	label: 'Option 1',
	value: 'opt1'
};

export const CheckedState = RadioButtonTemplate.bind({});
CheckedState.args = {
	label: 'Option 2',
	value: 'opt2',
	checked: true
};

export const DisabledState = RadioButtonTemplate.bind({});
DisabledState.args = {
	label: 'Option 3',
	value: 'opt3',
	disabled: true
};
