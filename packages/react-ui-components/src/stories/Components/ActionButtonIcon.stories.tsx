import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, EOtherIconName, EActionButtonType, KvActionButtonIcon, EComponentSize, EAnchorTarget, EBadgeState } from '../../components';

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
		},
		badgeState: {
			control: { type: 'select' },
			options: Object.values(EBadgeState)
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

export const GhostState = ActionButtonIconTemplate.bind({});
GhostState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Ghost,
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

export const DisabledState = ActionButtonIconTemplate.bind({});
DisabledState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Primary,
	size: EComponentSize.Small,
	disabled: true,
	active: false
};

export const AnchorState = ActionButtonIconTemplate.bind({});
AnchorState.args = {
	icon: EIconName.Add,
	type: EActionButtonType.Primary,
	size: EComponentSize.Small,
	disabled: false,
	active: false,
	href: 'https://kelvin.ai/',
	target: EAnchorTarget.NewTab
};

export const BadgeState = ActionButtonIconTemplate.bind({});
BadgeState.args = {
	icon: EIconName.Dashboard,
	type: EActionButtonType.Secondary,
	size: EComponentSize.Small,
	disabled: false,
	active: false,
	badgeLabel: '12',
	badgeState: EBadgeState.None
};
