import React, { createRef } from 'react';
import { expect, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../test-utils/browser';
import { KvActionMenu } from '../ActionMenu';
import type { IActionMenuHandle, IActionMenuItem, IActionMenuProps } from '../types';
import { MENU_SHAPES } from './matrix';

export const MENU_NAME = 'Topic 1 actions';

/** The focused element, inside every shadow root on the way */
export const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

export const trigger = (name = MENU_NAME) => page.getByRole('button', { name, exact: true });
export const menuItem = (name: string) => page.getByRole('menuitem', { name, exact: true });
export const brokerField = () => page.getByRole('textbox', { name: 'Broker host' });
export const saveButton = () => page.getByRole('button', { name: 'Save topic' });
export const panels = () => Array.from(document.querySelectorAll<HTMLElement>('[role="menu"]'));

// `mounted: false` leaves the menu out while the fields around it stay
type MenuProps = Partial<Omit<IActionMenuProps, 'onItemSelected'>> & { mounted?: boolean };

/** A menu between two fields of a form that records submits, as SchemaForm renders one in a list row */
export const renderMenu = async (items: readonly IActionMenuItem[] = MENU_SHAPES[0].items, props: MenuProps = {}) => {
	const ref = createRef<IActionMenuHandle>();
	const selected = vi.fn<(id: string) => void>();
	const submitted = vi.fn();
	const element = (nextItems: readonly IActionMenuItem[] = items, nextProps: MenuProps = props) => (
		<form
			onSubmit={event => {
				event.preventDefault();
				submitted();
			}}
		>
			<input aria-label="Broker host" />
			<div data-topic-row style={{ display: 'inline-block' }}>
				{nextProps.mounted !== false && <KvActionMenu ref={ref} accessibleLabel={MENU_NAME} items={nextItems} onItemSelected={selected} {...nextProps} />}
			</div>
			<button type="button">Save topic</button>
		</form>
	);
	const screen = await render(element());
	await whenAllKelvinReady(screen.container);
	// `wait: false` skips waiting for the components, for tests that hold a component's readiness
	const rerender = async (nextItems?: readonly IActionMenuItem[], nextProps?: MenuProps, { wait = true } = {}) => {
		await screen.rerender(element(nextItems ?? items, nextProps ?? props));
		if (wait) await whenAllKelvinReady(screen.container);
	};
	return { ref, selected, submitted, screen, rerender };
};

export const focusTrigger = async (ref: React.RefObject<IActionMenuHandle | null>) => {
	await ref.current!.setFocus();
	await expect.poll(focusedControl).toBe(trigger().element());
};

export const openMenu = async (ref: React.RefObject<IActionMenuHandle | null>, key = '{Enter}') => {
	await focusTrigger(ref);
	await userEvent.keyboard(key);
};

/** Waits for focus on the action, or on the named panel when no action can take it */
export const expectMenuFocus = async (id?: string) => {
	await expect
		.poll(() => {
			const active = document.activeElement as HTMLElement | null;
			return id ? active?.dataset.actionId : active?.getAttribute('role');
		})
		.toBe(id ?? 'menu');
	const active = document.activeElement!;
	expect(active.getAttribute('role')).toBe(id ? 'menuitem' : 'menu');
	if (!id) expect(active.getAttribute('aria-label')).toBe(MENU_NAME);
};

export const expectClosed = async (name = MENU_NAME) => {
	await expect.element(trigger(name)).toHaveAttribute('aria-expanded', 'false');
	const panel = panels().find(menu => menu.getAttribute('aria-label') === name)!;
	expect(panel.getAttribute('aria-hidden')).toBe('true');
	expect(getComputedStyle(panel).display).toBe('none');
};

/** Presses a key on the focused element, as a browser does while the key is held down */
export const pressRepeated = (key: string) => {
	const event = new KeyboardEvent('keydown', { key, repeat: true, bubbles: true, composed: true, cancelable: true });
	focusedControl()!.dispatchEvent(event);
	return event;
};

export const nextFrames = async (count = 2) => {
	for (let frame = 0; frame < count; frame++) await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
};
