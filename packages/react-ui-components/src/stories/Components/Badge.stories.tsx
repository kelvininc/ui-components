import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvBadge } from '../../components';

// Required to have the correct TagName in the code sample
KvBadge.displayName = 'KvBadge';

export default {
	title: 'Data Display/Badge',
	component: 'kv-badge',
	parameters: {
		notes: require('@ui-notes/badge/readme.md')
	}
};

const ButtonTemplate: ComponentStory<typeof KvBadge> = () => <KvBadge>12</KvBadge>;

export const DefaultState = ButtonTemplate.bind({});
