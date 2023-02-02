import { EventEmitter } from '@stencil/core';
import { IStepBar } from '../../types';

export interface IWizardFooter extends IStepBar {
	/** (optional) Defines if the step bar should render */
	showStepBar?: boolean;
	/** (optional) A label to show on the `previous` button */
	prevBtnLabel?: string;
	/** (required) A label to show on the `next` button */
	nextBtnLabel: string;
	/** (required) Defines if the `previous` button should be enabled and interactable */
	prevEnabled: boolean;
	/** (required) Defines if the `next` button should be enabled and interactable */
	nextEnabled: boolean;
}

export interface IWizardFooterEvents {
	/** Fires when a step on the step bar is clicked and emits the index */
	stepClick: EventEmitter<number>;
	/** Fires when the `previous` button is clicked */
	prevClick: EventEmitter<void>;
	/** Fires when the `next` button is clicked */
	nextClick: EventEmitter<void>;
}
