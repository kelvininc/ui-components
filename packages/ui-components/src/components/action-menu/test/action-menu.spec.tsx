import { newSpecPage } from '@stencil/core/testing';
import { KvActionButton } from '../../action-button/action-button';
import { KvActionButtonIcon } from '../../action-button-icon/action-button-icon';
import { KvActionMenu } from '../action-menu';
import { MENU_SHAPES } from './action-menu.matrix';

const renderMenu = async (items = MENU_SHAPES[0].items) => {
	const page = await newSpecPage({
		components: [KvActionMenu, KvActionButtonIcon, KvActionButton],
		html: '<kv-action-menu accessible-label="Topic 1 actions"></kv-action-menu>'
	});
	page.root.items = items;
	await page.waitForChanges();
	return page;
};

const openMenu = async (page: Awaited<ReturnType<typeof renderMenu>>) => {
	page.root.querySelector('kv-action-button-icon').dispatchEvent(new CustomEvent('clickButton', { bubbles: true, composed: true, detail: new MouseEvent('click') }));
	await page.waitForChanges();
};

describe.each(MENU_SHAPES)('C5 menu unit: $name', row => {
	it('renders named closed state, item semantics and presentation', async () => {
		const page = await renderMenu(row.items);
		const menu = page.root.querySelector('[role="menu"]');
		expect(menu.getAttribute('aria-label')).toBe('Topic 1 actions');
		expect(menu.getAttribute('aria-hidden')).toBe('true');
		const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
		expect(items.map(item => item.textContent)).toEqual(row.items.map(item => item.label));
		items.forEach((item, index) => {
			expect(item.type).toBe('button');
			expect(item.tabIndex).toBe(-1);
			expect(item.hasAttribute('disabled')).toBe(!!row.items[index].disabled);
			expect(item.getAttribute('aria-disabled')).toBe(String(!!row.items[index].disabled));
			expect(item.querySelector('kv-icon')?.getAttribute('name')).toBe(row.items[index].icon);
		});
		expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(row.items.filter(item => item.separatorBefore).length);
		expect(menu.querySelectorAll('.action-menu-item--destructive')).toHaveLength(row.items.filter(item => item.destructive).length);
	});
});

describe('C5 menu unit events', () => {
	it('emits the selected item id once and closes', async () => {
		const page = await renderMenu();
		const selected = jest.fn();
		page.root.addEventListener('itemSelected', event => selected((event as CustomEvent<string>).detail));
		await openMenu(page);
		page.root.querySelector<HTMLButtonElement>('[data-action-id="move-down"]').click();
		await page.waitForChanges();
		expect(selected.mock.calls).toEqual([['move-down']]);
		expect(page.root.querySelector('[role="menu"]').getAttribute('aria-hidden')).toBe('true');
	});

	it('refuses synthetic activation of a disabled item', async () => {
		const page = await renderMenu(MENU_SHAPES[1].items);
		const selected = jest.fn();
		page.root.addEventListener('itemSelected', selected);
		await openMenu(page);
		page.root.querySelector('[data-action-id="move-up"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		await page.waitForChanges();
		expect(selected).not.toHaveBeenCalled();
		expect(page.root.querySelector('[role="menu"]').getAttribute('aria-hidden')).toBe('false');
	});

	it('refuses activation while closed', async () => {
		const page = await renderMenu();
		const selected = jest.fn();
		page.root.addEventListener('itemSelected', selected);
		page.root.querySelector<HTMLButtonElement>('[data-action-id="move-up"]').click();
		await page.waitForChanges();
		expect(selected).not.toHaveBeenCalled();
	});

	it('uses an empty list when items is undefined', async () => {
		const page = await renderMenu();
		page.root.items = undefined;
		await page.waitForChanges();
		expect(page.root.querySelectorAll('[role="menuitem"]')).toHaveLength(0);
	});
});
