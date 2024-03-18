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
		description: steps[currentStep].title,
		tip: steps[currentStep].tip
	};
};

export const buildFooterConfig = (steps?: IWizardStep[], currentStep?: number, currentStepState?: EStepState): IWizardFooter => {
	if (isEmpty(steps) || isNil(currentStep) || currentStep < 0 || currentStep > steps.length - 1) {
		return null;
	}

	const stepsConfig: IStepBarStep[] = steps.map((step, index) => {
		return {
			stepKey: step.title,
			enabled: (index === currentStep + 1 && currentStepState === EStepState.Success) || (index < currentStep && steps[index + 1].allowGoBack),
			active: index <= currentStep,
			hasError: index === currentStep && currentStepState === EStepState.Error
		};
	});

	return {
		steps: stepsConfig,
		currentStep,
		hasError: false,
		showPrevBtn: steps[currentStep].allowGoBack ?? false,
		prevEnabled: currentStep > 0,
		showNextBtn: currentStep < steps.length - 1,
		nextEnabled: currentStepState === EStepState.Success,
		showCancelBtn: steps[currentStep].cancelable ?? false,
		cancelEnabled: true,
		showCompleteBtn: currentStep === steps.length - 1,
		completeEnabled: currentStepState === EStepState.Success,
		progressPercentage: currentStep * (100 / (steps.length - 1))
	};
};
