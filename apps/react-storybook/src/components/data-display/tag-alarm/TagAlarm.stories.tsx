import type { Meta, StoryObj } from '@storybook/react';

import { EAlarmSeverity, ETagAlarmSize, KvTagAlarm } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Data Display/Tag Alarm',
	component: KvTagAlarm,
	argTypes: {
		severity: {
			control: { type: 'select' },
			options: Object.values(EAlarmSeverity)
		},
		size: {
			control: { type: 'select' },
			options: Object.values(ETagAlarmSize)
		}
	}
} satisfies Meta<typeof KvTagAlarm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		severity: EAlarmSeverity.One,
		size: ETagAlarmSize.XSmall,
		hideLabel: false
	}
};

export const CustomText: Story = {
	args: {
		severity: EAlarmSeverity.One,
		size: ETagAlarmSize.XSmall,
		hideLabel: false,
		label: '+99'
	}
};

export const HiddenLabel: Story = {
	args: {
		severity: EAlarmSeverity.One,
		size: ETagAlarmSize.XSmall,
		hideLabel: true
	}
};
