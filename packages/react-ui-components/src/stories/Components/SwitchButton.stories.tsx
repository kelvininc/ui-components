import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EComponentSize, KvSwitchButton } from '../../components';

// Required to have the correct TagName in the code sample
KvSwitchButton.displayName = 'KvSwitchButton';

export default {
	title: 'Buttons/Switch Button',
	component: 'kv-switch-button',
	argTypes: {
		size: {
			control: { type: 'select' },
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/switch-button/readme.md')
	}
};

const SwitchButtonTemplate: ComponentStory<typeof KvSwitchButton> = args => <KvSwitchButton {...args} />;

export const DefaultState = SwitchButtonTemplate.bind(this);
DefaultState.args = {
	label: 'Switch',
	checked: false,
	disabled: false,
	size: EComponentSize.Large
};
