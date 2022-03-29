import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvToaster, ToasterTypesEnum } from '../../components';

KvToaster.displayName = 'KvToaster';

export default {
	title: 'Data Display/Toaster',
	component: 'kv-toaster',
	parameters: {
		notes: require('@ui-notes/toaster/readme.md')
	}
};

const ToasterTemplate: ComponentStory<typeof KvToaster> = args => <KvToaster {...args} />;

export const Default = ToasterTemplate.bind(this);
Default.args = {
	messageText: 'Main Message',
	descriptionText: 'Secondary Message',
	type: ToasterTypesEnum.success
};
