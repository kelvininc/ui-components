import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export const DROPDOWN_DEFAULT_PLACEHOLDER = 'Select an option';

export interface IDropdown {
	placeholder: string;
	isOpen?: boolean;
	loading?: boolean;
	label?: string;
	value?: string;
	icon?: EIconName | EOtherIconName;
	errorState?: EValidationState;
	helpText?: string;
	disabled?: boolean;
	required?: boolean;
}

export interface IDropdownEvents {
	openStateChange: EventEmitter<boolean>;
}
