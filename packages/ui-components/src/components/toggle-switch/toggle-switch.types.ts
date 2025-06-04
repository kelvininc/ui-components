import { EventEmitter } from '@stencil/core';
import { EComponentSize, IToggleButton } from '../../types';

export type IToggleSwitchOption<T = string | number> = Omit<IToggleButton<T>, 'withRadio'>;

export interface IToggleSwitch<T extends string | number | symbol = string | number | symbol> {
	/** (optional) List of toggle switch options */
	options: IToggleSwitchOption<T>[];
	/** (optional) If `true` all toggle buttons will be disabled */
	disabled?: boolean;
	/** (optional) Toggle switch selected option key */
	selectedOption?: T;
	/** (optional) A record with the button's key and its individual disabled state */
	disabledButtons?: Record<T, boolean>;
	/** (optional) Sets the size for all toggle buttons */
	size?: EComponentSize;
}

export interface IToggleSwitchEvents {
	/** When the toggle switch selection changes, emit the requested value */
	checkedChange: EventEmitter<string>;
}
