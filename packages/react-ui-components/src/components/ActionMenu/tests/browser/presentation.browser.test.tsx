import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import { afterEach, describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { whenKelvinReady } from '../../../../test-utils/browser';
import { MENU_SHAPES, MENU_THEMES } from '../../test-utils/matrix';
import { expectMenuFocus, focusedControl, MENU_NAME, openMenu as open, panels, renderMenu } from '../../test-utils/render';

afterEach(() => setThemeMode(StyleMode.Night));

describe.each(MENU_SHAPES)('menu semantics: $name', row => {
	it('renders a named, hidden menu of button actions', async () => {
		await renderMenu(row.items);
		const menu = panels()[0];
		expect(menu.getAttribute('aria-label')).toBe(MENU_NAME);
		expect(menu.getAttribute('aria-hidden')).toBe('true');
		const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
		expect(items.map(item => item.textContent)).toEqual(row.items.map(item => item.label));
		items.forEach((item, index) => {
			expect(item.type).toBe('button');
			expect(item.tabIndex).toBe(-1);
			expect(item.disabled).toBe(!!row.items[index].disabled);
			expect(item.getAttribute('aria-disabled')).toBe(String(!!row.items[index].disabled));
			expect(item.querySelector('kv-icon')?.getAttribute('name') ?? undefined).toBe(row.items[index].icon);
		});
		expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(row.items.filter(item => item.separatorBefore).length);
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

describe.each(MENU_THEMES)('menu presentation: %s', theme => {
	it('keeps readable danger text, compact rows, a focus outline and a drawn down arrow', async () => {
		setThemeMode(theme === 'light' ? StyleMode.Light : StyleMode.Night);
		const { ref } = await renderMenu();
		await userEvent.hover(page.getByRole('textbox', { name: 'Broker host' }));
		await open(ref);
		const menu = page.getByRole('menu', { name: MENU_NAME, exact: true });
		const up = page.getByRole('menuitem', { name: 'Move up', exact: true });
		await expectMenuFocus('move-up');
		expect(focusedControl()).toBe(up.element());
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
