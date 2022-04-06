import { EventEmitter } from '@stencil/core';

export interface IDropdownList {
	searchable?: boolean;
	selectionClearable?: boolean;
	searchPlaceholder?: string;
	selectionClearEnabled?: boolean;
}

export interface IDropdownListEvents {
	searchChange: EventEmitter<string>;
	clearSelection: EventEmitter<void>;
}
