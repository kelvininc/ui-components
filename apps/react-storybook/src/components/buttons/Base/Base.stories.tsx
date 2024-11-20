import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { EActionButtonType, EComponentSize, KvActionButton } from "@kelvininc/react-ui-components"
import { ComponentProps } from 'react';

const ButtonTemplate: StoryFn<ComponentProps<typeof KvActionButton>> = args => <KvActionButton {...args}>Action Button</KvActionButton>;

const meta = {
	title: 'Buttons/Base',
	component: KvActionButton,
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	},
	render: ButtonTemplate
} satisfies Meta<typeof KvActionButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
	args: {
		type: EActionButtonType.Primary,
		size: EComponentSize.Large,
		disabled: false,
		active: false,
	},
};

export const SecondaryState: Story = {
	args: {
		type: EActionButtonType.Secondary,
		size: EComponentSize.Large,
		disabled: false,
		active: false,
		children: 'Action Button'
	},
};

export const TertiaryState: Story = {
	args: {
		type: EActionButtonType.Tertiary,
		size: EComponentSize.Large,
		disabled: false,
		active: false,
		children: 'Action Button'
	},
};

export const TertiaryLoadingState: Story = {
	args: {
		type: EActionButtonType.Tertiary,
		size: EComponentSize.Large,
		disabled: false,
		active: false,
		loading: true,
		children: 'Action Button'
	},
};
export const GhostState: Story = {
	args: {
		type: EActionButtonType.Ghost,
		size: EComponentSize.Large,
		disabled: false,
		active: false,
		children: 'Action Button'
	}
};

export const DangerState: Story = {
	args: {
		type: EActionButtonType.Danger,
		size: EComponentSize.Large,
		disabled: false,
		active: false,
		children: 'Action Button'
	}
};
