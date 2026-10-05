import { EventEmitter } from '@stencil/core';
import { EComponentSize } from '../../utils/types';
import { EIconName } from '../icon/icon.types';

export interface IActionMenuItem {
	/** Unique action identifier within this menu, emitted when selected. */
	id: string;
	/** Nonblank visible action label. */
	label: string;
	/** Optional decorative icon. */
	icon?: EIconName;
	/** Keeps the action visible and prevents focus or selection. */
	disabled?: boolean;
	/** Uses the danger colors for an enabled action. */
	destructive?: boolean;
	/** Adds a noninteractive separator before this action. */
	separatorBefore?: boolean;
}

export interface IActionMenu {
	/** (required) Nonblank accessible name for the trigger and its menu. */
	accessibleLabel: string;
	/** (optional) Actions in display order, with unique ids. */
	items?: readonly IActionMenuItem[];
	/** (optional) Trigger icon. Defaults to More. */
	icon?: EIconName;
	/** (optional) Disables the trigger and closes its menu. */
	disabled?: boolean;
	/** (optional) Trigger size. Defaults to Small. */
	size?: EComponentSize;
	/** (optional) Trigger Tab index. Use -1 to exclude it from sequential focus while retaining setFocus(). */
	triggerTabIndex?: number;
}

export interface IActionMenuEvents {
	/** Emitted once with the selected action's id, after closing and returning focus to the trigger. */
	itemSelected: EventEmitter<string>;
}
