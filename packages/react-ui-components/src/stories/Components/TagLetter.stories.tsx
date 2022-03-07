import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTagLetter } from '../../components';

KvTagLetter.displayName = 'KvTagLetter';

export default {
	title: 'Components/TagLetter',
	component: 'kv-tag-letter',
	argTypes: {
		color: { control: { type: 'color' } },
		label: { control: { type: 'text' } },
		tagLetter: { control: { type: 'text' } }
	},
	parameters: {
		notes: require('@ui-notes/tag-letter/readme.md')
	}
};

const TagLetterTemplate: ComponentStory<typeof KvTagLetter> = args => <KvTagLetter {...args} />;

export const Default = TagLetterTemplate.bind(this);
Default.args = {
	label: 'Tag Letter Default'
};

export const ColorSelected = TagLetterTemplate.bind(this);
ColorSelected.args = {
	label: 'Tag Letter Color Selected',
	color: 'red'
};

export const TagLetter = TagLetterTemplate.bind(this);
TagLetter.args = {
	label: 'version 0.1',
	tagLetter: 'V',
	color: '#005cc7'
};
