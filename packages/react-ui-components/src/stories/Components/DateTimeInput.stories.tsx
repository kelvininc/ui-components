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
		onDateTimeBlur: { action: 'date time on blur' }
	},
	parameters: {
		notes: require('@ui-notes/date-time-input/readme.md')
	}
};

const DateTimeInputTemplate: ComponentStory<typeof KvDateTimeInput> = args => <KvDateTimeInput {...args} />;
export const Default = DateTimeInputTemplate.bind({});
Default.args = {
	label: 'Default Text input',
	size: EComponentSize.Large
};

export const DateTimeInputMask = DateTimeInputTemplate.bind({});
DateTimeInputMask.args = {
	label: 'Date time input mask',
	useInputMask: true,
	size: EComponentSize.Large
};
