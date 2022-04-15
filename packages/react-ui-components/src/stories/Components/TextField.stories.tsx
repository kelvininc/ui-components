import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EComponentSize, EIconName, EInputFieldType, EValidationState, KvTextField } from '../../components';

KvTextField.displayName = 'KvTextField';

export default {
	title: 'Inputs/Text Field',
	component: 'kv-text-field',
	argTypes: {
		disabled: { control: { type: 'boolean' } },
		required: { control: { type: 'boolean' } },
		loading: { control: { type: 'boolean' } },
		helpText: { control: { type: 'array' } },
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
		textChange: { action: 'text changed...' },
		textFieldBlur: { action: 'text field on blur' }
	},
	parameters: {
		notes: require('@ui-notes/text-field/readme.md')
	}
};

const TextFieldTemplate: ComponentStory<typeof KvTextField> = args => <KvTextField {...args} />;

export const Default = TextFieldTemplate.bind({});
Default.args = {
	label: 'Default Text Field',
	disabled: false,
	required: false,
	loading: false,
	placeholder: 'text here',
	state: EValidationState.None,
	size: EComponentSize.Large,
	type: EInputFieldType.Text
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
	disabled: true,
	state: EValidationState.None,
	size: EComponentSize.Large,
	type: EInputFieldType.Text
};

export const Required = TextFieldTemplate.bind({});
Required.args = {
	...Default.args,
	label: 'Required Text Field',
	required: true,
	state: EValidationState.None,
	size: EComponentSize.Large,
	type: EInputFieldType.Text
};

export const MaxLength = TextFieldTemplate.bind({});
MaxLength.args = {
	...Default.args,
	label: 'Required Text Field',
	required: true,
	max: 10
};

export const Loading = TextFieldTemplate.bind({});
Loading.args = {
	...Default.args,
	label: 'Loading Text Field',
	loading: true,
	state: EValidationState.None,
	size: EComponentSize.Large,
	type: EInputFieldType.Text
};

export const HelpText = TextFieldTemplate.bind({});
HelpText.args = {
	...Default.args,
	label: 'Help Text Field',
	helpText: 'Help text',
	state: EValidationState.None,
	size: EComponentSize.Large,
	type: EInputFieldType.Text
};

export const Invalid = TextFieldTemplate.bind({});
Invalid.args = {
	...Default.args,
	label: 'Invalid Text Field',
	helpText: ['First help or instruction text goes here.', 'Second help or instruction text goes here.'],
	state: EValidationState.Invalid,
	size: EComponentSize.Large,
	type: EInputFieldType.Text,
	icon: EIconName.Layer
};

export const Slim = TextFieldTemplate.bind({});
Slim.args = {
	...Default.args,
	label: 'Slim Text Field',
	size: EComponentSize.Small,
	state: EValidationState.None,
	type: EInputFieldType.Text
};

export const SlimIcon = TextFieldTemplate.bind({});
SlimIcon.args = {
	...Default.args,
	label: 'Slim Text Field',
	size: EComponentSize.Small,
	state: EValidationState.None,
	type: EInputFieldType.Text,
	icon: EIconName.Layer
};
