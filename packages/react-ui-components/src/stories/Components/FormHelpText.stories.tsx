import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EValidationState, KvFormHelpText } from '../../components';

// Required to have the correct TagName in the code sample
KvFormHelpText.displayName = 'KvFormHelpText';

export default {
	title: 'Form/FormHelpText',
	component: 'kv-form-help-text',
	argTypes: {
		helpText: { control: { type: 'array' } },
		state: {
			control: { type: 'radio' },
			options: Object.values(EValidationState)
		}
	},
	parameters: {
		notes: require('@ui-notes/form-help-text/readme.md')
	}
};

const FormHelpTextTemplate: ComponentStory<typeof KvFormHelpText> = args => <KvFormHelpText {...args} />;

export const Default = FormHelpTextTemplate.bind(this);
Default.args = {
	helpText: 'Help text'
};

export const DefaultWithErrorState = FormHelpTextTemplate.bind(this);
DefaultWithErrorState.args = {
	...Default.args,
	state: EValidationState.Invalid
};

export const ArrayOfStrings = FormHelpTextTemplate.bind(this);
ArrayOfStrings.args = {
	helpText: ['Help text 1', 'Help Text 2']
};
