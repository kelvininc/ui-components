import { ComponentStory } from '@storybook/react';
import React from 'react';
import styles from './style.module.scss';

import { EActionButtonType, ETooltipPosition, KvActionButton, KvActionButtonText, KvTooltip } from '../../../components';

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
		customClass: {
			control: { type: 'text' }
		},
		disabled: { type: 'boolean' },
		onMouseEnter: { action: 'Mouse enter' },
		onMouseLeave: { action: 'Mouse Leave' },
		truncate: { type: 'boolean' }
	},
	parameters: {
		notes: require('@ui-notes/tooltip/readme.md'),
		layout: 'centered'
	}
};

const TooltipTemplate: ComponentStory<typeof KvTooltip> = args => (
	<KvTooltip {...args}>
		<KvActionButtonText text="Hover me!" type={EActionButtonType.Primary} />
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

export const WithArrowState = TooltipTemplate.bind(this);
WithArrowState.args = {
	text: 'Tooltip text',
	withArrow: true
};

export const CustomClassState = TooltipTemplate.bind(this);
CustomClassState.args = {
	text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia tellus nisi, ut pulvinar dui scelerisque ut. Nullam elementum diam id auctor feugiat.\n\nFusce nec malesuada nisl, vitae lacinia ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras at arcu at odio dictum convallis non eget justo. Nulla ut urna bibendum, laoreet nisi in, scelerisque lorem. Vivamus non varius sem. Praesent suscipit blandit purus in tristique.',
	customClass: styles.TooltipCustomClass
};

export const AllowedPositionsState = TooltipTemplate.bind(this);
AllowedPositionsState.args = {
	text: 'Tooltip text',
	allowedPositions: [ETooltipPosition.Top, ETooltipPosition.Right]
};
