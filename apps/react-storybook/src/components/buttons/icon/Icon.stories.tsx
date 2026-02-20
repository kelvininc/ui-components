import type { Meta, StoryObj } from "@storybook/react";

import {
	EActionButtonType,
	EComponentSize,
	EIconName,
	KvActionButtonIcon
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Buttons/Icon",
	component: KvActionButtonIcon,
	argTypes: {
		type: {
			control: { type: "select" },
			options: [
				EActionButtonType.Primary,
				EActionButtonType.Secondary,
				EActionButtonType.Tertiary,
				EActionButtonType.Danger
			]
		},
		size: {
			control: { type: "radio" },
			options: Object.values(EComponentSize)
		},
		icon: {
			control: { type: "select" },
			options: Object.values(EIconName)
		}
	}
} satisfies Meta<typeof KvActionButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Primary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const SecondaryState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Secondary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const TertiaryState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Tertiary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const TertiaryLoadingState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Tertiary,
		size: EComponentSize.Small,
		disabled: false,
		active: false,
		loading: true
	}
};

export const DangerState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Danger,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};

export const DisabledState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Primary,
		size: EComponentSize.Small,
		disabled: true,
		active: false
	}
};

export const AnchorState: Story = {
	args: {
		icon: EIconName.Add,
		type: EActionButtonType.Primary,
		size: EComponentSize.Small,
		disabled: false,
		active: false
	}
};