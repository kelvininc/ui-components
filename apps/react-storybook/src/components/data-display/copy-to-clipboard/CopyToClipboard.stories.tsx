import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import { KvCopyToClipboard } from "@kelvininc/react-ui-components/client";
import { ComponentProps } from "react";

const CopyToClipboardTemplate: StoryFn<
	ComponentProps<typeof KvCopyToClipboard>
> = (args) => <KvCopyToClipboard {...args}>{QUOTE}</KvCopyToClipboard>;

const meta = {
	title: "Data Display/Copy To Clipboard",
	component: KvCopyToClipboard,
	render: CopyToClipboardTemplate
} satisfies Meta<typeof KvCopyToClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const QUOTE = "Inspiration does exist, but it must find you working.";

export const Default: Story = {
	args: {
		copiableText: QUOTE
	}
};

export const WithTooltipSuffix: Story = {
	args: {
		...Default.args,
		tooltipSuffix: "Quote"
	}
};
