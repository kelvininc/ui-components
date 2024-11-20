import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { KvTag } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const meta = {
	title: 'Data Display/Tag',
	component: KvTag,
	argTypes: {
		label: { control: { type: 'text' } }
	}
} satisfies Meta<typeof KvTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Default Label'
	}
};

const SlotTagTemplate: StoryFn<ComponentProps<typeof KvTag>> = args => (
	<KvTag {...args}>
		<div slot="left-slot">Test Slot Label</div>
	</KvTag>
);

export const Slot: Story = {
	render: SlotTagTemplate
}
