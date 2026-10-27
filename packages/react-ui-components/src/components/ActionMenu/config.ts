import { EIconName } from '@kelvininc/ui-components';
import type { IActionMenuItem } from './types';

// How long focus keeps being retried while the trigger or the menu becomes visible
export const FOCUS_WAIT_MS = 1000;
export const DEFAULT_ACTION_MENU_ICON = EIconName.More;
export const NO_ACTIONS: readonly IActionMenuItem[] = Object.freeze([]);
export const MENU_NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
