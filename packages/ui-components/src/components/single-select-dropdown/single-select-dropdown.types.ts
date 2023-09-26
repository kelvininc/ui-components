import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { EComponentSize, ISelectOption, ISelectMultiOptionsEvents, IMultiSelectDropdown } from '../../types';
import { ComputePositionConfig } from '@floating-ui/dom';

export interface ISelectSingleOption extends Pick<ISelectOption, 'label' | 'value' | 'disabled' | 'selectable' | 'description'> {
	options?: ISelectSingleOptions;
}

export type ISelectSingleOptions = Record<string, ISelectSingleOption>;

export interface ISingleSelectDropdown extends Omit<IMultiSelectDropdown, 'selectedOptions' | 'options' | 'filteredOptions'> {
	/** (optional) The text to display as the dropdown placeholder */
	placeholder: string;
	/** (optional) If `true` the list is opened */
	isOpen?: boolean;
	/** (optional) If `true` the list dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
	/** (optional) If `true` dropdown requires a value to be selected */
	required?: boolean;
	/** (optional) The text to display on the dropdown label */
	label?: string;
	/** (optional) The text to display on the dropdown  */
	displayValue?: string;
	/** (required) The error state for the dropdown */
	errorState?: EValidationState;
	/** (optional) The text to display as help text  */
	helpText?: string | string[];
	/** (optional) If `true` the dropdown is disabled */
	disabled?: boolean;
	/** (optional) The value of the selected option */
	selectedOption?: string;
	/** (optional) The size of the input */
	inputSize?: EComponentSize;
	/** (optional) The dropdown position config options */
	dropdownOptions?: Partial<ComputePositionConfig>;
	/** (optional) If `false` clicking outside the dropdown will not trigger state change. Default: true */
	clickOutsideClose?: boolean;
	/** (optional) A reference to the dropdown action element */
	actionElement?: HTMLElement;
	/** (optional) The object with the dropdown options */
	options?: ISelectSingleOptions;
	/** (optional) The object with the dropdown options filtered */
	filteredOptions?: ISelectSingleOptions;
	/** (optional) the dropdown list z-index (default: 9004) */
	zIndex?: number;
}

export interface ISingleSelectDropdownEvents extends Omit<ISelectMultiOptionsEvents, 'optionsSelected' | 'selectAll'> {
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
}
