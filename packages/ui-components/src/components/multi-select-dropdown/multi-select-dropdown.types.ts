import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';

export const MULTI_SELECT_DROPDOWN_NO_DATA_AVAILABLE = 'No data available';

export interface IMultiSelectDropdownOption {
	label: string;
	value: string;
}

export interface IMultiSelectDropdownOptions {
	[key: string]: IMultiSelectDropdownOption;
}

export interface IMultiSelectDropdown {
	placeholder?: string;
	isOpen?: boolean;
	loading?: boolean;
	icon?: EIconName | EOtherIconName;
	searchable?: boolean;
	selectionClearable?: boolean;
	required?: boolean;
	label?: string;
	value?: string;
	errorState?: EValidationState;
	helpText?: string;
	disabled?: boolean;
	noDataAvailableLabel?: string;
	options?: IMultiSelectDropdownOptions;
	selectedOptions?: string[];
}

export interface IMultiSelectDropdownEvents {
	optionsSelected: EventEmitter<string[]>;
	searchChange: EventEmitter<string>;
}
