import type { Meta, StoryObj } from '@storybook/react';

import { KvCalendarDay } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Time Picker/Components/Calendar Day',
	component: KvCalendarDay,
	argTypes: {
		onClickDay: {
			action: 'clickDay'
		},
		onMouseEnterDay: {
			action: 'mouseEnterDay'
		},
		onMouseLeaveDay: {
			action: 'mouseLeaveDay'
		}
	}
} satisfies Meta<typeof KvCalendarDay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		day: 12
	}
};

export const DisabledState: Story = {
	args: {
		day: 12,
		disabled: true
	}
};

export const ActiveState: Story = {
	args: {
		day: 12,
		active: true
	}
};

export const InRangeState: Story = {
	args: {
		day: 12,
		inRange: true
	}
};
