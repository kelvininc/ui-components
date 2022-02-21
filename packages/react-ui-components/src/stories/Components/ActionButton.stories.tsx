import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, KvActionButton } from '../../components';

// Required to have the correct TagName in the code sample
KvActionButton.displayName = 'KvActionButton';

export default {
	title: 'Components/Buttons/Action',
	component: 'kv-action-button',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		}
	},
	parameters: {
		notes: require('../../../../ui-components/src/components/action-button/readme.md')
	}
};

const ButtonTemplate: ComponentStory<typeof KvActionButton> = (args) => <KvActionButton {...args} />;

export const Primary = ButtonTemplate.bind({});
Primary.args = {
	type: EActionButtonType.PrimaryButton,
	text: 'Primary Button',
	enabled: true
};

export const Secondary = ButtonTemplate.bind({});
Secondary.args = {
	type: EActionButtonType.SecondaryButton,
	text: 'Secondary Button',
	enabled: true
};

export const Tertiary = ButtonTemplate.bind({});
Tertiary.args = {
	type: EActionButtonType.TertiaryButton,
	text: 'Tertiary Button',
	enabled: true
};

export const Danger = ButtonTemplate.bind({});
Danger.args = {
	type: EActionButtonType.PrimaryDangerButton,
	text: 'Danger Button',
	enabled: true
};
