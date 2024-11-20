import type { Meta, StoryObj } from '@storybook/react';

import { KvTabItem, EComponentSize } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Navigation/Tabs/Tab Item',
	component: KvTabItem,
	argTypes: {
		tabKey: {
			control: 'text'
		},
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		}
	}
} satisfies Meta<typeof KvTabItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		tabKey: 'tab1',
		label: 'Tab Item'
	}
};

export const Disabled: Story = {
	args: {
		...Default.args,
		disabled: true
	}
};

export const Selected: Story = {
	args: {
		...Default.args,
		selected: true
	}
};

export const WithNotification: Story = {
	args: {
		...Default.args,
		hasNotification: true
	}
};

export const SelectedWithNotification: Story = {
	args: {
		...WithNotification.args,
		selected: true
	}
};
