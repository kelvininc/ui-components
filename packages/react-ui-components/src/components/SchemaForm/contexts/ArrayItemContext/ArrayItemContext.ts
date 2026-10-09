import { createContext, ReactNode } from 'react';
import type { EntryFocusTarget } from '../../hooks/entryFocus';

export type ArrayAction = 'add' | 'remove' | 'move-up' | 'move-down';
export type ArrayItemFocus = { control: EntryFocusTarget; action: EntryFocusTarget };
/** Each array template owns its direct items' action and control targets. */
export type ArrayItemsFocus = {
	requestFocus: (action: ArrayAction, index: number) => void;
	registerItem: (index: number, entry: ArrayItemFocus) => () => void;
};
export const ArrayItemsContext = createContext<ArrayItemsFocus | null>(null);

export const ArrayItemLayoutContext = createContext<{
	itemPrefix?: string;
	fixedItems: number;
	orderable: boolean;
	removable: boolean;
	reserveGrip: boolean;
} | null>(null);

// Only the item's own field consumes these slots; nested fields keep their layout.
export const ArrayItemControlsContext = createContext<{
	fieldId: string;
	itemName: string;
	fieldset?: boolean;
	before?: ReactNode;
	after?: ReactNode;
	header?: ReactNode;
} | null>(null);
