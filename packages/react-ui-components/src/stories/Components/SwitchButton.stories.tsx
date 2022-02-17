import { ComponentStory } from '@storybook/react';
import React from 'react';
import { ESwitchButtonState, KvSwitchButton } from '../../components';

// Required to have the correct TagName in the code sample
KvSwitchButton.displayName = 'KvSwitchButton';

export default {
	title: 'Components/Buttons/Switch',
	component: 'kv-switch-button',
	argTypes: {
		state: {
			control: { type: 'select' },
			options: Object.values(ESwitchButtonState)
		}
	},
	parameters: {
		notes: require('@ui-notes/switch-button/readme.md'),
	}
}

const SwitchButtonTemplate: ComponentStory<typeof KvSwitchButton> = (args) => <KvSwitchButton {...args} />;

export const DefaultState = SwitchButtonTemplate.bind(this);
DefaultState.args = {
	label: 'Switch',
	state: ESwitchButtonState.OFF,
	disabled: false,
};
