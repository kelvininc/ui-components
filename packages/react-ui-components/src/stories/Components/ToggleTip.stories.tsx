import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, KvActionButton, ETooltipPosition, KvToggleTip, EIconName, KvIcon } from '../../components';

KvToggleTip.displayName = 'KvToggleTip';

export default {
	title: 'Feedback/ToggleTip',
	component: 'kv-toggle-tip',
	argTypes: {
		text: { type: 'text' },
		position: {
			control: { type: 'select' },
			options: Object.values(ETooltipPosition)
		},
		isOpen: {
			control: { type: 'boolean' }
		},
		withArrow: {
			control: { type: 'boolean' }
		},
		isFixed: {
			control: { type: 'boolean' }
		},
		allowedPositions: { control: { type: 'multi-select' }, options: Object.values(ETooltipPosition) },
		onOpenStateChange: {
			action: 'openStateChange'
		}
	},
	parameters: {
		notes: require('@ui-notes/toggle-tip/readme.md'),
		layout: 'centered'
	}
};

const ToggleTipTemplate: ComponentStory<typeof KvToggleTip> = args => (
	<KvToggleTip {...args}>
		<KvIcon slot="open-element-slot" name={EIconName.Info} />
		<KvActionButton slot="content-slot" type={EActionButtonType.Primary}>
			Learn More
		</KvActionButton>
	</KvToggleTip>
);

export const DefaultState = ToggleTipTemplate.bind(this);
DefaultState.args = {
	text: 'Toggle text with a lot of definition',
	isOpen: false,
	isFixed: false,
	withArrow: false,
	disabled: false
};

export const FixedPositionState = ToggleTipTemplate.bind(this);
FixedPositionState.args = {
	text: 'Toggle tip text',
	position: ETooltipPosition.Left,
	isFixed: false,
	withArrow: false,
	disabled: false
};

export const AllowedPositionsState = ToggleTipTemplate.bind(this);
AllowedPositionsState.args = {
	text: 'Toggle tip text',
	allowedPositions: [ETooltipPosition.Top, ETooltipPosition.Bottom],
	isFixed: false,
	withArrow: false,
	disabled: false
};

export const DisabledToggleTipState = ToggleTipTemplate.bind(this);
DisabledToggleTipState.args = {
	text: 'Toggle tip text',
	position: ETooltipPosition.Left,
	isFixed: false,
	withArrow: false,
	disabled: true
};

export const WithArrowState = ToggleTipTemplate.bind(this);
WithArrowState.args = {
	text: 'Toggle tip text',
	position: ETooltipPosition.Left,
	isFixed: false,
	withArrow: true,
	disabled: false
};
