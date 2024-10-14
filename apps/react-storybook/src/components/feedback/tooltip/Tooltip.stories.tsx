import type { Meta, StoryObj } from '@storybook/react';
import { EActionButtonType, ETooltipPosition, KvActionButton, KvActionButtonText, KvTooltip } from '@kelvininc/react-ui-components';

import styles from './Tooltip.module.scss';

const meta = {
	title: 'Feedback/Tooltip',
	component: KvTooltip,
	render: (...args) => (
		<KvTooltip {...args}>
			<KvActionButtonText text="Hover me!" type={EActionButtonType.Primary} />
		</KvTooltip>
	),
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
	}
} satisfies Meta<typeof KvTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		text: 'Tooltip text'
	}
};

export const FixedPositionState: Story = {
	args: {
		text: 'Tooltip text',
		position: ETooltipPosition.Left
	}
};

export const DisabledState: Story = {
	args: {
		text: 'Tooltip text',
		disabled: true
	}
};

export const TruncateState: Story = {
	render: (...args) => (
		<KvTooltip {...args}>
			<KvActionButton type={EActionButtonType.Primary}>
				<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 50 }}>Hover me!</div>
			</KvActionButton>
		</KvTooltip>
	),
	args: {
		text: 'Tooltip text',
		truncate: true
	}
};

export const WithArrowState: Story = {
	args: {
		text: 'Tooltip text',
		withArrow: true
	}
};

export const CustomClassState: Story = {
	args: {
		text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia tellus nisi, ut pulvinar dui scelerisque ut. Nullam elementum diam id auctor feugiat.\n\nFusce nec malesuada nisl, vitae lacinia ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Cras at arcu at odio dictum convallis non eget justo. Nulla ut urna bibendum, laoreet nisi in, scelerisque lorem. Vivamus non varius sem. Praesent suscipit blandit purus in tristique.',
		customClass: styles.TooltipCustomClass
	}
};

export const AllowedPositionsState: Story = {
	args: {
		text: 'Tooltip text',
		allowedPositions: [ETooltipPosition.Top, ETooltipPosition.Right]
	}
};
