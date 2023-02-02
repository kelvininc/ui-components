import { ComponentStory } from '@storybook/react';
import React, { useMemo } from 'react';
import { IStepBarStep, KvStepBar } from '../../components';
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

const STEPS_MOCK_SUCCESS: IStepBarStep[] = [
	{
		stepKey: 'step0',
		enabled: true,
		active: true
	},
	{
		stepKey: 'step1',
		enabled: true,
		active: true
	},
	{
		stepKey: 'step2',
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

const STEPS_MOCK_ERROR: IStepBarStep[] = [
	{
		stepKey: 'step0',
		enabled: true,
		active: true,
		hasError: true
	},
	{
		stepKey: 'step1',
		enabled: true,
		active: true,
		hasError: true
	},
	{
		stepKey: 'step1',
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
