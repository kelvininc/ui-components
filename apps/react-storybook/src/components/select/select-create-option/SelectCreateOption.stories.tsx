import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";
import { ComponentProps } from "react";
import {
	EComponentSize,
	EValidationState,
	KvSelectCreateOption,
	KvSelectCreateOptionCustomEvent
} from "@kelvininc/react-ui-components/client";

type SelectCreateOptionArgs = ComponentProps<typeof KvSelectCreateOption>;

// The component doesn't keep what is typed: `value` follows `valueChanged`, as
// it does in a dropdown's create form
const SelectCreateOptionTemplate: StoryFn<SelectCreateOptionArgs> = ({
	onValueChanged,
	...args
}) => {
	const [, updateArgs] = useArgs<SelectCreateOptionArgs>();

	const onValueChange = (event: KvSelectCreateOptionCustomEvent<string>) => {
		updateArgs({ value: event.detail });
		onValueChanged?.(event);
	};

	return <KvSelectCreateOption {...args} onValueChanged={onValueChange} />;
};

const meta = {
	title: "Select/Select Create Option",
	component: KvSelectCreateOption,
	render: SelectCreateOptionTemplate,
	argTypes: {
		value: {
			control: { type: "text" }
		},
		disabled: {
			control: { type: "boolean" }
		},
		loading: {
			control: { type: "boolean" }
		},
		size: {
			control: { type: "radio" },
			options: Object.values(EComponentSize)
		},
		onValueChanged: {
			action: "valueChanged"
		},
		onClickCreate: {
			action: "clickCreate"
		},
		onClickCancel: {
			action: "clickCancel"
		}
	}
} satisfies Meta<typeof KvSelectCreateOption>;

export default meta;
type Story = StoryObj<typeof meta>;

const INPUT_CONFIG = { placeholder: "Option name" };

export const Default: Story = {
	args: {
		value: "Maintenance",
		size: EComponentSize.Small,
		disabled: false,
		loading: false,
		inputConfig: INPUT_CONFIG
	}
};

export const Loading: Story = {
	args: {
		...Default.args,
		loading: true
	}
};

export const Disabled: Story = {
	args: {
		...Default.args,
		disabled: true
	}
};

export const WithError: Story = {
	args: {
		...Default.args,
		inputConfig: {
			...INPUT_CONFIG,
			state: EValidationState.Invalid,
			helpText: "Already exists"
		}
	}
};
