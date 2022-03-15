import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, EComponentSize, KvActionButtonSplit } from '../../components';
import { icons } from '../foundation/SvgIcons/SvgIcons-list';

// Required to have the correct TagName in the code sample
KvActionButtonSplit.displayName = 'KvActionButtonSplit';

export default {
	title: 'Buttons/Action Buttons/Split',
	component: 'kv-action-button-split',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		splitIcon: {
			control: { type: 'select' },
			options: icons
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
		notes: require('@ui-notes/action-button-split/readme.md')
	}
};

const ActionButtonSplitTemplate: ComponentStory<typeof KvActionButtonSplit> = args => <KvActionButtonSplit {...args} />;

export const PrimaryState = ActionButtonSplitTemplate.bind({});
PrimaryState.args = {
	type: EActionButtonType.Primary,
	text: 'Primary Button',
	splitIcon: 'kv-arrow-drop-down',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};

export const SecondaryState = ActionButtonSplitTemplate.bind({});
SecondaryState.args = {
	type: EActionButtonType.Secondary,
	text: 'Secondary Button',
	splitIcon: 'kv-arrow-drop-down',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};

export const TertiaryState = ActionButtonSplitTemplate.bind({});
TertiaryState.args = {
	type: EActionButtonType.Tertiary,
	text: 'Tertiary Button',
	splitIcon: 'kv-arrow-drop-down',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};

export const DangerState = ActionButtonSplitTemplate.bind({});
DangerState.args = {
	type: EActionButtonType.Danger,
	text: 'Danger Button',
	splitIcon: 'kv-arrow-drop-down',
	size: EComponentSize.Large,
	icon: 'kv-add',
	disabled: false
};
