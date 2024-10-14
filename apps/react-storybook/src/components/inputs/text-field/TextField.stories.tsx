import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { EComponentSize, EIconName, EInputFieldType, EValidationState, KvTextField } from '@kelvininc/react-ui-components';
import { ComponentProps } from 'react';

const meta = {
	title: 'Inputs/Text Field',
	component: KvTextField,
	argTypes: {
		inputDisabled: { control: { type: 'boolean' } },
		inputRequired: { control: { type: 'boolean' } },
		loading: { control: { type: 'boolean' } },
		helpText: { control: { type: 'text' } },
		value: { control: { type: 'text' } },
		min: { control: { type: 'number' } },
		max: { control: { type: 'number' } },
		state: {
			control: { type: 'radio' },
			options: Object.values(EValidationState)
		},
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		},
		type: {
			control: 'select',
			options: Object.values(EInputFieldType)
		},
		onTextChange: { action: 'text changed...' },
		onTextFieldBlur: { action: 'text field on blur' }
	}
} satisfies Meta<typeof KvTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: 'Default Text Field',
		inputDisabled: false,
		inputRequired: false,
		loading: false,
		placeholder: 'text here',
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};

export const WithTextInputMask: Story = {
	args: {
		label: 'Text Field with text input mask',
		inputDisabled: false,
		inputRequired: false,
		loading: false,
		value: 'Possible Text Here',
		inputMaskRegex: '[a-zA-Z s]+',
		placeholder: '',
		state: EValidationState.None,
		size: EComponentSize.Large,
		useInputMask: true,
		type: EInputFieldType.Text
	}
};

export const WithNumericInputMask: Story = {
	args: {
		label: 'Text Field with numeric input mask',
		inputDisabled: false,
		inputRequired: false,
		loading: false,
		value: 0,
		min: -100,
		max: 100,
		placeholder: '',
		state: EValidationState.None,
		size: EComponentSize.Large,
		useInputMask: true,
		type: EInputFieldType.Number
	}
};

export const DefaultIcon: Story = {
	args: {
		...Default.args,
		icon: EIconName.Layer
	}
};

export const Disabled: Story = {
	args: {
		...Default.args,
		label: 'Disabled Text Field',
		value: 'text value',
		inputDisabled: true,
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};

export const Required: Story = {
	args: {
		...Default.args,
		label: 'Required Text Field',
		inputRequired: true,
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};

export const MaxMinLength: Story = {
	args: {
		...Default.args,
		label: 'Required Text Field',
		inputRequired: true,
		minLength: 5,
		maxLength: 10
	}
};

export const MaxMinValue: Story = {
	args: {
		...Default.args,
		type: EInputFieldType.Number,
		label: 'Required Text Field',
		inputRequired: true,
		min: 0,
		max: 10
	}
};

export const Step: Story = {
	args: {
		...Default.args,
		type: EInputFieldType.Number,
		label: 'Required Text Field',
		inputRequired: true,
		step: 0.1
	}
};

export const Loading: Story = {
	args: {
		...Default.args,
		label: 'Loading Text Field',
		loading: true,
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};

export const HelpText: Story = {
	args: {
		...Default.args,
		label: 'Help Text Field',
		helpText: 'Help text',
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};

export const Invalid: Story = {
	args: {
		...Default.args,
		label: 'Invalid Text Field',
		helpText: ['First help or instruction text goes here.', 'Second help or instruction text goes here.'],
		state: EValidationState.Invalid,
		size: EComponentSize.Large,
		icon: EIconName.Layer
	}
};

export const Slim: Story = {
	args: {
		...Default.args,
		label: 'Slim Text Field',
		size: EComponentSize.Small,
		state: EValidationState.None
	}
};

export const SlimIcon: Story = {
	args: {
		...Default.args,
		label: 'Slim Text Field',
		size: EComponentSize.Small,
		state: EValidationState.None,
		icon: EIconName.Layer
	}
};


const TextFieldLeftSlotTemplate: StoryFn<ComponentProps<typeof KvTextField>> = args => (
	<KvTextField {...args} style={{ '--left-slot-width': '24px' }}>
		<span slot="left-slot">$</span>
	</KvTextField>
);
export const WithLeftSlot: Story = {
	render: TextFieldLeftSlotTemplate,
	args: {
		label: 'Left Slot Text Field',
		inputDisabled: false,
		inputRequired: false,
		loading: false,
		placeholder: 'text here',
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};

export const DateTimeInputMask: Story = {
	args: {
		label: 'Date time input mask',
		inputDisabled: false,
		inputRequired: false,
		loading: false,
		useInputMask: true,
		type: EInputFieldType.DateTime,
		state: EValidationState.None,
		size: EComponentSize.Large
	}
};
