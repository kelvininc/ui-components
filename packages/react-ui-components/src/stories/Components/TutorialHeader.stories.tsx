import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvTutorialHeader } from '../../components';

KvTutorialHeader.displayName = 'KvTutorialHeader';

export default {
	title: 'Data Display/Tutorial Header',
	component: 'kv-tutorial-header',
	argTypes: {
		label: {
			control: {
				type: 'text'
			}
		},
		description: {
			control: {
				type: 'text'
			}
		}
	},
	parameters: {
		notes: require('@ui-notes/tutorial-header/readme.md')
	}
};

const TutorialHeaderTemplate: ComponentStory<typeof KvTutorialHeader> = args => <KvTutorialHeader {...args} />;

export const Default = TutorialHeaderTemplate.bind(this);
Default.args = {
	label: 'Step 1',
	description: 'Choose an application'
};

export const WithCustomSeparator = TutorialHeaderTemplate.bind(this);
WithCustomSeparator.args = {
	...Default.args,
	separator: '/'
};
