import { ComponentStory } from '@storybook/react';
import React from 'react';
import { KvStepIndicator, KvStepProgressBar } from '../../components';

export default {
	title: 'Data Display/Step Progress Bar',
	component: 'kv-step-progress-bar',
	argTypes: {
		progressPercentage: {
			control: {
				type: 'number'
			}
		},
		hasError: {
			control: {
				type: 'boolean'
			}
		}
	},
	parameters: {
		notes: require('@ui-notes/step-progress-bar/readme.md')
	}
};

KvStepProgressBar.displayName = 'KvStepProgressBar';

const StepProgressBarTemplate: ComponentStory<typeof KvStepProgressBar> = args => {
	return (
		<KvStepProgressBar {...args}>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator active></KvStepIndicator>
			<KvStepIndicator></KvStepIndicator>
		</KvStepProgressBar>
	);
};

export const Default = StepProgressBarTemplate.bind(this);
Default.args = {
	progressPercentage: 67
};

const StepProgressBarErrorTemplate: ComponentStory<typeof KvStepProgressBar> = args => {
	return (
		<KvStepProgressBar {...args}>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator active hasError></KvStepIndicator>
			<KvStepIndicator></KvStepIndicator>
		</KvStepProgressBar>
	);
};

export const ErrorState = StepProgressBarErrorTemplate.bind(this);
ErrorState.args = {
	progressPercentage: 67,
	hasError: true
};
