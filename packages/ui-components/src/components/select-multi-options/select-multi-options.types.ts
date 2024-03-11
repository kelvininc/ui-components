import { EventEmitter } from '@stencil/core';
import { IIllustrationMessage, ISelectEvents, ISelectOption } from '../../types';

export interface ISelectMultiOption
	extends Pick<ISelectOption, 'label' | 'value' | 'icon' | 'disabled' | 'selectable' | 'description' | 'togglable' | 'customClass' | 'customStyle'> {
	options?: ISelectMultiOptions;
}

export type ISelectMultiOptions = Record<string, ISelectMultiOption>;

export interface ISelectMultiOptionsConfig {
	/** (optional) The object with the dropdown options */
	options?: ISelectMultiOptions;
	/** (optional) The object with the dropdown options filtered */
	filteredOptions?: ISelectMultiOptions;
	/** (optional) The object with indexed by the dropdown labels and its selected value */
	selectedOptions?: Record<string, boolean>;
	/** (optional) The configuration for the "no data available" empty state illustration */
	noDataAvailableConfig?: IIllustrationMessage;
	/** (optional) The configuration for the "no results found" empty state illustration */
	noResultsFoundConfig?: IIllustrationMessage;
	/** (optional) If `false` the dropdown is not searchable. Default `true` */
	searchable?: boolean;
	/** (optional) The list search text field placeholder */
	searchPlaceholder?: string;
	/** (optional) The search value to display */
	searchValue?: string;
	/** (optional) If `true` dropdown items can be cleared */
	selectionClearable?: boolean;
	/** (optional) The clear selection action text */
	clearSelectionLabel?: string;
	/** (optional) The dropdown's min-height */
	minHeight?: string;
	/** (optional) The dropdown's max-height */
	maxHeight?: string;
	/** (optional) The dropdown's min-width */
	minWidth?: string;
	/** (optional) The dropdown's max-width */
	maxWidth?: string;
	/** (optional) If `true` the list has an action to select all items */
	selectionAll?: boolean;
	/** (optional) The selection all action text */
	selectAllLabel?: string;
	/** (optional) If `true` a selection counter is displayed */
	counter?: boolean;
	/** (optional) The minimum amount of options required to display the search. Defaults to `15`. */
	minSearchOptions?: number;
	/** (optional) If `true` the keyboard shortcuts can be used to navigate between the dropdown results. Default `false` */
	shortcuts?: boolean;
	/** (optional) If `true` an add option will appear at the bottom of options list. Default: `false` */
	canAddItems?: boolean;
	/** (optional) The create new option placeholder. Default: `Add a new option`*/
	createOptionPlaceholder?: string;
	/** (optional) The create form input placeholder  */
	createInputPlaceholder?: string;
}

export interface ISelectMultiOptionsEvents extends ISelectEvents {
	/** Emitted when the selected options change */
	optionsSelected: EventEmitter<Record<string, boolean>>;
	/** Emitted when an option is selected */
	optionSelected: EventEmitter<string>;
	/** Emitted when the 'esc' key is pressed */
	dismiss: EventEmitter<void>;
	/** Emitted when a new option is created */
	optionCreated: EventEmitter<string>;
}
