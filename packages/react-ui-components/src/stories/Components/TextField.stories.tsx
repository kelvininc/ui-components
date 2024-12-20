import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EComponentSize, EIconName, EInputFieldType, EValidationState, KvTextField } from '../../components';

KvTextField.displayName = 'KvTextField';

export default {
	title: 'Inputs/Text Field',
	component: 'kv-text-field',
	argTypes: {
		inputDisabled: { control: { type: 'boolean' } },
		inputRequired: { control: { type: 'boolean' } },
		loading: { control: { type: 'boolean' } },
		helpText: { control: { type: 'array' } },
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
	},
	parameters: {
		notes: require('@ui-notes/text-field/readme.md')
	}
};

const TextFieldTemplate: ComponentStory<typeof KvTextField> = args => <KvTextField {...args} />;
const TextFieldLeftSlotTemplate: ComponentStory<typeof KvTextField> = args => (
	<KvTextField {...args} style={{ '--left-slot-width': '24px' }}>
		<span slot="left-slot">$</span>
	</KvTextField>
);

export const Default = TextFieldTemplate.bind({});
Default.args = {
	label: 'Default Text Field',
	inputDisabled: false,
	inputRequired: false,
	loading: false,
	placeholder: 'text here',
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const WithTextInputMask = TextFieldTemplate.bind({});
WithTextInputMask.args = {
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
};

export const WithNumericInputMask = TextFieldTemplate.bind({});
WithNumericInputMask.args = {
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
};

export const DefaultIcon = TextFieldTemplate.bind({});
DefaultIcon.args = {
	...Default.args,
	icon: EIconName.Layer
};

export const Disabled = TextFieldTemplate.bind({});
Disabled.args = {
	...Default.args,
	label: 'Disabled Text Field',
	value: 'text value',
	inputDisabled: true,
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const Required = TextFieldTemplate.bind({});
Required.args = {
	...Default.args,
	label: 'Required Text Field',
	inputRequired: true,
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const MaxMinLength = TextFieldTemplate.bind({});
MaxMinLength.args = {
	...Default.args,
	label: 'Required Text Field',
	inputRequired: true,
	minLength: 5,
	maxLength: 10
};

export const MaxMinValue = TextFieldTemplate.bind({});
MaxMinValue.args = {
	...Default.args,
	type: EInputFieldType.Number,
	label: 'Required Text Field',
	inputRequired: true,
	min: 0,
	max: 10
};

export const Step = TextFieldTemplate.bind({});
Step.args = {
	...Default.args,
	type: EInputFieldType.Number,
	label: 'Required Text Field',
	inputRequired: true,
	step: 0.1
};

export const Loading = TextFieldTemplate.bind({});
Loading.args = {
	...Default.args,
	label: 'Loading Text Field',
	loading: true,
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const HelpText = TextFieldTemplate.bind({});
HelpText.args = {
	...Default.args,
	label: 'Help Text Field',
	helpText: 'Help text',
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const Invalid = TextFieldTemplate.bind({});
Invalid.args = {
	...Default.args,
	label: 'Invalid Text Field',
	helpText: ['First help or instruction text goes here.', 'Second help or instruction text goes here.'],
	state: EValidationState.Invalid,
	size: EComponentSize.Large,
	icon: EIconName.Layer
};

export const Slim = TextFieldTemplate.bind({});
Slim.args = {
	...Default.args,
	label: 'Slim Text Field',
	size: EComponentSize.Small,
	state: EValidationState.None
};

export const SlimIcon = TextFieldTemplate.bind({});
SlimIcon.args = {
	...Default.args,
	label: 'Slim Text Field',
	size: EComponentSize.Small,
	state: EValidationState.None,
	icon: EIconName.Layer
};

export const WithLeftSlot = TextFieldLeftSlotTemplate.bind({});
WithLeftSlot.args = {
	label: 'Left Slot Text Field',
	inputDisabled: false,
	inputRequired: false,
	loading: false,
	placeholder: 'text here',
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const DateTimeInputMask = TextFieldTemplate.bind({});
DateTimeInputMask.args = {
	label: 'Date time input mask',
	inputDisabled: false,
	inputRequired: false,
	loading: false,
	useInputMask: true,
	type: EInputFieldType.DateTime,
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const DirtyDot = TextFieldTemplate.bind({});
DirtyDot.args = {
	label: 'Default Text Field',
	inputDisabled: false,
	inputRequired: false,
	loading: false,
	placeholder: 'text here',
	state: EValidationState.None,
	size: EComponentSize.Large,
	isDirty: true
};
