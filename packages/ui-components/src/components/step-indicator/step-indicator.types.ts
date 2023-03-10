import { EventEmitter } from '@stencil/core';

export interface IStepIndicator {
	/** (optional) Defines if the step is interactable and emits clicks */
	enabled?: boolean;
	/** (optional) Defines if the step is active */
	active?: boolean;
	/** (optional) Defines if the step has an error and applies the border styling */
	hasError?: boolean;
}

export interface IStepIndicatorEvents {
	/** Fires when the step is clicked */
	indicatorClicked: EventEmitter<void>;
}
