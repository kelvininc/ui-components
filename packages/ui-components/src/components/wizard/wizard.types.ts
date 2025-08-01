import { EventEmitter } from '@stencil/core';

export interface IWizardStep {
	title: string;
	cancelable?: boolean;
	allowGoBack?: boolean;
	tip?: string;
}

export interface IWizard {
	/** (required) Defines the wizard steps */
	steps: IWizardStep[];
	/** (required) Defines the current step index */
	currentStep: number;
	/** (optional) Defines the current step state. Only the success state allows to proceed */
	currentStepState?: StepState;
	/** (optional) Defines if the header should render. Default: true */
	showHeader?: boolean;
	/** (optional) Defines if the step bar should render. Default: true */
	showStepBar?: boolean;
	/** (optional) Defines if the wizard navigation is disabled. Default: false */
	disabled?: boolean;
	/** (optional) A label to show on the last step button. Default: 'Submit' */
	completeBtnLabel?: string;
}

export interface IWizardEvents {
	/** Fires when it's necessary to go to a different step */
	goToStep: EventEmitter<number>;
	/** Fires when a complete button is clicked */
	completeClick: EventEmitter<MouseEvent>;
	/** Fires when a cancel button is clicked */
	cancelClick: EventEmitter<MouseEvent>;
}

export type StepState =
	| {
			state: EStepState.Success;
			error?: never;
	  }
	| {
			state: EStepState.Error;
			error?: string;
	  };

export enum EStepState {
	Success = 'success',
	Error = 'error'
}
