import { ComponentStory } from '@storybook/react';
import React, { useMemo } from 'react';
import { IStepIndicator, KvStepBar } from '../../components';
import { action } from '@storybook/addon-actions';

export default {
	title: 'Data Display/Step Bar',
	component: 'kv-step-bar',
	argTypes: {
		label: {
			control: {
				type: 'text'
			}
		},
		steps: {
			control: {
				type: 'object'
			}
		},
		currentStep: {
			control: {
				type: 'number'
			}
		},
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
		notes: require('@ui-notes/step-bar/readme.md')
	}
};

KvStepBar.displayName = 'KvStepBar';

const STEPS_MOCK_SUCCESS: IStepIndicator[] = [
	{
		enabled: true,
		active: true
	},
	{
		enabled: true,
		active: true
	},
	{
		enabled: false
	}
];

const StepBarTemplate: ComponentStory<typeof KvStepBar> = args => {
	const onStepClick = useMemo(() => action('step clicked'), []);
	return <KvStepBar {...args} onStepClicked={onStepClick} />;
};

export const Default = StepBarTemplate.bind(this);
Default.args = {
	steps: STEPS_MOCK_SUCCESS,
	currentStep: 1,
	progressPercentage: 50
};

const STEPS_MOCK_ERROR: IStepIndicator[] = [
	{
		enabled: true,
		active: true,
		hasError: true
	},
	{
		enabled: true,
		active: true,
		hasError: true
	},
	{
		enabled: false
	}
];

export const ErrorState = StepBarTemplate.bind(this);
ErrorState.args = {
	steps: STEPS_MOCK_ERROR,
	currentStep: 1,
	progressPercentage: 50,
	hasError: true
};
