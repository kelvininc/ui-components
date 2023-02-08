import { ComponentStory } from '@storybook/react';
import React, { useMemo } from 'react';
import { IStepBarStep, KvWizardFooter } from '../../components';
import { action } from '@storybook/addon-actions';

KvWizardFooter.displayName = 'KvWizardFooter';

export default {
	title: 'Navigation/Wizard Footer',
	component: 'kv-wizard-footer',
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
		},
		showStepBar: {
			control: {
				type: 'boolean'
			}
		},
		prevBtnLabel: {
			control: {
				type: 'text'
			}
		},
		nextBtnLabel: {
			control: {
				type: 'text'
			}
		},
		prevEnabled: {
			control: {
				type: 'boolean'
			}
		},
		nextEnabled: {
			control: {
				type: 'boolean'
			}
		}
	},
	parameters: {
		notes: require('@ui-notes/wizard-footer/readme.md')
	}
};

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

const WizardFooterTemplate: ComponentStory<typeof KvWizardFooter> = args => {
	const onPrevClick = useMemo(() => action('previous was clicked'), []);
	const onNextClick = useMemo(() => action('next was clicked'), []);
	const onStepClick = useMemo(() => action('step was clicked'), []);

	return <KvWizardFooter {...args} onPrevClick={onPrevClick} onNextClick={onNextClick} onStepClick={onStepClick} style={{ '--stepper-width': '160px' }} />;
};

export const Default = WizardFooterTemplate.bind(this);
Default.args = {
	steps: STEPS_MOCK_SUCCESS,
	currentStep: 1,
	progressPercentage: 50
};

export const WithPrevious = WizardFooterTemplate.bind(this);
WithPrevious.args = {
	steps: STEPS_MOCK_SUCCESS,
	currentStep: 1,
	progressPercentage: 50,
	prevBtnLabel: 'Previous'
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
		stepKey: 'step2',
		enabled: false
	}
];

export const WithError = WizardFooterTemplate.bind(this);
WithError.args = {
	steps: STEPS_MOCK_ERROR,
	currentStep: 1,
	progressPercentage: 50,
	hasError: true
};
