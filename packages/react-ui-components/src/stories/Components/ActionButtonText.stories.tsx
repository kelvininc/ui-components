import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, EComponentSize, KvActionButtonText } from '../../components';
import { icons } from '../foundation/SvgIcons/SvgIcons-list';

// Required to have the correct TagName in the code sample
KvActionButtonText.displayName = 'KvActionButtonText';

export default {
	title: 'Buttons/Action Buttons/Text',
	component: 'kv-action-button-text',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		icon: {
			control: { type: 'select' },
			options: ['', ...icons]
		},
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	},
	parameters: {
		notes: require('@ui-notes/action-button-text/readme.md')
	}
};

const ActionButtonTextTemplate: ComponentStory<typeof KvActionButtonText> = args => <KvActionButtonText {...args} />;

export const PrimaryState = ActionButtonTextTemplate.bind({});
PrimaryState.args = {
	type: EActionButtonType.Primary,
	text: 'Primary Button',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};

export const SecondaryState = ActionButtonTextTemplate.bind({});
SecondaryState.args = {
	type: EActionButtonType.Secondary,
	text: 'Secondary Button',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};

export const TertiaryState = ActionButtonTextTemplate.bind({});
TertiaryState.args = {
	type: EActionButtonType.Tertiary,
	text: 'Tertiary Button',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};

export const DangerState = ActionButtonTextTemplate.bind({});
DangerState.args = {
	type: EActionButtonType.Danger,
	text: 'Danger Button',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};
