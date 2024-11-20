import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { KvBadge, EBadgeState } from '@kelvininc/react-ui-components';

const BadgeTemplate: StoryFn<ComponentProps<typeof KvBadge>> = args => <KvBadge {...args}>12</KvBadge>;

const meta = {
	title: 'Data Display/Badge',
	component: KvBadge,
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EBadgeState)
		}
	},
	render: BadgeTemplate
} satisfies Meta<typeof KvBadge>;

export default meta;
type Story = StoryObj<typeof meta>;


export const DefaultState: Story = {
	args: {}
}

export const InfoState: Story = {
	args: {
		state: EBadgeState.Info
	}
}

export const WarningState: Story = {
	args: {
		state: EBadgeState.Warning
	}
}

export const ErrorState = {
	args: {
		state: EBadgeState.Error
	}
}

export const SuccessState = {
	args: {
		state: EBadgeState.Success
	}
}
