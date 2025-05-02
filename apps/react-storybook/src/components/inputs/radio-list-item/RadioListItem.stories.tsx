import { KvRadioListItem } from '@kelvininc/react-ui-components';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
	title: 'Inputs/Radio List Item',
	component: KvRadioListItem,
	argTypes: {
		optionId: {
			control: {
				type: 'text'
			}
		},
		label: {
			control: {
				type: 'text'
			}
		},
		description: {
			control: {
				type: 'text'
			}
		},
		checked: {
			control: {
				type: 'boolean'
			}
		},
		disabled: {
			control: {
				type: 'boolean'
			}
		}
	}
} satisfies Meta<typeof KvRadioListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		optionId: 'k3s',
		label: 'K3S',
		description: 'To create an edge cluster, use the Kelvin installation script for K3S. For more information, see the [documentation](https://docs.kelvininc.com/4.10.2/) here.'
	}
};

export const Selected: Story = {
	args: {
		...Default.args,
		checked: true
	}
};

export const Disabled: Story = {
	args: {
		...Default.args,
		disabled: true
	}
};
