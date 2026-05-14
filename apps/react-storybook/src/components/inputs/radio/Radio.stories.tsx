import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { EComponentSize, KvRadio } from "@kelvininc/react-ui-components/client";
import { useArgs } from "@storybook/preview-api";
import { ComponentProps } from "react";

const RadioInputTemplate: StoryFn<ComponentProps<typeof KvRadio>> = (args) => {
	const [{ checked }, updateArgs] = useArgs();
	const onCheckedChange = () => updateArgs({ checked: !(checked === true) });

	return <KvRadio {...args} onCheckedChange={onCheckedChange} />;
};

const meta = {
	title: "Inputs/Radio",
	component: KvRadio,
	render: RadioInputTemplate,
	argTypes: {
		size: {
			control: "radio",
			options: Object.values(EComponentSize)
		}
	}
} satisfies Meta<typeof KvRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		checked: false,
		size: EComponentSize.Large
	}
};

export const DefaultWithLabel: Story = {
	args: {
		...Default.args,
		label: "Yes",
		size: EComponentSize.Large
	}
};

export const Checked: Story = {
	args: {
		checked: true,
		size: EComponentSize.Large
	}
};

export const CheckedWithLabel: Story = {
	args: {
		...Checked.args,
		label: "Yes",
		size: EComponentSize.Large
	}
};

export const Disabled: Story = {
	args: {
		disabled: true,
		size: EComponentSize.Large
	}
};

export const DisabledWithLabel: Story = {
	args: {
		...Disabled.args,
		label: "Yes",
		size: EComponentSize.Large
	}
};
