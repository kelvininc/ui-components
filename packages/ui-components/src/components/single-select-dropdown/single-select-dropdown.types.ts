import { EventEmitter } from '@stencil/core';
import { EIconName, EOtherIconName } from '../icon/icon.types';
import { EValidationState } from '../text-field/text-field.types';
import { EComponentSize, ICustomCss, ISelectOption } from '../../types';
import { ComputePositionConfig } from '@floating-ui/dom';

export interface ISingleSelectDropdownOption extends Pick<ISelectOption, 'label' | 'value' | 'disabled' | 'selectable'> {
	options?: ISingleSelectDropdownOptions;
}

export type ISingleSelectDropdownOptions = Record<string, ISingleSelectDropdownOption>;

export interface ISingleSelectDropdown extends ICustomCss {
	/** (optional) The text to display as the dropdown placeholder */
	placeholder: string;
	/** (optional) If `true` the list is opened */
	isOpen?: boolean;
	/** (optional) If `true` the list dropdown is loading */
	loading?: boolean;
	/** (optional) The icon to display on the dropdown */
	icon?: EIconName | EOtherIconName;
	/** (optional) If `true` the dropdown is searchable */
	searchable?: boolean;
	/** (optional) The list search text field placeholder */
	searchPlaceholder?: string;
	/** (optional) If `true` dropdown items can be cleared */
	selectionClearable?: boolean;
	/** (optional) The clear search action text */
	clearSelectionLabel?: string;
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
	/** (required) The text to display when there are no options */
	noDataAvailableLabel?: string;
	/** (optional) The object with the dropdown options */
	options?: ISingleSelectDropdownOptions;
	/** (optional) The value of the selected option */
	selectedOption?: string;
	/** (optional) The object with the dropdown options filtered */
	filteredOptions?: ISingleSelectDropdownOptions;
	/** (optional) The dropdown's min-height */
	minHeight?: string;
	/** (optional) The dropdown's max-height */
	maxHeight?: string;
	/** (optional) The size of the input */
	inputSize?: EComponentSize;
	/** (optional) The dropdown position config options */
	dropdownOptions?: Partial<ComputePositionConfig>;
	/** (optional) The minimum amount of options required to display the search. Defaults to `8`. */
	minSearchOptions?: number;
}

export interface ISingleSelectDropdownEvents {
	/** Emitted when the selected option change */
	optionSelected: EventEmitter<string>;
	/** Emitted when the search term changes */
	searchChange: EventEmitter<string>;
	/** Emitted when the selection is cleared */
	clearSelection: EventEmitter<void>;
	/** Emitted when the dropdown open state changes */
	openStateChange: EventEmitter<boolean>;
}
