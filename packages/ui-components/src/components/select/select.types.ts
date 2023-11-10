import { EventEmitter } from '@stencil/core';

export interface ISelect {
	/** (optional) If `true` the list has a search text field */
	searchable?: boolean;
	/** (optional) The search value on the list */
	searchValue?: string;
	/** (optional) If `true` the list has an action to unselect all items */
	selectionClearable?: boolean;
	/** (optional) The list search text field placeholder */
	searchPlaceholder?: string;
	/** (optional) If `true` the list can be cleared */
	selectionClearEnabled?: boolean;
	/** (optional) The clear search action text */
	clearSelectionLabel?: string;
	/** (optional) If `true` the list has an action to select all items */
	selectionAll?: boolean;
	/** (optional) The selection all action text */
	selectAllLabel?: string;
	/** (optional) If `true` the selection action is enabled */
	selectionAllEnabled?: boolean;
	/** (optional) The dropdown's min-height */
	minHeight?: string;
	/** (optional) The dropdown's max-height */
	maxHeight?: string;
	/** (optional) The dropdown's min-width */
	minWidth?: string;
	/** (optional) The dropdown's max-width */
	maxWidth?: string;
}

export interface ISelectEvents {
	/** Emitted when the user interacts with the search text field */
	searchChange: EventEmitter<string>;
	/** Emitted when the user clears the selected items */
	clearSelection: EventEmitter<void>;
	/** Emitted when the user clicks on the all items */
	selectAll: EventEmitter<void>;
}
