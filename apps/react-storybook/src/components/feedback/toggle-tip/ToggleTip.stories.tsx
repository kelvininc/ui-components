import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { EActionButtonType, ETooltipPosition, KvToggleTip, EIconName, KvIcon, KvActionButtonText } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

import styles from './ToggleTip.module.scss';

const ToggleTipTemplate: StoryFn<ComponentProps<typeof KvToggleTip>> = args => (
	<KvToggleTip {...args}>
		<KvIcon slot="open-element-slot" name={EIconName.Info} />
		<KvActionButtonText slot="content-slot" type={EActionButtonType.Primary} text="Learn More"></KvActionButtonText>
	</KvToggleTip>
);

const meta = {
	title: 'Feedback/ToggleTip',
	component: KvToggleTip,
	render: ToggleTipTemplate,
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
	}
} satisfies Meta<typeof KvToggleTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		text: 'Toggle text with a lot of definition',
		isOpen: false,
		isFixed: false,
		withArrow: false,
		disabled: false
	}
};

export const FixedPositionState: Story = {
	args: {
		text: 'Toggle tip text',
		position: ETooltipPosition.Left,
		isFixed: false,
		withArrow: false,
		disabled: false
	}
};

export const AllowedPositionsState: Story = {
	args: {
		text: 'Toggle tip text',
		allowedPositions: [ETooltipPosition.Top, ETooltipPosition.Bottom],
		isFixed: false,
		withArrow: false,
		disabled: false
	}
};

export const DisabledToggleTipState: Story = {
	args: {
		text: 'Toggle tip text',
		position: ETooltipPosition.Left,
		isFixed: false,
		withArrow: false,
		disabled: true
	}
};

export const WithArrowState: Story = {
	args: {
		text: 'Toggle tip text',
		position: ETooltipPosition.Left,
		isFixed: false,
		withArrow: true,
		disabled: false
	}
};

export const WithCustomClass: Story = {
	args: {
		text: 'Toggle tip text',
		position: ETooltipPosition.Left,
		isFixed: false,
		withArrow: true,
		disabled: false,
		customClass: styles.TooltipCustomClass
	}
};
