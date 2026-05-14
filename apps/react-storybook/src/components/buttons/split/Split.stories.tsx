import type { Meta, StoryObj } from "@storybook/react";
import {
	EIconName,
	EActionButtonType,
	EComponentSize,
	KvActionButtonSplit
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Buttons/Split",
	component: KvActionButtonSplit,
	argTypes: {
		type: {
			control: { type: "select" },
			options: [EActionButtonType.Primary, EActionButtonType.Secondary]
		},
		splitIcon: {
			control: { type: "select" },
			options: Object.values(EIconName)
		},
		icon: {
			control: { type: "select" },
			options: ["", ...Object.values(EIconName)]
		},
		size: {
			control: { type: "radio" },
			options: Object.values(EComponentSize)
		}
	}
} satisfies Meta<typeof KvActionButtonSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryState: Story = {
	args: {
		type: EActionButtonType.Primary,
		text: "Primary Button",
		splitIcon: EIconName.ArrowDropDown,
		size: EComponentSize.Large,
		disabled: false
	}
};

export const SecondaryState: Story = {
	args: {
		type: EActionButtonType.Secondary,
		text: "Secondary Button",
		splitIcon: EIconName.ArrowDropDown,
		size: EComponentSize.Large,
		disabled: false
	}
};
