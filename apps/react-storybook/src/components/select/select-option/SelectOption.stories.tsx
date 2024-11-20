import type { Meta, StoryObj } from '@storybook/react';
import { KvSelectOption } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Select/Select Item',
	component: KvSelectOption,
	argTypes: {
		label: {
			control: { type: 'text' }
		},
		description: {
			control: { type: 'text' }
		},
		value: {
			control: { type: 'text' }
		},
		selected: {
			control: { type: 'boolean' }
		},
		disabled: {
			control: { type: 'boolean' }
		},
		togglable: {
			control: { type: 'boolean' }
		},
		selectable: {
			control: { type: 'boolean' }
		}
	}
} satisfies Meta<typeof KvSelectOption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Label 1',
		value: 'label-1',
		description: '',
		selected: true,
		togglable: true,
		disabled: false
	}
};
