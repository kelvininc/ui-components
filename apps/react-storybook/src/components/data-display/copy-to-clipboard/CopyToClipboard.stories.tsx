import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { KvCopyToClipboard } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const CopyToClipboardTemplate: StoryFn<ComponentProps<typeof KvCopyToClipboard> & { textContent: string }> = args => (
	<div style={{ color: 'white', fontFamily: 'proxima-nova' }}>
		<KvCopyToClipboard {...args}>{QUOTE}</KvCopyToClipboard>
	</div>
);

const meta = {
	title: 'Data Display/Copy To Clipboard',
	component: KvCopyToClipboard,
	render: CopyToClipboardTemplate,
} satisfies Meta<typeof KvCopyToClipboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const QUOTE = 'Inspiration does exist, but it must find you working.';

export const Default: Story = {
	args: {
		copiableText: QUOTE
	}
}

export const WithTooltipSuffix: Story = {
	args: {
		...Default.args,
		tooltipSuffix: 'Quote'
	}
};
