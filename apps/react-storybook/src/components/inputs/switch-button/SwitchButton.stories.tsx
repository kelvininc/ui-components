import type { Meta, StoryObj } from '@storybook/react';
import { EComponentSize, KvSwitchButton } from '@kelvininc/react-ui-components';

const meta = {
	title: 'Inputs/Switch Button',
	component: KvSwitchButton,
	argTypes: {
		size: {
			control: { type: 'radio' },
			options: Object.values(EComponentSize)
		}
	}
} satisfies Meta<typeof KvSwitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
	args: {
		checked: false,
		disabled: false,
		size: EComponentSize.Large
	}
};
