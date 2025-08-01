import { EventEmitter } from '@stencil/core';
import { IStepBar } from '../../types';

export interface IWizardFooter extends IStepBar {
	/** (optional) Defines if the step bar should render */
	showStepBar?: boolean;
	/** (optional) Defines if the `previous` button should be enabled and interactable */
	prevEnabled: boolean;
	/** (optional) Defines if the `cancel` button should be enabled and interactable */
	cancelEnabled: boolean;
	/** (optional) Defines if the `next` button should be enabled and interactable */
	nextEnabled: boolean;
	/** (optional) The `next` button tooltip */
	nextTooltip?: string;
	/** (optional) Defines if the `complete` button should be enabled and interactable */
	completeEnabled: boolean;
	/** (optional) The `complete` button tooltip */
	completeTooltip?: string;
	/** (optional) The `complete` button label */
	completeBtnLabel?: string;
	/** (optional) A boolean that determines whether the `cancel` button should be shown */
	showCancelBtn?: boolean;
	/** (optional) A boolean that determines whether the `previous` button should be shown */
	showPrevBtn?: boolean;
	/** (optional) A boolean that determines whether the `next` button should be shown */
	showNextBtn?: boolean;
	/** (optional) A boolean that determines whether the `complete` button should be shown */
	showCompleteBtn?: boolean;
}

export interface IWizardFooterEvents {
	/** Fires when a step on the step bar is clicked and emits the index */
	stepClick: EventEmitter<number>;
	/** Fires when the `previous` button is clicked */
	prevClick: EventEmitter<MouseEvent>;
	/** Fires when the `next` button is clicked */
	nextClick: EventEmitter<MouseEvent>;
	/** Fires when the `cancel` button is clicked */
	cancelClick: EventEmitter<MouseEvent>;
	/** Fires when the `complete` button is clicked */
	completeClick: EventEmitter<MouseEvent>;
}
