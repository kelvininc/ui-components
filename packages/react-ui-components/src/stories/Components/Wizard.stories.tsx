import { EStepState } from '@kelvininc/ui-components';
import { action } from '@storybook/addon-actions';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { KvWizard } from '../../components';

// Required to have the correct TagName in the code sample
KvWizard.displayName = 'KvWizard';

export default {
	title: 'Navigation/Wizard',
	component: 'kv-wizard',
	argTypes: {
		onGoToStep: {
			action: 'goToStep'
		},
		onCompleteClick: {
			action: 'completeClick'
		},
		onCancelClick: {
			action: 'cancelClick'
		},
		currentStepState: {
			control: 'select',
			options: ['', ...Object.values(EStepState)]
		}
	},
	parameters: {
		notes: require('@ui-notes/wizard/readme.md')
	}
};

const WizardTemplate: ComponentStory<typeof KvWizard> = args => {
	const [currentStep, setCurrentStep] = useState(args.currentStep);

	const handleGoToStep = (event: CustomEvent<number>) => {
		setCurrentStep(event.detail);
		action('goToStep')(event);
	};

	const styles = {
		height: '600px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: 'white'
	};

	return (
		<div style={{ height: '500px' }}>
			<KvWizard style={{ '--wizard-stepper-width': '160px' }} {...args} currentStep={currentStep} onGoToStep={handleGoToStep}>
				<div slot="step-content" style={{ height: '100%', overflow: 'scroll' }}>
					{currentStep === 0 && <div style={{ backgroundColor: 'gray', ...styles }}>Step 1 Content</div>}
					{currentStep === 1 && <div style={{ backgroundColor: 'black', ...styles }}>Step 2 Content</div>}
				</div>
			</KvWizard>
		</div>
	);
};

const DEFAULT_ARGS = {
	steps: [
		{
			title: 'Info',
			cancelable: true
		},
		{
			title: 'Configuration',
			allowGoBack: true,
			tip: 'Add·your·custom·configurations·here.'
		},
		{
			title: 'Confirmation',
			allowGoBack: true
		}
	],
	currentStep: 1,
	showStepBar: true,
	completeBtnLabel: 'Deploy',
	currentStepState: EStepState.Success
};

export const SuccessState = WizardTemplate.bind({});
SuccessState.args = {
	...DEFAULT_ARGS
};
export const ErrorState = WizardTemplate.bind({});
ErrorState.args = {
	...DEFAULT_ARGS,
	currentStepState: EStepState.Error
};

export const WithoutHeader = WizardTemplate.bind({});
WithoutHeader.args = {
	...DEFAULT_ARGS,
	showHeader: false
};

export const WithoutStepBar = WizardTemplate.bind({});
WithoutStepBar.args = {
	...DEFAULT_ARGS,
	showStepBar: false
};

export const WithoutGoBack = WizardTemplate.bind({});
WithoutGoBack.args = {
	...DEFAULT_ARGS,
	steps: [
		{
			title: 'Info',
			allowGoBack: false
		},
		{
			title: 'Configuration',
			allowGoBack: false
		},
		{
			title: 'Confirmation',
			allowGoBack: false
		}
	]
};
