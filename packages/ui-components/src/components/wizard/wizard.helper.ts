import { isEmpty, isNil } from 'lodash-es';
import { IStepBarStep } from '../step-bar/step-bar.types';
import { IWizardFooter } from '../wizard-footer/wizard-footer.types';
import { IWizardHeader } from '../wizard-header/wizard-header.types';
import { EStepState, IWizardStep, StepState } from './wizard.types';

export const buildHeaderConfig = (steps?: IWizardStep[], currentStep?: number): IWizardHeader => {
	if (isEmpty(steps) || isNil(currentStep) || currentStep < 0 || currentStep > steps.length - 1) {
		return null;
	}

	return {
		label: `Step ${currentStep + 1}`,
		description: steps[currentStep].title,
		tip: steps[currentStep].tip
	};
};

export const buildFooterConfig = (steps?: IWizardStep[], currentStep?: number, currentStepState?: StepState, disabled = false): IWizardFooter => {
	if (isEmpty(steps) || isNil(currentStep) || currentStep < 0 || currentStep > steps.length - 1) {
		return null;
	}

	const stepsConfig: IStepBarStep[] = steps.map((step, index) => {
		return {
			stepKey: step.title,
			enabled: !disabled && ((index === currentStep + 1 && currentStepState?.state === EStepState.Success) || (index < currentStep && steps[index + 1].allowGoBack)),
			active: index <= currentStep,
			hasError: index === currentStep && currentStepState?.state === EStepState.Error
		};
	});

	return {
		steps: stepsConfig,
		currentStep,
		hasError: false,
		showPrevBtn: steps[currentStep].allowGoBack ?? false,
		prevEnabled: !disabled && currentStep > 0,
		showNextBtn: currentStep < steps.length - 1,
		nextEnabled: !disabled && currentStepState?.state === EStepState.Success,
		nextTooltip: currentStepState?.error,
		showCancelBtn: steps[currentStep].cancelable ?? false,
		cancelEnabled: true,
		showCompleteBtn: currentStep === steps.length - 1,
		completeEnabled: !disabled && currentStepState?.state === EStepState.Success,
		completeTooltip: currentStepState?.error,
		progressPercentage: currentStep * (100 / (steps.length - 1))
	};
};
