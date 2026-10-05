import { EIconName } from '../../icon/icon.types';

export const MENU_ITEMS = Object.freeze(
	[
		{ id: 'move-up', label: 'Move up', icon: EIconName.ArrowUpward },
		{ id: 'move-down', label: 'Move down', icon: EIconName.ArrowDownward },
		{ id: 'remove', label: 'Remove Topic 1', icon: EIconName.Delete, destructive: true, separatorBefore: true }
	].map(item => Object.freeze(item))
);

const withDisabled = (ids: readonly string[]) => Object.freeze(MENU_ITEMS.map(item => Object.freeze({ ...item, disabled: ids.includes(item.id) })));

export const MENU_SHAPES = Object.freeze([
	{ name: 'all enabled', items: withDisabled([]), first: 'move-up', navigation: ['move-down', 'remove', 'move-down', 'remove', 'move-up'] },
	{ name: 'first disabled', items: withDisabled(['move-up']), first: 'move-down', navigation: ['remove', 'move-down', 'remove', 'remove', 'move-down'] },
	{ name: 'middle disabled', items: withDisabled(['move-down']), first: 'move-up', navigation: ['remove', 'move-up', 'remove', 'remove', 'move-up'] },
	{ name: 'one enabled', items: withDisabled(['move-up', 'remove']), first: 'move-down', navigation: ['move-down', 'move-down', 'move-down', 'move-down', 'move-down'] },
	{ name: 'all disabled', items: withDisabled(['move-up', 'move-down', 'remove']), first: undefined, navigation: [undefined, undefined, undefined, undefined, undefined] },
	{ name: 'empty', items: Object.freeze([]), first: undefined, navigation: [undefined, undefined, undefined, undefined, undefined] }
]);
MENU_SHAPES.forEach(row => {
	Object.freeze(row.navigation);
	Object.freeze(row);
});

export const MENU_OPEN_KEYS = Object.freeze(['Enter', 'Space', 'ArrowDown'] as const);
export const MENU_ACTIVATION_KEYS = Object.freeze(['Enter', 'Space'] as const);
export const MENU_NAVIGATION_KEYS = Object.freeze(['ArrowDown', 'ArrowDown', 'ArrowUp', 'End', 'Home'] as const);
export const MENU_TAB_SHAPES = Object.freeze(MENU_SHAPES.filter(row => ['all enabled', 'all disabled', 'empty'].includes(row.name)));
export const MENU_THEMES = Object.freeze(['light', 'night'] as const);
export const MENU_ROW_MOVE_STATES = Object.freeze(['closed', 'open', 'selection'] as const);
export const MENU_FOCUS_DESTINATIONS = Object.freeze(['Tab', 'Enter'] as const);
export const MENU_READINESS_STATES = Object.freeze(['released', 'pending'] as const);
export const MENU_TRIGGER_VARIANTS = Object.freeze([
	{ name: 'base', tag: 'kv-action-button', html: '<kv-action-button type="tertiary" accessible-label="Topic 1 actions">Actions</kv-action-button>' },
	{ name: 'icon', tag: 'kv-action-button-icon', html: '<kv-action-button-icon type="tertiary" icon="kv-more" accessible-label="Topic 1 actions"></kv-action-button-icon>' }
]);
MENU_TRIGGER_VARIANTS.forEach(row => Object.freeze(row));
