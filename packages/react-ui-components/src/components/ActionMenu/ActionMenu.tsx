import { DEFAULT_DROPDOWN_POSITION_CONFIG, EActionButtonType, EComponentSize, getNextEnabledIndex } from '@kelvininc/ui-components';
import classNames from 'classnames';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { KvActionButtonIcon, KvDropdownBase, KvIcon } from '../../stencil-generated';
import { DEFAULT_ACTION_MENU_ICON, FOCUS_WAIT_MS, MENU_NAVIGATION_KEYS, NO_ACTIONS } from './config';
import type { IActionMenuHandle, IActionMenuProps } from './types';
import styles from './ActionMenu.module.scss';

const POSITION_CONFIG = { ...DEFAULT_DROPDOWN_POSITION_CONFIG, placement: 'bottom-end' as const };

const nextFrame = () => new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
const ignoresKey = (event: KeyboardEvent | React.KeyboardEvent) => event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey;

/**
 * An icon button that opens a menu of actions, with the menu button keyboard pattern: Enter, Space or ArrowDown
 * open it on the first enabled action, the arrows, Home and End move between enabled actions, and Escape or Tab
 * close it from the trigger.
 *
 * `kv-dropdown-base` moves the menu panel into a body portal, outside React's root, where React's delegated
 * events never arrive. So the panel's listeners are native ones.
 */
export const KvActionMenu = forwardRef<IActionMenuHandle, IActionMenuProps>(function KvActionMenu(
	{ accessibleLabel, items = NO_ACTIONS, icon = DEFAULT_ACTION_MENU_ICON, disabled = false, size = EComponentSize.Small, triggerTabIndex, className, onItemSelected },
	ref
) {
	const [isOpen, setOpen] = useState(false);
	const [focusRequest, setFocusRequest] = useState<{ id?: string }>();
	const [trigger, setTrigger] = useState<HTMLKvActionButtonIconElement | null>(null);
	const [menu, setMenu] = useState<HTMLDivElement | null>(null);
	const hostRef = useRef<HTMLDivElement>(null);
	const triggerFocusGeneration = useRef(0);
	const focusFrame = useRef<number | undefined>(undefined);
	const focusedId = useRef<string | undefined>(undefined);
	// Callbacks that outlive a render (focus loops, native listeners) read the latest props and state from here
	const latest = useRef({ items, disabled, isOpen, trigger, menu, onItemSelected });
	latest.current = { items, disabled, isOpen, trigger, menu, onItemSelected };

	const cancelFocus = useCallback(() => {
		if (focusFrame.current !== undefined) window.cancelAnimationFrame(focusFrame.current);
		focusFrame.current = undefined;
	}, []);

	const closeMenu = useCallback(
		(restoreFocus: boolean) => {
			cancelFocus();
			focusedId.current = undefined;
			latest.current.isOpen = false;
			setOpen(false);
			setFocusRequest(undefined);
			if (restoreFocus && !latest.current.disabled) latest.current.trigger?.focus();
		},
		[cancelFocus]
	);

	const openMenu = useCallback(() => {
		latest.current.isOpen = true;
		setOpen(true);
		setFocusRequest({});
	}, []);

	const selectItem = useCallback(
		(id: string) => {
			const { isOpen: open, disabled: inactive, items: actions, onItemSelected: onSelected } = latest.current;
			const item = actions.find(action => action.id === id);
			if (!open || inactive || !item || item.disabled) return;
			closeMenu(true);
			onSelected?.(item.id);
		},
		[closeMenu]
	);

	const closeWithKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key !== 'Tab' && event.key !== 'Escape') return false;
			if (event.key === 'Escape') event.preventDefault();
			event.stopPropagation();
			// Start native Tab movement at the trigger, because the focused panel lives in a body portal
			closeMenu(true);
			return true;
		},
		[closeMenu]
	);

	// Retries until the panel is visible, because it only becomes focusable once the portal shows it
	const focusMenuWhenVisible = useCallback(
		(preferredId?: string) => {
			cancelFocus();
			const deadline = performance.now() + FOCUS_WAIT_MS;
			const focus = () => {
				focusFrame.current = undefined;
				const { isOpen: open, disabled: inactive, items: actions, menu: panel } = latest.current;
				if (!open || inactive || !hostRef.current?.isConnected) return;
				const preferred = actions.findIndex(item => item.id === preferredId && !item.disabled);
				const index = preferred >= 0 ? preferred : getNextEnabledIndex(actions, -1, 1);
				const buttons = Array.from(panel?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
				const target = index < 0 ? panel : buttons.find(button => button.dataset.actionId === actions[index].id && !button.disabled);
				target?.focus();
				if (target && document.activeElement === target) return;
				if (performance.now() < deadline) focusFrame.current = window.requestAnimationFrame(focus);
			};
			focusFrame.current = window.requestAnimationFrame(focus);
		},
		[cancelFocus]
	);

	useImperativeHandle(
		ref,
		() => ({
			setFocus: async canFocus => {
				const generation = triggerFocusGeneration.current;
				let deadline: number | undefined;
				let readyTrigger: HTMLKvActionButtonIconElement | undefined;
				let ready = false;
				while (generation === triggerFocusGeneration.current && !latest.current.disabled && hostRef.current?.isConnected && canFocus?.() !== false) {
					const current = latest.current.trigger;
					if (current?.isConnected) {
						if (readyTrigger !== current) {
							readyTrigger = current;
							ready = false;
							deadline = undefined;
							void Promise.resolve(current.componentOnReady?.()).then(() => {
								if (readyTrigger === current) ready = true;
							});
						}
						if (ready) {
							deadline ??= performance.now() + FOCUS_WAIT_MS;
							current.focus();
							if ((current.getRootNode() as Document | ShadowRoot).activeElement === current) return true;
							if (performance.now() >= deadline) return false;
						}
					}
					await nextFrame();
				}
				return false;
			}
		}),
		[]
	);

	useLayoutEffect(() => {
		if (isOpen && focusRequest) focusMenuWhenVisible(focusRequest.id);
	}, [isOpen, focusRequest, focusMenuWhenVisible]);

	useEffect(() => {
		if (!disabled) return;
		triggerFocusGeneration.current++;
		closeMenu(false);
	}, [disabled, closeMenu]);

	// New items can disable the focused action, which drops its focus, and can give a focused empty panel actions
	// to focus: focus the same action again, or the first enabled one. A focused action that's still enabled keeps
	// its focus, as React keeps its button.
	const previousItems = useRef(items);
	useLayoutEffect(() => {
		if (previousItems.current === items) return;
		previousItems.current = items;
		if (!isOpen || !menu) return;
		const active = document.activeElement as HTMLElement | null;
		const lostFocus = (!active || active === document.body) && focusedId.current !== undefined;
		const onDisabledAction = menu.contains(active) && (active as HTMLButtonElement).disabled === true;
		if (active === menu || lostFocus || onDisabledAction) setFocusRequest({ id: focusedId.current });
	}, [items, isOpen, menu]);

	useEffect(
		() => () => {
			triggerFocusGeneration.current++;
			cancelFocus();
		},
		[cancelFocus]
	);

	useEffect(() => {
		if (!menu) return;
		const onClick = (event: MouseEvent) => {
			const item = (event.target as Element | null)?.closest<HTMLButtonElement>('[role="menuitem"]');
			if (!item || !menu.contains(item)) return;
			event.stopPropagation();
			if (item.dataset.actionId !== undefined) selectItem(item.dataset.actionId);
		};
		const onFocusIn = (event: FocusEvent) => {
			focusedId.current = (event.target as HTMLElement).dataset.actionId;
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (!latest.current.isOpen || ignoresKey(event) || closeWithKey(event)) return;
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				event.stopPropagation();
				const id = (event.target as HTMLElement).dataset.actionId;
				if (!event.repeat && id !== undefined) selectItem(id);
				return;
			}
			if (!MENU_NAVIGATION_KEYS.includes(event.key)) return;
			event.preventDefault();
			event.stopPropagation();
			const buttons = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
			const from = event.key === 'Home' || event.key === 'End' ? -1 : buttons.indexOf(event.target as HTMLButtonElement);
			const step = event.key === 'ArrowUp' || event.key === 'End' ? -1 : 1;
			buttons[getNextEnabledIndex(latest.current.items, from, step)]?.focus();
		};
		menu.addEventListener('click', onClick);
		menu.addEventListener('focusin', onFocusIn);
		menu.addEventListener('keydown', onKeyDown);
		return () => {
			menu.removeEventListener('click', onClick);
			menu.removeEventListener('focusin', onFocusIn);
			menu.removeEventListener('keydown', onKeyDown);
		};
	}, [menu, selectItem, closeWithKey]);

	const onTriggerClick = (event: CustomEvent<MouseEvent>) => {
		event.stopPropagation();
		event.detail.stopPropagation();
		if (disabled) return;
		if (latest.current.isOpen) closeMenu(true);
		else openMenu();
	};

	const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLKvActionButtonIconElement>) => {
		if (disabled || ignoresKey(event)) return;
		if (latest.current.isOpen && closeWithKey(event.nativeEvent)) return;
		if (event.key !== 'ArrowDown') return;
		event.preventDefault();
		event.stopPropagation();
		if (!event.repeat) openMenu();
	};

	const onOpenStateChange = (event: CustomEvent<boolean>) => {
		event.stopPropagation();
		if (!event.detail) closeMenu(false);
	};

	return (
		<div ref={hostRef} className={classNames(styles.ActionMenu, className)} data-action-menu>
			<KvDropdownBase isOpen={isOpen} actionElement={trigger ?? undefined} listElement={menu ?? undefined} options={POSITION_CONFIG} onOpenStateChange={onOpenStateChange}>
				<KvActionButtonIcon
					ref={setTrigger}
					slot="action"
					icon={icon}
					type={EActionButtonType.Tertiary}
					size={size}
					accessibleLabel={accessibleLabel}
					disabled={disabled}
					menuExpanded={isOpen}
					menuTabIndex={triggerTabIndex}
					onClickButton={onTriggerClick}
					onKeyDown={onTriggerKeyDown}
				/>
				<div
					ref={setMenu}
					slot="list"
					className={classNames(styles.Panel, { [styles.Closed]: !isOpen })}
					role="menu"
					aria-label={accessibleLabel}
					tabIndex={-1}
					aria-hidden={!isOpen}
				>
					{items.map(item => (
						<React.Fragment key={item.id}>
							{item.separatorBefore && <div className={styles.Separator} role="separator" />}
							<button
								type="button"
								role="menuitem"
								tabIndex={-1}
								disabled={item.disabled}
								aria-disabled={!!item.disabled}
								data-action-id={item.id}
								className={classNames(styles.Item, { [styles.Destructive]: item.destructive })}
							>
								{item.icon && <KvIcon name={item.icon} aria-hidden="true" />}
								{item.label}
							</button>
						</React.Fragment>
					))}
				</div>
			</KvDropdownBase>
		</div>
	);
});
