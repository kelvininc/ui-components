import type { Meta, StoryObj } from '@storybook/react';
import { EComponentSize, KvRadio } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Inputs/Radio',
	component: KvRadio,
	argTypes: {
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		}
	}
} satisfies Meta<typeof KvRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		checked: false
	}
}

export const DefaultWithLabel: Story = {
	args: {
		...Default.args,
		label: 'Yes'
	}
}

export const Checked: Story = {
	args: {
		checked: true
	}
}

export const CheckedWithLabel: Story = {
	args: {
		...Checked.args,
		label: 'Yes'
	}
}

export const Disabled: Story = {
	args: {
		disabled: true
	}
}

export const DisabledWithLabel: Story = {
	args: {
		...Disabled.args,
		label: 'Yes'
	}
}
