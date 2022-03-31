import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, EOtherIconName, EActionButtonType, KvActionButtonIcon, EComponentSize } from '../../components';

// Required to have the correct TagName in the code sample
KvActionButtonIcon.displayName = 'KvActionButtonIcon';

export default {
	title: 'Buttons/Icon',
	component: 'kv-action-button-icon',
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		},
		icon: {
			control: { type: 'select' },
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
		}
	},
	parameters: {
		notes: require('@ui-notes/action-button-icon/readme.md')
	}
};

const ActionButtonIconTemplate: ComponentStory<typeof KvActionButtonIcon> = args => <KvActionButtonIcon {...args} />;

export const PrimaryState = ActionButtonIconTemplate.bind({});
PrimaryState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Primary,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};

export const SecondaryState = ActionButtonIconTemplate.bind({});
SecondaryState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Secondary,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};

export const TertiaryState = ActionButtonIconTemplate.bind({});
TertiaryState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Tertiary,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};

export const DangerState = ActionButtonIconTemplate.bind({});
DangerState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Danger,
	size: EComponentSize.Small,
	disabled: false,
	active: false
};
