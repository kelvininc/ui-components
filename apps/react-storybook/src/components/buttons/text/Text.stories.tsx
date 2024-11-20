import type { Meta, StoryObj } from '@storybook/react';
import { EIconName, EOtherIconName, EActionButtonType, EComponentSize, KvActionButtonText } from "@kelvininc/react-ui-components";

const meta = {
	title: 'Buttons/Text',
	component: KvActionButtonText,
	argTypes: {
		type: {
			control: { type: 'select' },
			options: Object.values(EActionButtonType)
		},
		icon: {
			control: { type: 'select' },
			options: ['', ...Object.values(EIconName), ...Object.values(EOtherIconName)]
		},
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	},
} satisfies Meta<typeof KvActionButtonText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
	args: {
		type: EActionButtonType.Primary,
		text: 'Primary Button',
		size: EComponentSize.Large,
		icon: EIconName.Add,
		disabled: false
	}
};

export const SecondaryState: Story = {
	args: {
		type: EActionButtonType.Secondary,
		text: 'Secondary Button',
		size: EComponentSize.Large,
		icon: EIconName.Add,
		disabled: false
	}
};

export const TertiaryState: Story = {
	args: {
		type: EActionButtonType.Tertiary,
		text: 'Tertiary Button',
		size: EComponentSize.Large,
		icon: EIconName.Add,
		disabled: false
	}
};

export const TertiaryLoadingState: Story = {
	args: {
		type: EActionButtonType.Tertiary,
		text: 'Tertiary Button',
		size: EComponentSize.Large,
		icon: EIconName.Add,
		disabled: false,
		loading: true
	}
};

export const GhostState: Story = {
	args: {
		type: EActionButtonType.Ghost,
		text: 'Ghost Button',
		size: EComponentSize.Large,
		icon: EIconName.Add,
		disabled: false
	}
};

export const DangerState: Story = {
	args: {
		type: EActionButtonType.Danger,
		text: 'Danger Button',
		size: EComponentSize.Large,
		icon: EIconName.Add,
		disabled: false
	}
};
