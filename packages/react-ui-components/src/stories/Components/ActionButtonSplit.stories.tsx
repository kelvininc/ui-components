import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, EOtherIconName, EActionButtonType, EComponentSize, KvActionButtonSplit } from '../../components';

// Required to have the correct TagName in the code sample
KvActionButtonSplit.displayName = 'KvActionButtonSplit';

export default {
	title: 'Buttons/Split',
	component: 'kv-action-button-split',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		splitIcon: {
			control: { type: 'select' },
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
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
		notes: require('@ui-notes/action-button-split/readme.md')
	}
};

const ActionButtonSplitTemplate: ComponentStory<typeof KvActionButtonSplit> = args => <KvActionButtonSplit {...args} />;

export const PrimaryState = ActionButtonSplitTemplate.bind({});
PrimaryState.args = {
	type: EActionButtonType.Primary,
	text: 'Primary Button',
	splitIcon: EIconName.ArrowDropDown,
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const SecondaryState = ActionButtonSplitTemplate.bind({});
SecondaryState.args = {
	type: EActionButtonType.Secondary,
	text: 'Secondary Button',
	splitIcon: EIconName.ArrowDropDown,
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const TertiaryState = ActionButtonSplitTemplate.bind({});
TertiaryState.args = {
	type: EActionButtonType.Tertiary,
	text: 'Tertiary Button',
	splitIcon: EIconName.ArrowDropDown,
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const TertiaryLoadingState = ActionButtonSplitTemplate.bind({});
TertiaryLoadingState.args = {
	type: EActionButtonType.Tertiary,
	text: 'Tertiary Button',
	splitIcon: EIconName.ArrowDropDown,
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false,
	loading: true
};

export const GhostState = ActionButtonSplitTemplate.bind({});
GhostState.args = {
	type: EActionButtonType.Ghost,
	text: 'Ghost Button',
	splitIcon: EIconName.ArrowDropDown,
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};

export const DangerState = ActionButtonSplitTemplate.bind({});
DangerState.args = {
	type: EActionButtonType.Danger,
	text: 'Danger Button',
	splitIcon: EIconName.ArrowDropDown,
	size: EComponentSize.Large,
	icon: EIconName.Add,
	disabled: false
};
