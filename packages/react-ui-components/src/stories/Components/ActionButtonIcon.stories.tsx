import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, KvActionButtonIcon, EComponentSize } from '../../components';
import { icons } from '../foundation/SvgIcons/SvgIcons-list';

// Required to have the correct TagName in the code sample
KvActionButtonIcon.displayName = 'KvActionButtonIcon';

export default {
	title: 'Buttons/Action Buttons/Icon',
	component: 'kv-action-button-icon',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		size: {
			control: { type: 'select' },
			options: Object.values(EComponentSize)
		},
		icon: {
			control: { type: 'select' },
			options: icons
		}
	},
	parameters: {
		notes: require('@ui-notes/action-button-icon/readme.md')
	}
};

const ActionButtonIconTemplate: ComponentStory<typeof KvActionButtonIcon> = args => <KvActionButtonIcon {...args} />;

export const PrimaryState = ActionButtonIconTemplate.bind({});
PrimaryState.args = {
	icon: 'kv-add',
	type: EActionButtonType.Primary,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};

export const SecondaryState = ActionButtonIconTemplate.bind({});
SecondaryState.args = {
	icon: 'kv-add',
	type: EActionButtonType.Secondary,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};

export const TertiaryState = ActionButtonIconTemplate.bind({});
TertiaryState.args = {
	icon: 'kv-add',
	type: EActionButtonType.Tertiary,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};

export const DangerState = ActionButtonIconTemplate.bind({});
DangerState.args = {
	icon: 'kv-add',
	type: EActionButtonType.Danger,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};
