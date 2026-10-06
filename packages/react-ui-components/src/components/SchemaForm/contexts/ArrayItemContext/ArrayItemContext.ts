import { createContext, ReactNode } from 'react';

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
	fieldset?: boolean;
	before?: ReactNode;
	after?: ReactNode;
	header?: ReactNode;
} | null>(null);
