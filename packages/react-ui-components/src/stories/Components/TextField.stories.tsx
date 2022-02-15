import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTextField } from '../../components';

KvTextField.displayName = 'KvTextField';

export default {
	title: 'Components/Text Fields',
	component: 'kv-text-field',
	argTypes: {
		disabled: { type: 'boolean' },
		required: { type: 'boolean' },
		loading: { type: 'boolean' },
		helpText: { type: 'text' }
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
	helpText: '',
	placeholder: 'text here'
};

export const Disabled = TextFieldTemplate.bind({});
Disabled.args = {
	...Default.args,
	label: 'Disabled Text Field',
	disabled: true
};

export const Required = TextFieldTemplate.bind({});
Required.args = {
	...Default.args,
	label: 'Required Text Field',
	required: true
};

export const Loading = TextFieldTemplate.bind({});
Loading.args = {
	...Default.args,
	label: 'Loading Text Field',
	loading: true
};

export const HelpText = TextFieldTemplate.bind({});
HelpText.args = {
	...Default.args,
	label: 'Help Text Field',
	helpText: 'Help text'
};

export const Slim = TextFieldTemplate.bind({});
Slim.args = {
	...Default.args,
	label: 'Slim Text Field',
	slim: true
};
