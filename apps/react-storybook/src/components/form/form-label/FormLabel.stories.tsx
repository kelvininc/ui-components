import type { Meta, StoryObj } from '@storybook/react';
import { KvFormLabel } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Form/FormLabel',
	component: KvFormLabel,
	argTypes: {}
} satisfies Meta<typeof KvFormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Form Label'
	}
};

export const Required: Story = {
	args: {
		...Default.args,
		required: true
	}
};
