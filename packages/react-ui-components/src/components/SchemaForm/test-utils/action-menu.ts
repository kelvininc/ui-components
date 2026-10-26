import { act } from 'react';
import { fireStencilEvent } from '../../../test-utils';

/** The trigger of a `KvActionMenu`: the icon button that holds its name, Tab index and disabled state */
export const menuTrigger = (menu: Element) => menu.querySelector('kv-action-button-icon')!;

/** Icon buttons that aren't a menu's trigger, such as Remove */
export const standaloneIconButtons = (root: ParentNode) => Array.from(root.querySelectorAll('kv-action-button-icon')).filter(button => !button.closest('[data-action-menu]'));

export const menuActionIds = (menu: Element) => Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'), item => item.dataset.actionId);

/** Opens the menu from its trigger and chooses an action, as a user does. `force` tries even when the trigger is disabled. */
export const chooseMenuAction = (menu: Element, id: string, { force = false } = {}) => {
	act(() => {
		fireStencilEvent(menuTrigger(menu), 'onClickButton', new MouseEvent('click'), { force });
	});
	act(() => menu.querySelector<HTMLElement>(`[data-action-id="${id}"]`)?.click());
};

/** The accessible name of a `KvActionMenu`, which its trigger holds */
export const menuLabel = (menu: Element) => (menuTrigger(menu) as HTMLKvActionButtonIconElement).accessibleLabel;
