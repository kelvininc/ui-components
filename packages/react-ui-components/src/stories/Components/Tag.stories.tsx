import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTag } from '../../components';

KvTag.displayName = 'KvTag';

export default {
	title: 'Data Display/Tag',
	component: 'kv-tag',
	argTypes: {
		label: { control: { type: 'text' } }
	},
	parameters: {
		notes: require('@ui-notes/tag/readme.md')
	}
};

const TagTemplate: ComponentStory<typeof KvTag> = args => <KvTag {...args} />;
const SlotTagTemplate: ComponentStory<typeof KvTag> = args => (
	<KvTag {...args}>
		<div slot="left-slot">Test Slot Label</div>
	</KvTag>
);

export const Default = TagTemplate.bind(this);
Default.args = {
	label: 'Default Label'
};

export const Slot = SlotTagTemplate.bind(this);
