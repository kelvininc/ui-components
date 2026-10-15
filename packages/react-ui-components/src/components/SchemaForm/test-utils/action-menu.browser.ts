import { whenKelvinReady } from '../../../test-utils/browser';
import { menuTrigger } from './action-menu';

/** Focuses a `KvActionMenu`'s trigger once it's ready, as its `setFocus()` does */
export const focusMenu = async (menu: Element) => {
	const trigger = await whenKelvinReady(menuTrigger(menu) as HTMLKvActionButtonIconElement);
	trigger.focus();
};
