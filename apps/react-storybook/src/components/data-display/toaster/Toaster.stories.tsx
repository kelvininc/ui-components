import type { Meta, StoryObj, StoryFn } from "@storybook/react";

import {
	EActionButtonType,
	EIconName,
	EToasterType,
	KvActionButtonText,
	KvToaster
} from "@kelvininc/react-ui-components/client";
import { ComponentProps } from "react";

const meta = {
	title: "Data Display/Toaster",
	component: KvToaster,
	argTypes: {
		type: {
			control: "select",
			options: Object.values(EToasterType)
		},
		onClickCloseButton: {
			action: "clickCloseButton"
		},
		onTtlExpired: {
			action: "ttlExpired"
		}
	},
	parameters: {
		themeSideBySide: false
	}
} satisfies Meta<typeof KvToaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
	args: {
		header: "Main Message",
		description: "Secondary Message",
		ttl: 0,
		type: EToasterType.Success
	}
};

export const Warning: Story = {
	args: {
		header: "Main Message",
		description: "Secondary Message",
		ttl: 0,
		type: EToasterType.Warning
	}
};

export const Error: Story = {
	args: {
		header: "Main Message",
		description: "Secondary Message",
		ttl: 0,
		type: EToasterType.Error
	}
};

export const Info: Story = {
	args: {
		header: "Main Message",
		description: "Secondary Message",
		ttl: 0,
		type: EToasterType.Info
	}
};

const ToasterWithSlotTemplate: StoryFn<ComponentProps<typeof KvToaster>> = (
	args
) => (
	<KvToaster {...args}>
		<KvActionButtonText
			type={EActionButtonType.Secondary}
			text={"Clean"}
			icon={EIconName.Clear}
		/>
	</KvToaster>
);
export const WithSlot: Story = {
	render: ToasterWithSlotTemplate,
	args: {
		header: "Displaying results of simulation",
		description: "Click to end simulation",
		type: EToasterType.Warning,
		closable: false
	}
};
