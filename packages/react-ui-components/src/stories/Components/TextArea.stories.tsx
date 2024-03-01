import { ComponentStory } from '@storybook/react';
import React from 'react';
import { EIconName, EOtherIconName, KvTextArea } from '../../components';
import { action } from '@storybook/addon-actions';

KvTextArea.displayName = 'KvTextArea';

export default {
	title: 'Inputs / Text Area',
	component: 'kv-text-area',
	argTypes: {
		icon: {
			control: { type: 'select' },
			options: [...Object.values(EIconName), ...Object.values(EOtherIconName)]
		},
		text: { control: { type: 'text' } },
		placeholder: { control: { type: 'text' } },
		maxCharLength: { control: { type: 'number' } }
	},
	parameters: {
		notes: require('@ui-notes/text-area/readme.md')
	}
};

const TextAreaTemplate: ComponentStory<typeof KvTextArea> = args => <KvTextArea {...args} />;
export const Default = TextAreaTemplate.bind({});
Default.args = {
	maxCharLength: 200,
	onTextChange: ({ detail }: CustomEvent<string>) => action('onTextChange')(detail)
};

export const WithText = TextAreaTemplate.bind({});
WithText.args = {
	...Default.args,
	text: 'Pressure evaluation metric'
};

export const WithPlaceholder = TextAreaTemplate.bind({});
WithPlaceholder.args = {
	...Default.args,
	placeholder: 'Add a description'
};

export const WithTextAndPlaceholder = TextAreaTemplate.bind({});
WithTextAndPlaceholder.args = {
	...WithText.args,
	placeholder: 'Add a description'
};

export const WithIcon = TextAreaTemplate.bind({});
WithIcon.args = {
	...WithTextAndPlaceholder.args,
	text: '',
	icon: EIconName.Notes
};
