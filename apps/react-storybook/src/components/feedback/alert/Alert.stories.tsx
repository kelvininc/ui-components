import type { Meta, StoryObj } from '@storybook/react';

import { EAlertType, EComponentSize, KvAlert } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Feedback/Alert',
	component: KvAlert,
	argTypes: {
		type: {
			control: {
				type: 'select'
			},
			options: Object.values(EAlertType)
		},
		size: {
			control: {
				type: 'radio'
			},
			options: Object.values(EComponentSize)
		},
		showIcon: {
			control: {
				type: 'boolean'
			}
		},
		label: {
			control: {
				type: 'text'
			}
		},
		description: {
			control: {
				type: 'text'
			}
		}
	}
} satisfies Meta<typeof KvAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		type: EAlertType.Info,
		size: EComponentSize.Large,
		label: 'Main Message',
		description: 'Secondary Message'
	}
};

export const NoIcon: Story = {
	args: {
		type: EAlertType.Info,
		showIcon: false,
		label: 'Main Message',
		description: 'Secondary Message'
	}
};

export const SmallSize: Story = {
	args: {
		type: EAlertType.Info,
		size: EComponentSize.Small,
		label: 'Main Message',
		description: 'Secondary Message'
	}
};
