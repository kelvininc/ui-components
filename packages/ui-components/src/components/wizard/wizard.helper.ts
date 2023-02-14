import { isEmpty, isNil } from 'lodash';
import { IStepBarStep } from '../step-bar/step-bar.types';
import { IWizardFooter } from '../wizard-footer/wizard-footer.types';
import { IWizardHeader } from '../wizard-header/wizard-header.types';
import { EStepState, IWizardStep } from './wizard.types';

export const buildHeaderConfig = (steps?: IWizardStep[], currentStep?: number): IWizardHeader => {
	if (isEmpty(steps) || isNil(currentStep) || currentStep < 0 || currentStep > steps.length - 1) {
		return null;
	}

	return {
		label: `Step ${currentStep + 1}`,
		description: steps[currentStep].title
	};
};

export const buildFooterConfig = (steps?: IWizardStep[], currentStep?: number, currentStepState?: EStepState, completeBtnLabel?: string): IWizardFooter => {
	if (isEmpty(steps) || isNil(currentStep) || currentStep < 0 || currentStep > steps.length - 1) {
		return null;
	}

	const stepsConfig: IStepBarStep[] = steps.map((step, index) => {
		return {
			stepKey: step.title,
			enabled: (index === currentStep + 1 && currentStepState === EStepState.Success) || (index < currentStep && steps[index + 1].allowGoBack),
			active: index === currentStep ? !!currentStepState : index < currentStep,
			hasError: index <= currentStep && currentStepState === EStepState.Error
		};
	});

	return {
		steps: stepsConfig,
		currentStep,
		hasError: currentStepState === EStepState.Error,
		prevBtnLabel: steps[currentStep].allowGoBack ? (currentStep === 0 ? 'Cancel' : 'Back') : undefined,
		prevEnabled: steps[currentStep].allowGoBack,
		nextBtnLabel: currentStep === steps.length - 1 ? completeBtnLabel : 'Next',
		nextEnabled: currentStepState === EStepState.Success,
		progressPercentage: currentStep * (100 / (steps.length - 1))
	};
};
