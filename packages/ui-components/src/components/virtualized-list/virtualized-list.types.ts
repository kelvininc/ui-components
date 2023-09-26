import { ChildType } from '@stencil/core/internal/index';

export type RenderItemFunc = (index: number) => ChildType | Promise<ChildType> | ChildType[] | Promise<ChildType[]> | Promise<ChildType>[];

export interface IVirtualizedList {
	/** (required) Defines the total number of items rendered in the list */
	itemCount: number;
	/** (required) Defines the estimated height of an item */
	itemHeight: number;
	/** (required) Defines the given item key */
	getItemKey: (index: number) => string;
	/** (optional) Defines the dynamic height of the list. It's usefull when the items have diferent heights */
	getItemHeight?: (index: number) => number;
	/** (required) Defines the item render function */
	renderItem: RenderItemFunc;
}
