import type { EComponentSize, EIconName } from '@kelvininc/ui-components';

export interface IActionMenuItem {
	/** Unique action identifier within this menu, passed to `onItemSelected` */
	id: string;
	/** Nonblank visible action label */
	label: string;
	/** Optional decorative icon */
	icon?: EIconName;
	/** Keeps the action visible and prevents focus or selection */
	disabled?: boolean;
	/** Uses the danger colors for an enabled action */
	destructive?: boolean;
	/** Adds a noninteractive separator before this action */
	separatorBefore?: boolean;
}

export interface IActionMenuProps {
	/** (required) Nonblank accessible name for the trigger and its menu */
	accessibleLabel: string;
	/** (optional) Actions in display order, with unique ids */
	items?: readonly IActionMenuItem[];
	/** (optional) Trigger icon. Defaults to More */
	icon?: EIconName;
	/** (optional) Disables the trigger and closes its menu */
	disabled?: boolean;
	/** (optional) Trigger size. Defaults to Small */
	size?: EComponentSize;
	/** (optional) Trigger Tab index. Use -1 to exclude it from sequential focus while keeping `setFocus()` */
	triggerTabIndex?: number;
	/** (optional) Menu panel z-index. Defaults to DEFAULT_DROPDOWN_Z_INDEX */
	zIndex?: number;
	/** (optional) Class added to the element that wraps the trigger */
	className?: string;
	/** Called once with the selected action's id, after closing and returning focus to the trigger */
	onItemSelected?: (id: string) => void;
}

export interface IActionMenuHandle {
	/**
	 * Waits for the trigger to be ready, then focuses it without opening the menu. Resolves `true` when the trigger
	 * has focus.
	 * @param canFocus Optional live check; returning false cancels the wait and the focus.
	 */
	setFocus: (canFocus?: () => boolean) => Promise<boolean>;
}
