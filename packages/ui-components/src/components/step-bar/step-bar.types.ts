import { EventEmitter } from '@stencil/core';
import { IStepIndicator } from '../step-indicator/step-indicator.types';

export interface IStepBar {
	/** (optional) Defines the label to display next to the step counter (defaults to: "Progress: ") */
	label?: string;
	/** (required) Defines the steps array to render */
	steps: IStepIndicator[];
	/** (required) Defines the current step index */
	currentStep: number;
	/** (required) Defines the percentage of steps completed */
	progressPercentage: number;
	/** (optional) Defines if the progress bar should be in an error state */
	hasError: boolean;
}

export interface IStepBarEvents {
	/** Fires when a step is clicked and emits the index */
	stepClicked: EventEmitter<number>;
}
