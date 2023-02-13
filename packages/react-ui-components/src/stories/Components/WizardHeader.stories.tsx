import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvWizardHeader } from '../../components';

KvWizardHeader.displayName = 'KvWizardHeader';

export default {
	title: 'Data Display/Wizard Header',
	component: 'kv-wizard-header',
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
		notes: require('@ui-notes/wizard-header/readme.md')
	}
};

const WizardHeaderTemplate: ComponentStory<typeof KvWizardHeader> = args => <KvWizardHeader {...args} />;

export const Default = WizardHeaderTemplate.bind(this);
Default.args = {
	label: 'Step 1',
	description: 'Choose an application'
};
