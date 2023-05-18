import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, EOtherIconName, EActionButtonType, EComponentSize, KvActionButtonText } from '../../components';

// Required to have the correct TagName in the code sample
KvActionButtonText.displayName = 'KvActionButtonText';

export default {
	title: 'Buttons/Text',
	component: 'kv-action-button-text',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		icon: {
			control: { type: 'select' },
			options: ['', ...Object.values(EIconName), ...Object.values(EOtherIconName)]
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
	icon: EIconName.Add,
	disabled: false
};

export const SecondaryState = ActionButtonTextTemplate.bind({});
SecondaryState.args = {
	type: EActionButtonType.Secondary,
	text: 'Secondary Button',
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const TertiaryState = ActionButtonTextTemplate.bind({});
TertiaryState.args = {
	type: EActionButtonType.Tertiary,
	text: 'Tertiary Button',
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const TertiaryLoadingState = ActionButtonTextTemplate.bind({});
TertiaryLoadingState.args = {
	type: EActionButtonType.Tertiary,
	text: 'Tertiary Button',
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false,
	loading: true
};

export const GhostState = ActionButtonTextTemplate.bind({});
GhostState.args = {
	type: EActionButtonType.Ghost,
	text: 'Ghost Button',
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const DangerState = ActionButtonTextTemplate.bind({});
DangerState.args = {
	type: EActionButtonType.Danger,
	text: 'Danger Button',
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};
