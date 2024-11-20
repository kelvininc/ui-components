import type { Meta, StoryObj } from '@storybook/react';
import { KvLoader } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Feedback/Loader',
	component: KvLoader,
	argTypes: {
		isLoading: { type: 'boolean' },
		hasOverlay: { type: 'boolean' }
	}
} satisfies Meta<typeof KvLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IsLoading: Story = {
	args: {
		isLoading: true,
		hasOverlay: false
	}
};

export const HasOverlay: Story = {
	args: {
		isLoading: true,
		hasOverlay: true
	}
};
