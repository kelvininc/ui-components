import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EActionButtonType, ETooltipPosition, KvActionButton, KvTooltip } from '../../components';

KvTooltip.displayName = 'KvTooltip';

export default {
	title: 'Feedback/Tooltip',
	component: 'kv-tooltip',
	argTypes: {
		text: { type: 'text' },
		position: {
			control: { type: 'select' },
			options: Object.values(ETooltipPosition)
		},
		disabled: { type: 'boolean' },
		onMouseEnter: { action: 'Mouse enter' },
		onMouseLeave: { action: 'Mouse Leave' },
		onFocus: { action: 'Focus' },
		onBlur: { action: 'Blur' }
	},
	parameters: {
		notes: require('@ui-notes/tooltip/readme.md'),
		layout: 'centered'
	}
};

const TooltipTemplate: ComponentStory<typeof KvTooltip> = args => (
	<KvTooltip {...args}>
		<KvActionButton type={EActionButtonType.Primary}>Hover me!</KvActionButton>
	</KvTooltip>
);

export const DefaultState = TooltipTemplate.bind(this);
DefaultState.args = {
	text: 'Tooltip text'
};

export const FixedPositionState = TooltipTemplate.bind(this);
FixedPositionState.args = {
	text: 'Tooltip text',
	position: ETooltipPosition.Left
};

export const DisabledState = TooltipTemplate.bind(this);
DisabledState.args = {
	text: 'Tooltip text',
	disabled: true
};
