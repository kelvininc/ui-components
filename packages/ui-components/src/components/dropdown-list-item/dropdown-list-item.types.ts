import { EventEmitter } from '@stencil/core';

export interface IDropdownListItem {
	label: string;
	value: string;
	selected?: boolean;
	togglable?: boolean;
}

export interface IDropdownListItemEvents {
	itemSelected: EventEmitter<string>;
}
