import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../types';

export interface IToggleSwitchOption {
	/** Button's key */
	key: string;
	/** Button's label */
	label: string;
	/** (optional) If `true` be in a disabled state */
	disabled?: boolean;
}

export interface IToggleSwitch {
	/** (optional) List of toggle switch options */
	options: IToggleSwitchOption[];
	/** (optional) If `true` all toggle buttons will be disabled */
	disabled?: boolean;
	/** (optional) Toggle switch selected option key */
	selectedOption?: string;
	/** (optional) A record with the button's key and its individual disabled state */
	disabledOptions?: Record<string, boolean>;
	/** (optional) Sets the size for all toggle buttons */
	size?: EComponentSize;
}

export interface IToggleSwitchEvents {
	/** When the toggle switch selection changes, emit the requested value */
	checkedChange: EventEmitter<string>;
}
