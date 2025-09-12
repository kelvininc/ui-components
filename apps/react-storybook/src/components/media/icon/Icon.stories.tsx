import type { Meta, StoryObj } from "@storybook/react";
import { EIconName, KvIcon } from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Media/Icon",
	component: KvIcon,
	argTypes: {
		name: {
			control: { type: "select" },
			options: Object.values(EIconName)
		},
		customClass: {
			control: { type: "text" }
		},
		customColor: {
			control: { type: "color" }
		}
	}
} satisfies Meta<typeof KvIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconOnly: Story = {
	args: {
		name: EIconName.LogoKelvin
	}
};

export const CustomClass: Story = {
	args: {
		name: EIconName.LogoKelvin,
		customClass: "icon-full-size rotate-90"
	}
};

export const CustomColor: Story = {
	args: {
		name: EIconName.LogoKelvin,
		customColor: "#05a357"
	}
};
