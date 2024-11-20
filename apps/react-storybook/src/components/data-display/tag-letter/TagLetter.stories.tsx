import type { Meta, StoryObj } from '@storybook/react';
import { KvTagLetter } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Data Display/Tag Letter',
	component: KvTagLetter,
	argTypes: {
		color: { control: { type: 'color' } },
		label: { control: { type: 'text' } },
		tagLetter: { control: { type: 'text' } }
	}
} satisfies Meta<typeof KvTagLetter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Tag Letter Default'
	}
};

export const ColorSelected: Story = {
	args: {
		label: 'Tag Letter Color Selected',
		color: 'red'
	}
};

export const TagLetter: Story = {
	args: {
		label: 'version 0.1',
		tagLetter: 'V',
		color: '#005cc7'
	}
};
