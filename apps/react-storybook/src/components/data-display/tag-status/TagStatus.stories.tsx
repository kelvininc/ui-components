import type { Meta, StoryObj } from '@storybook/react';

import { EIconName, ETagState, KvTagStatus } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Data Display/Tag Status',
	component: KvTagStatus,
	argTypes: {
		state: {
			control: { type: 'select' },
			options: Object.values(ETagState)
		},
		icon: {
			control: { type: 'select' },
			options: Object.values(EIconName)
		}
	}
} satisfies Meta<typeof KvTagStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
	args: {
		state: ETagState.Error,
		icon: EIconName.Error,
		label: 'Failed'
	}
}

export const Unknown: Story = {
	args: {
		state: ETagState.Unknown,
		icon: EIconName.Error,
		label: 'Unknown'
	}
}

export const Warning: Story = {
	args: {
		state: ETagState.Warning,
		icon: EIconName.Error,
		label: 'Partially Online'
	}
}

export const Success: Story = {
	args: {
		state: ETagState.Success,
		icon: EIconName.Success,
		label: 'Running'
	}
}

export const Info: Story = {
	args: {
		state: ETagState.Info,
		icon: EIconName.Error,
		label: 'Started'
	}
}

export const WithoutLabel: Story = {
	args: {
		state: ETagState.Info,
		icon: EIconName.Error,
		label: ''
	}
}
