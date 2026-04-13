import type { Meta, StoryObj } from "@storybook/react";

import {
	EActionButtonType,
	EAlertType,
	EComponentSize,
	KvActionButtonText,
	KvAlert
} from "@kelvininc/react-ui-components/client";

const meta = {
	title: "Feedback/Alert",
	component: KvAlert,
	argTypes: {
		type: {
			control: {
				type: "select"
			},
			options: Object.values(EAlertType)
		},
		size: {
			control: {
				type: "radio"
			},
			options: Object.values(EComponentSize)
		},
		showIcon: {
			control: {
				type: "boolean"
			}
		},
		label: {
			control: {
				type: "text"
			}
		},
		description: {
			control: {
				type: "text"
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
		label: "Main Message",
		description: "Secondary Message"
	}
};

export const NoIcon: Story = {
	args: {
		type: EAlertType.Info,
		showIcon: false,
		label: "Main Message",
		description: "Secondary Message"
	}
};

export const SmallSize: Story = {
	args: {
		type: EAlertType.Info,
		size: EComponentSize.Small,
		label: "Main Message",
		description: "Secondary Message"
	}
};

export const SlotsUsage: Story = {
	render: (args) => (
		<KvAlert {...args}>
			<div slot="description">
				<strong>Custom Description:</strong> This is a custom
				description using slots.
			</div>
			<div slot="actions">
				<KvActionButtonText
					type={EActionButtonType.Secondary}
					text="Action"
				/>
			</div>
			<div slot="alert-content" style={{ color: "#2a2a2a" }}>
				<p>
					This is additional content inside the alert using the
					alert-content slot.
				</p>
			</div>
		</KvAlert>
	),
	args: {
		type: EAlertType.Warning,
		label: "Main Message"
	}
};
