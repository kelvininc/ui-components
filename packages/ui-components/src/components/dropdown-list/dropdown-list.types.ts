import { EventEmitter } from '@stencil/core';

export interface IDropdownList {
	/** (optional) If `true` the list has a search text field */
	searchable?: boolean;
	/** (optional) If `true` the list has an action to unselect all items */
	selectionClearable?: boolean;
	/** (optional) The list search text field placeholder */
	searchPlaceholder?: string;
	/** (optional) If `true` the list can be cleared */
	selectionClearEnabled?: boolean;
	/** (optional) The clear search action text */
	clearSelectionLabel?: string;
}

export interface IDropdownListEvents {
	/** Emitted when the user interacts with the search text field */
	searchChange: EventEmitter<string>;
	/** Emitted when the user clears the selected items */
	clearSelection: EventEmitter<void>;
}
