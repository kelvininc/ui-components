import React from 'react';
import { ComponentStory } from '@storybook/react';
import { KvInfoLabel, KvTagLetter } from '../../components';

KvInfoLabel.displayName = 'KvInfoLabel';

export default {
	title: 'Data Display/Info Label',
	component: 'kv-info-label',
	argTypes: {
		labelTitle: { control: { type: 'text' } },
		description: { control: { type: 'text' } },
		descriptionHeight: { control: { type: 'number' } },
		descriptionCollapsedText: { control: { type: 'text' } },
		descriptionOpenedText: { control: { type: 'text' } },
		copyValue: { control: { type: 'text' } }
	},
	parameters: {
		notes: require('@ui-notes/info-label/readme.md')
	}
};

const InfoLabelTemplate: ComponentStory<typeof KvInfoLabel> = args => <KvInfoLabel {...args} />;

export const Default = InfoLabelTemplate.bind({});
Default.args = {
	labelTitle: 'TYPE',
	description: 'Data Model'
};

export const ReadMoreLess = InfoLabelTemplate.bind({});
ReadMoreLess.args = {
	labelTitle: 'DESCRIPTION',
	description:
		"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
	descriptionHeight: 34,
	descriptionCollapsedText: 'Read more',
	descriptionOpenedText: 'Read less'
};

export const CopyValues = InfoLabelTemplate.bind({});
CopyValues.args = {
	labelTitle: 'TYPE',
	description: 'data-model',
	copyValue: 'data-model'
};

const InfoLabelTemplateWithComponent: ComponentStory<typeof KvInfoLabel> = args => (
	<KvInfoLabel {...args}>
		<KvTagLetter tagLetter="C" label="Change The Rapper" />
	</KvInfoLabel>
);
export const WithComponent = InfoLabelTemplateWithComponent.bind({});
WithComponent.args = {
	labelTitle: 'DESCRIPTION'
};
