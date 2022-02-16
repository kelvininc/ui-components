import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { KvSwitchButton, ESwitchButtonState } from '../../components';

export default {
	title: "Components/Buttons/Switch",
	component: KvSwitchButton,
	argTypes: {
		state: {
			control: { type: "select" },
			options: Object.values(ESwitchButtonState)
		},
  },
} as ComponentMeta<typeof KvSwitchButton>

const SwitchButtonTemplate: ComponentStory<typeof KvSwitchButton> = (args) => <KvSwitchButton {...args} />;

export const DefaultState = SwitchButtonTemplate.bind(this);
DefaultState.args = {
	label: "Switch",
	state: ESwitchButtonState.OFF,
	disabled: false,
};
