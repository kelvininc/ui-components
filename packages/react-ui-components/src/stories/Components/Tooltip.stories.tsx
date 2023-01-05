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
		onBlur: { action: 'Blur' },
		truncate: { type: 'boolean' }
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

const TooltipTruncateTemplate: ComponentStory<typeof KvTooltip> = args => (
	<KvTooltip {...args}>
		<KvActionButton type={EActionButtonType.Primary}>
			<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 50 }}>Hover me!</div>
		</KvActionButton>
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

export const TruncateState = TooltipTruncateTemplate.bind(this);
TruncateState.args = {
	text: 'Tooltip text',
	truncate: true
};
