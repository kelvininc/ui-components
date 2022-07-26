import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvFormLabel } from '../../components';

// Required to have the correct TagName in the code sample
KvFormLabel.displayName = 'KvFormLabel';

export default {
	title: 'Form/FormLabel',
	component: 'kv-form-label',
	argTypes: {},
	parameters: {
		notes: require('@ui-notes/form-label/readme.md')
	}
};

const FormLabelTemplate: ComponentStory<typeof KvFormLabel> = args => <KvFormLabel {...args} />;

export const Default = FormLabelTemplate.bind(this);
Default.args = {
	label: 'Form Label'
};

export const Required = FormLabelTemplate.bind(this);
Required.args = {
	...Default.args,
	required: true
};
