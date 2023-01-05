import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvIllustration, EIllustrationName } from '../../components';
export default {
	title: 'Media/Illustration',
	component: 'kv-illustration',
	argTypes: {
		name: {
			control: { type: 'select' },
			options: Object.values(EIllustrationName)
		},
		customClass: {
			control: { type: 'text' }
		}
	},
	parameters: {
		notes: require('@ui-notes/illustration/readme.md')
	}
};

KvIllustration.displayName = 'KvIllustration';

const KvIllustrationTemplate: ComponentStory<typeof KvIllustration> = args => <KvIllustration {...args} />;

export const IllustrationOnly = KvIllustrationTemplate.bind(this);
IllustrationOnly.args = {
	name: EIllustrationName.EsSectionSomethingwentwrong
};

export const CustomClass = KvIllustrationTemplate.bind(this);
CustomClass.args = {
	name: EIllustrationName.EsSectionSomethingwentwrong,
	customClass: 'illustration-full-size'
};
