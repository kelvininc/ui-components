import { EventEmitter } from '@stencil/core';
import { ISelectMultiOption } from '../../types';

export enum ELevelState {
	Selected = 'selected',
	Indeterminate = 'indeterminate',
	None = 'none'
}

export interface ISelectOptionMultiLevel {
	/** (required) The option to render */
	option: ISelectMultiOption;
	/** (required) The selected options used to calculate the state of levels */
	selectedOptions: Record<string, boolean>;
	/** (required) The level depth at which the option is rendered */
	level: number;
}

export interface ISelectOptionMultiLevelEvents {
	/** Emitted when an option is selected (levels are ignored) */
	optionSelected: EventEmitter<Record<string, boolean>>;
	/** Emitted when a level's state changes */
	optionLevelStateChange: EventEmitter<ELevelState>;
}
