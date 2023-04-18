import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EComponentSize, KvDateTimeInput } from '../../components';

KvDateTimeInput.displayName = 'KvDateTimeInput';

export default {
	title: 'Inputs/Date Time Input',
	component: 'kv-date-time-input',
	argTypes: {
		size: {
			control: 'radio',
			options: Object.values(EComponentSize)
		},
		onTextChange: { action: 'text changed...' },
		onTextFieldBlur: { action: 'text field on blur' }
	},
	parameters: {
		notes: require('@ui-notes/date-time-input/readme.md')
	}
};

const TextFieldTemplate: ComponentStory<typeof KvDateTimeInput> = args => <KvDateTimeInput {...args} />;
export const Default = TextFieldTemplate.bind({});
Default.args = {
	label: 'Default Text Field',
	size: EComponentSize.Large
};

export const DateTimeInputMask = TextFieldTemplate.bind({});
DateTimeInputMask.args = {
	label: 'Date time input mask',
	useInputMask: true,
	size: EComponentSize.Large
};
