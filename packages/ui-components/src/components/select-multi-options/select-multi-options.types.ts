import { EventEmitter } from '@stencil/core';

export interface ISelectMultiOption {
	label: string;
	value: string;
	disabled?: boolean;
	children?: ISelectMultiOption[];
	group?: string;
}

export type ISelectMultiOptions = Record<string, ISelectMultiOption>;

export interface ISelectMultiOptionsConfig {
	/** (optional) The object with the dropdown options */
	options?: ISelectMultiOptions;
	/** (optional) The object with the dropdown options filtered */
	filteredOptions?: ISelectMultiOptions;
	/** (optional) The object with indexed by the dropdown labels and its selected value */
	selectedOptions?: Record<string, boolean>;
	/** (required) The text to display when there are no options */
	noDataAvailableLabel?: string;
	/** (optional) If `true` the dropdown is searchable */
	searchable?: boolean;
	/** (optional) The search value to display */
	searchValue?: string;
	/** (optional) If `true` dropdown items can be cleared */
	selectionClearable?: boolean;
	/** (optional) The clear search action text */
	clearSelectionLabel?: string;
	/** (optional) The dropdown's min-height */
	minHeight?: string;
	/** (optional) The dropdown's max-height */
	maxHeight?: string;
}

export interface ISelectMultiOptionsEvents {
	/** Emitted when the selected options change */
	optionsSelected: EventEmitter<Record<string, boolean>>;
	/** Emitted when the search term changes */
	searchChange: EventEmitter<string>;
	/** Emitted when the selection is cleared */
	selectionCleared: EventEmitter<void>;
}
