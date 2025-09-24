import { EventEmitter } from '@stencil/core';
import { ISelectOption, ISelectMultiOptionsEvents, IMultiSelectDropdown } from '../../types';

export interface ISelectSingleOption
	extends Pick<ISelectOption, 'label' | 'value' | 'icon' | 'disabled' | 'selectable' | 'isDirty' | 'description' | 'action' | 'customClass' | 'customStyle' | 'customAttributes'> {
	options?: ISelectSingleOptions;
}

export type ISelectSingleOptions = Record<string, ISelectSingleOption>;

export interface ISingleSelectDropdown extends Omit<IMultiSelectDropdown, 'selectedOptions' | 'options' | 'filteredOptions'> {
	/** (optional) The value of the selected option */
	selectedOption?: string;
	/** (optional) The object with the dropdown options */
	options?: ISelectSingleOptions;
	/** (optional) The object with the dropdown options filtered */
	filteredOptions?: ISelectSingleOptions;
	/** (optional) If `false` the search text field is not auto-focused. Default `true`. */
	autoFocus?: boolean;
}

export interface ISingleSelectDropdownEvents extends Omit<ISelectMultiOptionsEvents, 'optionsSelected' | 'selectAll'> {
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
	/** Emitted when there's a click outside the dropdown's bondaries */
	clickOutside: EventEmitter<MouseEvent>;
}
