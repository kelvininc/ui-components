import type { Meta, StoryObj } from '@storybook/react';

import { KvSummaryCard, ESummaryCardType } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Data Display/Summary Card',
	component: KvSummaryCard,
	argTypes: {
		type: {
			control: 'select',
			options: Object.values(ESummaryCardType)
		}
	}
} satisfies Meta<typeof KvSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
	args: {
		type: ESummaryCardType.Text,
		loading: true
	}
};

export const NoLabel: Story = {
	args: {
		type: ESummaryCardType.Text
	}
};

export const Loaded: Story = {
	args: {
		type: ESummaryCardType.Number,
		label: '23',
		subtitle: 'PSI',
		description: 'Casing Pressure Avg.'
	}
};
