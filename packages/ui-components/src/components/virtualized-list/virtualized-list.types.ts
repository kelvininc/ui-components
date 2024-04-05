import { ChildType } from '@stencil/core/internal/index';

export type RenderItemFunc = (index: number) => ChildType | Promise<ChildType> | ChildType[] | Promise<ChildType[]> | Promise<ChildType>[];

export interface IVirtualizedList {
	/** (required) Defines the total number of items rendered in the list */
	itemCount: number;
	/** (required) Defines the estimated height in pixels of an item */
	itemHeight: number;
	/** (required) Defines the given item key */
	getItemKey: (index: number) => string;
	/** (required) Defines the item render function */
	renderItem: RenderItemFunc;
	/** (optional) The number of items outside the viewport that are rendered. Default: `5` */
	overscanCount?: number;
}
