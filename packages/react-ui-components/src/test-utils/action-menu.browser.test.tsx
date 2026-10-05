import React, { createRef, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { setThemeMode, StyleMode, type IActionMenuItem } from '@kelvininc/ui-components';
import { MENU_ROW_MOVE_STATES, MENU_SHAPES, MENU_THEMES } from '../../../ui-components/src/components/action-menu/test/action-menu.matrix';
import { KvActionMenu } from '../stencil-generated';
import { whenAllKelvinReady, whenKelvinReady } from './browser';

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

const renderMenu = async (items: readonly IActionMenuItem[] = MENU_SHAPES[0].items, props: { disabled?: boolean; triggerTabIndex?: number } = {}) => {
	const ref = createRef<HTMLKvActionMenuElement>();
	const selected = vi.fn();
	const element = (nextItems = items) => (
		<>
			<input aria-label="Broker host" />
			<KvActionMenu ref={ref} accessibleLabel="Topic 1 actions" items={nextItems} onItemSelected={selected} {...props} />
			<button type="button">Save topic</button>
		</>
	);
	const screen = await render(element());
	await whenAllKelvinReady(screen.container);
	return { ref, selected, screen, element };
};

const openMenu = async (ref: React.RefObject<HTMLKvActionMenuElement | null>) => {
	await ref.current!.setFocus();
	const trigger = page.getByRole('button', { name: 'Topic 1 actions', exact: true });
	await expect.poll(focusedControl).toBe(trigger.element());
	await userEvent.keyboard('{Enter}');
	const menu = page.getByRole('menu', { name: 'Topic 1 actions', exact: true });
	await expect.element(menu).toBeVisible();
	return { trigger, menu };
};

afterEach(() => setThemeMode(StyleMode.Night));

describe.each(MENU_SHAPES)('C5 React menu: $name', row => {
	it('forwards items, focus and one selection event through the real proxy', async () => {
		const { ref, selected } = await renderMenu(row.items);
		const { trigger, menu } = await openMenu(ref);
		if (row.first) {
			const label = row.items.find(item => item.id === row.first)!.label;
			const item = page.getByRole('menuitem', { name: label, exact: true });
			await expect.poll(focusedControl).toBe(item.element());
			await userEvent.keyboard('{Enter}');
			await expect.poll(() => selected.mock.calls.length).toBe(1);
			const event = selected.mock.calls[0][0] as CustomEvent<string>;
			expect(event.detail).toBe(row.first);
			expect(event.target).toBe(ref.current);
		} else {
			await expect.poll(focusedControl).toBe(menu.element());
			await userEvent.keyboard('{Escape}');
			expect(selected).not.toHaveBeenCalled();
		}
		await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect.poll(focusedControl).toBe(trigger.element());
	});
});

describe('C5 React focus contracts', () => {
	it.each([false, true])('closes and follows adjacent Tab order; reverse=%s', async reverse => {
		const { ref, selected } = await renderMenu();
		const { trigger } = await openMenu(ref);
		await expect.poll(focusedControl).toBe(page.getByRole('menuitem', { name: 'Move up', exact: true }).element());
		await userEvent.keyboard(reverse ? '{Shift>}{Tab}{/Shift}' : '{Tab}');
		const destination = reverse ? page.getByRole('textbox', { name: 'Broker host' }) : page.getByRole('button', { name: 'Save topic' });
		await expect.poll(focusedControl).toBe(destination.element());
		await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
		expect(selected).not.toHaveBeenCalled();
	});

	it('forwards disabled state and leaves focus on the surrounding fields', async () => {
		const { ref, selected } = await renderMenu(undefined, { disabled: true });
		const broker = page.getByRole('textbox', { name: 'Broker host' });
		broker.element().focus();
		await ref.current!.setFocus();
		await expect.poll(focusedControl).toBe(broker.element());
		await expect.element(page.getByRole('button', { name: 'Topic 1 actions', exact: true })).toHaveAttribute('aria-disabled', 'true');
		await userEvent.keyboard('{Tab}');
		await expect.poll(focusedControl).toBe(page.getByRole('button', { name: 'Save topic' }).element());
		expect(selected).not.toHaveBeenCalled();
	});

	it('forwards triggerTabIndex while keeping the public focus API', async () => {
		const { ref } = await renderMenu(undefined, { triggerTabIndex: -1 });
		page.getByRole('textbox', { name: 'Broker host' }).element().focus();
		await userEvent.keyboard('{Tab}');
		await expect.poll(focusedControl).toBe(page.getByRole('button', { name: 'Save topic' }).element());
		await ref.current!.setFocus();
		await expect.poll(focusedControl).toBe(page.getByRole('button', { name: 'Topic 1 actions', exact: true }).element());
	});

	it('repairs focused items after React updates their availability', async () => {
		const { ref, screen, selected, element } = await renderMenu();
		await openMenu(ref);
		await expect.poll(focusedControl).toBe(page.getByRole('menuitem', { name: 'Move up', exact: true }).element());
		await screen.rerender(element(MENU_SHAPES[1].items));
		await expect.poll(focusedControl).toBe(page.getByRole('menuitem', { name: 'Move down', exact: true }).element());
		await userEvent.keyboard('{Escape}');
		await expect.poll(focusedControl).toBe(page.getByRole('button', { name: 'Topic 1 actions', exact: true }).element());
		expect(selected).not.toHaveBeenCalled();
	});
});

describe.each(MENU_ROW_MOVE_STATES)('C5 keyed React row move: %s', state => {
	it('keeps the same menu host focusable and able to reopen', async () => {
		const ref = createRef<HTMLKvActionMenuElement>();
		const selected = vi.fn();
		const TopicRows = () => {
			const [ids, setIds] = useState(['topic-1', 'topic-2']);
			const move = () => setIds(['topic-2', 'topic-1']);
			return (
				<>
					<input aria-label="Broker host" />
					{ids.map(id => (
						<div key={id} data-topic={id}>
							<KvActionMenu
								ref={id === 'topic-1' ? ref : undefined}
								accessibleLabel={id === 'topic-1' ? 'Topic 1 actions' : 'Topic 2 actions'}
								items={MENU_SHAPES[0].items}
								onItemSelected={event => {
									selected(event);
									move();
								}}
							/>
						</div>
					))}
					<button type="button" onClick={move}>
						Move Topic 1
					</button>
				</>
			);
		};
		const screen = await render(<TopicRows />);
		await whenAllKelvinReady(screen.container);
		const original = ref.current;
		if (state !== 'closed') {
			await openMenu(ref);
			await expect.poll(focusedControl).toBe(page.getByRole('menuitem', { name: 'Move up', exact: true }).element());
		}
		if (state === 'selection') await userEvent.keyboard('{Enter}');
		else (page.getByRole('button', { name: 'Move Topic 1', exact: true }).element() as HTMLButtonElement).click();
		await expect.poll(() => screen.container.querySelector('[data-topic]')?.getAttribute('data-topic')).toBe('topic-2');
		expect(ref.current).toBe(original);
		await ref.current!.setFocus();
		const trigger = page.getByRole('button', { name: 'Topic 1 actions', exact: true });
		expect(focusedControl()).toBe(trigger.element());
		await expect.element(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.keyboard('{Enter}');
		await expect.element(page.getByRole('menu', { name: 'Topic 1 actions', exact: true })).toBeVisible();
		await expect.poll(focusedControl).toBe(page.getByRole('menuitem', { name: 'Move up', exact: true }).element());
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => selected.mock.calls.length).toBe(state === 'selection' ? 2 : 1);
		expect(selected.mock.calls.map(([event]) => (event as CustomEvent<string>).detail)).toEqual(state === 'selection' ? ['move-up', 'move-up'] : ['move-up']);
		await screen.unmount();
		await expect.poll(() => document.querySelectorAll('kv-portal').length).toBe(0);
		await expect.poll(() => document.querySelectorAll('[role="menu"]').length).toBe(0);
	});
});

const luminance = (color: string) => {
	const channels = color
		.match(/[\d.]+/g)!
		.slice(0, 3)
		.map(value => Number(value) / 255);
	const linear = channels.map(value => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
	return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
};

const contrastRatio = (foreground: string, background: string) => {
	const a = luminance(foreground);
	const b = luminance(background);
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

describe.each(MENU_THEMES)('C5 menu presentation: %s', theme => {
	it('keeps readable danger text, compact rows, a focus outline and a drawn down arrow', async () => {
		setThemeMode(theme === 'light' ? StyleMode.Light : StyleMode.Night);
		const { ref } = await renderMenu();
		await userEvent.hover(page.getByRole('textbox', { name: 'Broker host' }));
		const { menu } = await openMenu(ref);
		const up = page.getByRole('menuitem', { name: 'Move up', exact: true });
		await expect.poll(focusedControl).toBe(up.element());
		const remove = page.getByRole('menuitem', { name: 'Remove Topic 1', exact: true });
		const text = getComputedStyle(remove.element()).color;
		const background = getComputedStyle(menu.element()).backgroundColor;
		const token = getComputedStyle(document.body).getPropertyValue('--text-container-status-danger-default').trim();
		const probe = document.createElement('span');
		probe.style.color = token;
		expect(text).toBe(probe.style.color);
		expect(contrastRatio(text, background)).toBeGreaterThanOrEqual(4.5);
		expect(up.element().getBoundingClientRect().height).toBe(32);
		expect(getComputedStyle(up.element()).outlineStyle).toBe('solid');
		expect(getComputedStyle(up.element()).outlineWidth).toBe('2px');
		const arrow = await whenKelvinReady(document.querySelector<HTMLKvIconElement>('[data-action-id="move-down"] kv-icon'));
		const symbol = arrow.shadowRoot!.querySelector('use')!;
		await expect.poll(() => symbol.getBBox().width).toBeGreaterThan(0);
		await expect.poll(() => symbol.getBBox().height).toBeGreaterThan(0);
		await userEvent.hover(up);
		const ordinaryHover = getComputedStyle(up.element());
		expect(contrastRatio(ordinaryHover.color, ordinaryHover.backgroundColor)).toBeGreaterThanOrEqual(4.5);
		await userEvent.hover(remove);
		const hovered = getComputedStyle(remove.element());
		expect(contrastRatio(hovered.color, hovered.backgroundColor)).toBeGreaterThanOrEqual(4.5);
	});
});
