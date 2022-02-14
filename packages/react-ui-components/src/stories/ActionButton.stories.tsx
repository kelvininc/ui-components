import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, KvActionButton } from '../components';

export default {
	title: "Buttons",
	component: KvActionButton
} as ComponentMeta<typeof KvActionButton>;

const ButtonTemplate: ComponentStory<typeof KvActionButton> = (args) => <KvActionButton {...args} />;

export const Primary = ButtonTemplate.bind({});
Primary.args = {
	type: EActionButtonType.PrimaryButton,
	text: "Primary Button",
	enabled: true
};

export const Secondary = ButtonTemplate.bind({});
Secondary.args = {
	type: EActionButtonType.SecondaryButton,
	text: "Secondary Button",
	enabled: true
};

export const Tertiary = ButtonTemplate.bind({});
Tertiary.args = {
	type: EActionButtonType.TertiaryButton,
	text: "Tertiary Button",
	enabled: true
};

export const Danger = ButtonTemplate.bind({});
Danger.args = {
	type: EActionButtonType.PrimaryDangerButton,
	text: "Danger Button",
	enabled: true
};
