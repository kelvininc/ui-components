import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvLoader } from '../../components';

KvLoader.displayName = 'KvLoader';

export default {
	title: 'Feedback/Loader',
	component: 'kv-loader',
	argTypes: {
		isLoading: { type: 'boolean' },
		hasOverlay: { type: 'boolean' }
	},
	parameters: {
		notes: require('@ui-notes/loader/readme.md')
	}
};

const LoaderTemplate: ComponentStory<typeof KvLoader> = args => <KvLoader {...args} />;

export const IsLoading = LoaderTemplate.bind(this);
IsLoading.args = {
	isLoading: true,
	hasOverlay: false
};

export const HasOverlay = LoaderTemplate.bind(this);
HasOverlay.args = {
	isLoading: true,
	hasOverlay: true
};
