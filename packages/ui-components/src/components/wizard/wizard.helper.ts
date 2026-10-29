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

export const buildFooterConfig = (steps?: IWizardStep[], currentStep?: number, currentStepState?: StepState, disabled = false, cancelDisabled = false): IWizardFooter => {
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
		cancelEnabled: !cancelDisabled,
		showCompleteBtn: currentStep === steps.length - 1,
		completeEnabled: !disabled && currentStepState?.state === EStepState.Success,
		completeTooltip: currentStepState?.error,
		progressPercentage: currentStep * (100 / (steps.length - 1))
	};
};

/**
 * `<input>` types Enter does nothing to, so they leave it to the wizard. Every other type takes it, either to
 * activate the control — a button, a file or a colour chooser — or to confirm the value typed into it.
 */
const PASSIVE_INPUT_TYPES = ['checkbox', 'radio', 'range', 'hidden'];

/**
 * Roles of controls that take Enter for themselves: a field confirming its value, or a dropdown driving its
 * own list, as much as a button. Every field and dropdown in this library renders a native control
 * underneath, which the checks on tag names already find in the composed path; a role is what a custom
 * trigger goes by, as one slotted into a `kv-dropdown`.
 */
const ENTER_OWNER_ROLES = ['button', 'textbox', 'searchbox', 'combobox', 'listbox', 'spinbutton'];

// `role` is matched case-insensitively, and holds a fallback list when the first role isn't supported
const hasEnterOwnerRole = (element: HTMLElement | null): boolean =>
	(element?.getAttribute?.('role') ?? '')
		.toLowerCase()
		.split(/\s+/)
		.some(role => ENTER_OWNER_ROLES.includes(role));

/**
 * Whether this node takes an Enter for itself, either to activate it — a button, a link, a summary — or to
 * confirm the value typed into a field. A wizard leaves such an Enter alone instead of advancing its step,
 * so an inline editor inside a step doesn't have to stop the key in the capture phase. A control Enter does
 * nothing to, as a checkbox or a radio, doesn't own it.
 */
export const ownsEnterKey = (node: unknown): boolean => {
	const element = node as HTMLElement | null;

	// A passive input falls through to the roles below rather than returning here, so that one a consumer
	// gave an explicit `role="button"` — a checkbox used as a toggle button — still owns its Enter
	if (element?.tagName === 'INPUT' && !PASSIVE_INPUT_TYPES.includes(((element as HTMLInputElement).type || 'text').toLowerCase())) {
		return true;
	}

	return (
		element?.tagName === 'TEXTAREA' ||
		element?.tagName === 'SELECT' ||
		element?.tagName === 'BUTTON' ||
		element?.tagName === 'SUMMARY' ||
		(element?.tagName === 'A' && element.hasAttribute?.('href')) ||
		hasEnterOwnerRole(element) ||
		element?.isContentEditable === true
	);
};
