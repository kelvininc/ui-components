import type { Meta, StoryObj } from '@storybook/react';

import { KvStateIndicator } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Data Display/State Indicator',
	component: KvStateIndicator,
	argTypes: {
		color: { type: 'color' },
		text: { type: 'text' }
	}
} satisfies Meta<typeof KvStateIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		text: 'State Indicator'
	}
};

export const ColorState: Story = {
	args: {
		color: 'green',
		text: 'State Indicator'
	}
};
