import { ComponentStory } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/client-api';
import { EIconName, KvToggleButton } from '../../components';

export default {
	title: 'Inputs/Toggle Button',
	component: 'kv-toggle-button',
	argTypes: {
		onCheckedChange: {
			action: 'checkedChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/toggle-button/readme.md')
	}
};

KvToggleButton.displayName = 'KvToggleButton';

const ToggleButtonTemplate: ComponentStory<typeof KvToggleButton> = args => {
	const [{ checked }, updateArgs] = useArgs();
	const onCheckedChange = () => updateArgs({ checked: !(checked === true) });

	return <KvToggleButton {...args} onCheckedChange={onCheckedChange} />;
};

export const DefaultState = ToggleButtonTemplate.bind({});
DefaultState.args = {
	label: 'Option 1',
	value: 'opt1'
};

export const CheckedState = ToggleButtonTemplate.bind({});
CheckedState.args = {
	label: 'Option 2',
	value: 'opt2',
	checked: true
};

export const DisabledState = ToggleButtonTemplate.bind({});
DisabledState.args = {
	label: 'Option 3',
	value: 'opt3',
	disabled: true
};

export const WithIconState = ToggleButtonTemplate.bind({});
WithIconState.args = {
	icon: EIconName.Add,
	label: 'Option 4',
	value: 'opt4'
};

export const OnlyIconState = ToggleButtonTemplate.bind({});
OnlyIconState.args = {
	icon: EIconName.Add,
	value: 'opt5'
};

export const WithRadioState = ToggleButtonTemplate.bind({});
WithRadioState.args = {
	label: 'Option 6',
	value: 'opt6',
	withRadio: true
};
