

import { EComponentSize, KvDateTimeInput } from '@kelvininc/react-ui-components';
import { Meta, StoryObj } from '@storybook/react';

const meta = {
	title: 'Inputs/Date Time Input',
	component: KvDateTimeInput,
	argTypes: {
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		},
		onTextChange: { action: 'text changed...' },
		onDateTimeBlur: { action: 'date time on blur' }
	}
} satisfies Meta<typeof KvDateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Default Text input',
		size: EComponentSize.Large
	}
};

export const DateTimeInputMask: Story = {
	args: {
		label: 'Date time input mask',
		useInputMask: true,
		size: EComponentSize.Large
	}
};

export const DateTimeWithoutMask: Story = {
	args: {
		label: 'Date time input mask',
		useInputMask: false,
		placeholder: 'Drop date & time here',
		size: EComponentSize.Large,
		forcedFocus: true
	}
};
