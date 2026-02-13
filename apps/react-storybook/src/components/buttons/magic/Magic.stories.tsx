import type { Meta, StoryObj } from "@storybook/react";
import {
	EIconName,
	EActionButtonType,
	EComponentSize,
	KvActionButtonMagic
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Buttons/Magic",
	component: KvActionButtonMagic,
	argTypes: {
		type: {
			control: { type: "select" },
			options: [EActionButtonType.Primary, EActionButtonType.Secondary]
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
} satisfies Meta<typeof KvActionButtonMagic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		type: EActionButtonType.Primary,
		text: "Button",
		size: EComponentSize.Large,
		icon: EIconName.AI,
		disabled: false
	}
};

export const Secondary: Story = {
	args: {
		type: EActionButtonType.Secondary,
		text: "Button",
		size: EComponentSize.Large,
		icon: EIconName.AI,
		disabled: false
	}
};
