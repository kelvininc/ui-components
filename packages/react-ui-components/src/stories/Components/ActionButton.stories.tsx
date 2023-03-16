import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EComponentSize, EActionButtonType, KvActionButton } from '../../components';

// Required to have the correct TagName in the code sample
KvActionButton.displayName = 'KvActionButton';

export default {
	title: 'Buttons/Base',
	component: 'kv-action-button',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/action-button/readme.md')
	}
};

const ButtonTemplate: ComponentStory<typeof KvActionButton> = args => <KvActionButton {...args}>Action Button</KvActionButton>;

export const PrimaryState = ButtonTemplate.bind({});
PrimaryState.args = {
	type: EActionButtonType.Primary,
	size: EComponentSize.Large,
	disabled: false,
	active: false
};

export const SecondaryState = ButtonTemplate.bind({});
SecondaryState.args = {
	type: EActionButtonType.Secondary,
	size: EComponentSize.Large,
	disabled: false,
	active: false
};

export const TertiaryState = ButtonTemplate.bind({});
TertiaryState.args = {
	type: EActionButtonType.Tertiary,
	size: EComponentSize.Large,
	disabled: false,
	active: false
};

export const GhostState = ButtonTemplate.bind({});
GhostState.args = {
	type: EActionButtonType.Ghost,
	size: EComponentSize.Large,
	disabled: false,
	active: false
};

export const DangerState = ButtonTemplate.bind({});
DangerState.args = {
	type: EActionButtonType.Danger,
	size: EComponentSize.Large,
	disabled: false,
	active: false
};
