import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export const SINGLE_SELECT_DROPDOWN_NO_DATA_AVAILABLE = 'No data available';

export interface ISingleSelectDropdownOption {
	label: string;
	value: string;
}

export interface ISingleSelectDropdownOptions {
	[key: string]: ISingleSelectDropdownOption;
}

export interface ISingleSelectDropdown {
	placeholder: string;
	isOpen?: boolean;
	loading?: boolean;
	icon?: EIconName | EOtherIconName;
	searchable?: boolean;
	required?: boolean;
	label?: string;
	value?: string;
	errorState?: EValidationState;
	helpText?: string;
	disabled?: boolean;
	noDataAvailableLabel?: string;
	options?: ISingleSelectDropdownOptions;
	selectedOption?: string;
}

export interface ISingleSelectDropdownEvents {
	optionSelected: EventEmitter<string>;
}
