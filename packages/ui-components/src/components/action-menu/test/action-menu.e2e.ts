import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { IActionMenuItem } from '../action-menu.types';
import {
	MENU_ACTIVATION_KEYS,
	MENU_FOCUS_CANCELLATIONS,
	MENU_FOCUS_DESTINATIONS,
	MENU_ID_COLLISION,
	MENU_NAVIGATION_KEYS,
	MENU_OPEN_KEYS,
	MENU_READINESS_STATES,
	MENU_ROW_MOVE_STATES,
	MENU_SHAPES,
	MENU_TAB_SHAPES
} from './action-menu.matrix';

const renderMenu = async (row: { items: readonly IActionMenuItem[] } = MENU_SHAPES[0]) => {
	const page = await newE2EPage();
	await page.setContent(
		'<form><input id="broker" aria-label="Broker host"><div id="topic-row" style="display:inline-block"><kv-action-menu accessible-label="Topic 1 actions"></kv-action-menu></div><button id="save" type="button">Save topic</button></form>'
	);
	const host = await page.find('kv-action-menu');
	host.setProperty('items', row.items);
	await page.waitForChanges();
	await page.evaluate(() =>
		document.querySelector('form').addEventListener('submit', event => {
			event.preventDefault();
			document.body.dataset.submitted = 'true';
		})
	);
	return { page, host, selected: await host.spyOnEvent('itemSelected') };
};

const activeControl = (page: E2EPage) =>
	page.evaluate(() => {
		let active = document.activeElement as HTMLElement;
		while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement as HTMLElement;
		return { role: active?.getAttribute('role'), id: active?.dataset.actionId || active?.id, name: active?.getAttribute('aria-label') };
	});

const expectMenuFocus = async (page: E2EPage, id?: string) => {
	await page.waitForFunction(
		itemId => {
			const active = document.activeElement as HTMLElement;
			return itemId ? active?.dataset.actionId === itemId : active?.getAttribute('role') === 'menu';
		},
		{ timeout: 2500 },
		id
	);
	const active = await activeControl(page);
	expect(active.role).toBe(id ? 'menuitem' : 'menu');
	if (id) expect(active.id).toBe(id);
	else expect(active.name).toBe('Topic 1 actions');
};

const openMenu = async (page: E2EPage, key = 'Enter') => {
	const trigger = await page.$('aria/Topic 1 actions[role="button"]');
	expect(trigger).not.toBeNull();
	await trigger.focus();
	await page.keyboard.press(key);
	await page.waitForChanges();
};

const expectClosed = async (page: E2EPage) => {
	const trigger = await page.$('aria/Topic 1 actions[role="button"]');
	expect(await trigger.evaluate(control => control.getAttribute('aria-expanded'))).toBe('false');
	expect(await (await page.find('[role="menu"]')).isVisible()).toBe(false);
	expect(await page.$('aria/Topic 1 actions[role="menu"]')).toBeNull();
};

describe.each(MENU_OPEN_KEYS)('C5 menu opens: %s', key => {
	it.each(MENU_SHAPES)('focuses the enabled target for $name', async row => {
		const { page, selected } = await renderMenu(row);
		await openMenu(page, key);
		await expectMenuFocus(page, row.first);
		const trigger = await page.$('aria/Topic 1 actions[role="button"]');
		expect(await trigger.evaluate(control => control.getAttribute('aria-haspopup'))).toBe('menu');
		expect(await trigger.evaluate(control => control.getAttribute('aria-expanded'))).toBe('true');
		expect(selected).not.toHaveReceivedEvent();
	});
});

describe.each(MENU_SHAPES)('C5 menu keyboard: $name', row => {
	it('skips disabled items, wraps and honors Home and End without choosing', async () => {
		const { page, selected } = await renderMenu(row);
		await openMenu(page);
		await expectMenuFocus(page, row.first);
		for (const [index, key] of MENU_NAVIGATION_KEYS.entries()) {
			await page.keyboard.press(key);
			await page.waitForChanges();
			await expectMenuFocus(page, row.navigation[index]);
		}
		expect(selected).not.toHaveReceivedEvent();
	});

	it('closes with Escape and restores the trigger', async () => {
		const { page, selected } = await renderMenu(row);
		await openMenu(page);
		await expectMenuFocus(page, row.first);
		await page.keyboard.press('Escape');
		await page.waitForChanges();
		await expectClosed(page);
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		expect(selected).not.toHaveReceivedEvent();
	});
});

describe.each(MENU_TAB_SHAPES)('C5 menu Tab: $name', row => {
	it.each([false, true])('closes and moves to the adjacent field; reverse=%s', async reverse => {
		const { page, selected } = await renderMenu(row);
		await openMenu(page);
		await expectMenuFocus(page, row.first);
		if (reverse) await page.keyboard.down('Shift');
		await page.keyboard.press('Tab');
		if (reverse) await page.keyboard.up('Shift');
		await page.waitForChanges();
		await expectClosed(page);
		expect((await activeControl(page)).id).toBe(reverse ? 'broker' : 'save');
		expect(selected).not.toHaveReceivedEvent();
	});
});

describe('C5 menu activation', () => {
	it.each([...MENU_ACTIVATION_KEYS, 'mouse'])('chooses once with %s and never submits the form', async key => {
		const { page, selected } = await renderMenu(MENU_SHAPES[1]);
		await openMenu(page);
		await expectMenuFocus(page, 'move-down');
		if (key === 'mouse') await (await page.$('aria/Move down[role="menuitem"]')).click();
		else await page.keyboard.press(key);
		await page.waitForChanges();
		expect(selected.events.map(event => event.detail)).toEqual(['move-down']);
		await expectClosed(page);
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		expect(await page.evaluate(() => document.body.dataset.submitted)).toBeUndefined();
	});

	it.each(MENU_ACTIVATION_KEYS)('chooses once when %s is held and does not reopen', async key => {
		const { page, selected } = await renderMenu();
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		for (let repeat = 0; repeat < 3; repeat++) await page.keyboard.down(key);
		await page.keyboard.up(key);
		await page.waitForChanges();
		expect(selected.events.map(event => event.detail)).toEqual(['move-up']);
		await expectClosed(page);
	});

	it('keeps disabled actions visible and refuses mouse selection', async () => {
		const { page, selected } = await renderMenu(MENU_SHAPES[1]);
		await openMenu(page);
		await expectMenuFocus(page, 'move-down');
		const disabled = await page.$('aria/Move up[role="menuitem"]');
		expect(disabled).not.toBeNull();
		expect(await disabled.evaluate(control => control.getAttribute('aria-disabled'))).toBe('true');
		await disabled.click();
		await page.waitForChanges();
		expect(selected).not.toHaveReceivedEvent();
		expect(await (await page.find('[role="menu"]')).isVisible()).toBe(true);
	});

	it('lets the selection handler choose the final focus destination', async () => {
		const { page, host, selected } = await renderMenu();
		await page.evaluate(() => document.querySelector('kv-action-menu').addEventListener('itemSelected', () => document.querySelector<HTMLElement>('#broker').focus()));
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		await page.keyboard.press('Enter');
		await page.waitForChanges();
		expect(selected).toHaveReceivedEventTimes(1);
		expect((await activeControl(page)).id).toBe('broker');
		expect(host).not.toBeNull();
	});
});

describe('C5 menu focus and state', () => {
	it.each(MENU_FOCUS_DESTINATIONS)('settles setFocus inside a shadow root before %s', async key => {
		const page = await newE2EPage({ html: '<div id="topic-shell"></div>' });
		await page.evaluate(async items => {
			const root = document.querySelector('#topic-shell').attachShadow({ mode: 'open' });
			const host = document.createElement('kv-action-menu');
			host.accessibleLabel = 'Topic 1 actions';
			host.items = items;
			const save = document.createElement('button');
			save.id = 'save';
			save.type = 'button';
			save.textContent = 'Save topic';
			root.append(host, save);
			await host.componentOnReady();
		}, MENU_SHAPES[0].items);
		await page.waitForChanges();
		const settled = await page.evaluate(async () => {
			const host = document.querySelector('#topic-shell').shadowRoot.querySelector('kv-action-menu');
			let done = false;
			void host.setFocus().then(() => (done = true));
			await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
			await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
			return done;
		});
		expect(settled).toBe(true);
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		await page.keyboard.press(key);
		await page.waitForChanges();
		if (key === 'Enter') await expectMenuFocus(page, 'move-up');
		expect(await activeControl(page)).toMatchObject(key === 'Tab' ? { id: 'save' } : { role: 'menuitem', id: 'move-up' });
		expect(await page.evaluate(() => getComputedStyle(document.querySelector('[role="menu"]')).display)).toBe(key === 'Tab' ? 'none' : 'flex');
	});

	it.each(MENU_READINESS_STATES)('waits for the replacement trigger during setFocus; old readiness=%s', async state => {
		const { page } = await renderMenu();
		const beforeRender = await page.evaluate(async oldReadiness => {
			const host = document.querySelector('kv-action-menu');
			const original = host.querySelector('kv-action-button-icon');
			original.dataset.focusGeneration = 'original';
			if (oldReadiness === 'delayed-replacement') {
				const prototype = Object.getPrototypeOf(original);
				const componentReady = prototype.componentOnReady;
				const delayed = new WeakMap<HTMLKvActionButtonIconElement, Promise<HTMLKvActionButtonIconElement>>();
				prototype.componentOnReady = function (this: HTMLKvActionButtonIconElement) {
					if (!delayed.has(this)) {
						delayed.set(
							this,
							componentReady.call(this).then(() => new Promise<HTMLKvActionButtonIconElement>(resolve => window.setTimeout(() => resolve(this), 1200)))
						);
					}
					return delayed.get(this);
				};
			}
			let entered: () => void;
			let release: () => void;
			const waiting = new Promise<void>(resolve => (entered = resolve));
			original.componentOnReady = () => {
				entered();
				return new Promise<HTMLKvActionButtonIconElement>(resolve => (release = () => resolve(original)));
			};
			void host.setFocus().then(() => (host.dataset.focusComplete = 'true'));
			await waiting;
			document.querySelector('form').append(document.querySelector('#topic-row'));
			if (oldReadiness === 'released') release();
			for (let turn = 0; turn < 10; turn++) await Promise.resolve();
			return {
				completed: host.dataset.focusComplete === 'true',
				originalConnected: original.isConnected,
				originalCurrent: host.querySelector('kv-action-button-icon') === original
			};
		}, state);
		expect(beforeRender).toEqual({ completed: false, originalConnected: true, originalCurrent: true });
		await page.waitForChanges();
		await page.waitForFunction(() => document.querySelector('kv-action-menu').dataset.focusComplete === 'true', { timeout: 2500 });
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		expect(await page.evaluate(() => document.querySelector('kv-action-menu').querySelector('kv-action-button-icon').dataset.focusGeneration)).toBeUndefined();
	});

	it.each(MENU_FOCUS_CANCELLATIONS)('cancels pending readiness when %s without moving focus', async cancellation => {
		const { page, selected } = await renderMenu();
		const focus = await page.evaluate(async state => {
			const host = document.querySelector('kv-action-menu');
			const trigger = host.querySelector('kv-action-button-icon');
			const broker = document.querySelector<HTMLElement>('#broker');
			let entered: () => void;
			let release: () => void;
			const waiting = new Promise<void>(resolve => (entered = resolve));
			trigger.componentOnReady = () => {
				entered();
				return new Promise<HTMLKvActionButtonIconElement>(resolve => (release = () => resolve(trigger)));
			};
			broker.focus();
			const settled = host.setFocus();
			await waiting;
			if (state === 'disabled') host.disabled = true;
			else host.remove();
			await settled;
			const beforeRelease = document.activeElement === broker;
			release();
			await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
			await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
			return { beforeRelease, afterRelease: document.activeElement === broker };
		}, cancellation);
		expect(focus).toEqual({ beforeRelease: true, afterRelease: true });
		expect(selected).not.toHaveReceivedEvent();
	});

	it('preserves a focused action when valid ids collide with separator keys', async () => {
		const { page } = await renderMenu({ items: MENU_ID_COLLISION.before });
		await openMenu(page);
		await expectMenuFocus(page, 'copy');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('ArrowDown');
		await expectMenuFocus(page, 'move-separator');
		await page.evaluate(items => {
			const focused = document.querySelector<HTMLElement>('[data-action-id="move-separator"]');
			focused.dataset.retained = 'true';
			document.querySelector('kv-action-menu').items = items;
		}, MENU_ID_COLLISION.after);
		await page.waitForChanges();
		await expectMenuFocus(page, 'move-separator');
		expect(await page.evaluate(() => document.querySelector<HTMLElement>('[data-action-id="move-separator"]').dataset.retained)).toBe('true');
		expect(await page.evaluate(() => Array.from(document.querySelectorAll('[role="menuitem"]'), item => item.textContent))).toEqual(
			MENU_ID_COLLISION.after.map(item => item.label)
		);
	});

	it.each(MENU_ROW_MOVE_STATES)('recreates its portal after a %s row move', async state => {
		const { page, selected } = await renderMenu();
		if (state !== 'closed') {
			await openMenu(page);
			await expectMenuFocus(page, 'move-up');
		}
		if (state === 'selection') {
			await page.evaluate(() =>
				document
					.querySelector('kv-action-menu')
					.addEventListener('itemSelected', () => document.querySelector('form').append(document.querySelector('#topic-row')), { once: true })
			);
			await page.keyboard.press('Enter');
		}
		await page.evaluate(async move => {
			const host = document.querySelector('kv-action-menu') as HTMLKvActionMenuElement;
			if (move) document.querySelector('form').append(document.querySelector('#topic-row'));
			await host.setFocus();
		}, state !== 'selection');
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		await page.waitForChanges();
		await expectClosed(page);
		expect(await page.findAll('kv-portal')).toHaveLength(1);
		await page.keyboard.press('Enter');
		await page.waitForChanges();
		await expectMenuFocus(page, 'move-up');
		await page.keyboard.press('Enter');
		await page.waitForChanges();
		expect(selected.events.map(event => event.detail)).toEqual(state === 'selection' ? ['move-up', 'move-up'] : ['move-up']);
		await page.evaluate(() => document.querySelector('kv-action-menu').remove());
		await page.waitForChanges();
		expect(await page.findAll('kv-portal')).toHaveLength(0);
		expect(await page.findAll('[role="menu"]')).toHaveLength(0);
	});

	it('exposes setFocus without opening or choosing', async () => {
		const { page, selected } = await renderMenu();
		await page.focus('#broker');
		await page.evaluate(async () => {
			const host = document.querySelector('kv-action-menu') as HTMLElement & { setFocus(): Promise<void> };
			await host.setFocus();
		});
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		await expectClosed(page);
		expect(selected).not.toHaveReceivedEvent();
	});

	it('keeps a disabled trigger out of Tab order and refuses focus or activation', async () => {
		const { page, host, selected } = await renderMenu();
		host.setProperty('disabled', true);
		await page.waitForChanges();
		await page.focus('#broker');
		await page.evaluate(async () => {
			const host = document.querySelector('kv-action-menu') as HTMLElement & { setFocus(): Promise<void> };
			await host.setFocus();
		});
		expect((await activeControl(page)).id).toBe('broker');
		await page.keyboard.press('Tab');
		expect((await activeControl(page)).id).toBe('save');
		await (await page.$('aria/Topic 1 actions[role="button"]')).evaluate(control => (control as HTMLElement).click());
		await page.waitForChanges();
		await expectClosed(page);
		expect(selected).not.toHaveReceivedEvent();
	});

	it('supports triggerTabIndex=-1 while retaining explicit focus', async () => {
		const { page, host } = await renderMenu();
		host.setProperty('triggerTabIndex', -1);
		await page.waitForChanges();
		await page.focus('#broker');
		await page.keyboard.press('Tab');
		expect((await activeControl(page)).id).toBe('save');
		await page.evaluate(async () => {
			const host = document.querySelector('kv-action-menu') as HTMLElement & { setFocus(): Promise<void> };
			await host.setFocus();
		});
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
	});

	it('preserves focused ids across item reordering', async () => {
		const { page, host, selected } = await renderMenu();
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		host.setProperty('items', [MENU_SHAPES[0].items[2], MENU_SHAPES[0].items[1], MENU_SHAPES[0].items[0]]);
		await page.waitForChanges();
		await expectMenuFocus(page, 'move-up');
		await page.keyboard.press('ArrowDown');
		await page.waitForChanges();
		await expectMenuFocus(page, 'remove');
		expect(selected).not.toHaveReceivedEvent();
	});

	it.each(MENU_SHAPES.filter(row => ['first disabled', 'all disabled', 'empty'].includes(row.name)))('repairs focus for $name updates', async row => {
		const { page, host, selected } = await renderMenu();
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		host.setProperty('items', row.items);
		await page.waitForChanges();
		await expectMenuFocus(page, row.first);
		expect(selected).not.toHaveReceivedEvent();
	});

	it('closes when the trigger becomes disabled', async () => {
		const { page, host, selected } = await renderMenu();
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		host.setProperty('disabled', true);
		await page.waitForChanges();
		await expectClosed(page);
		expect(selected).not.toHaveReceivedEvent();
	});

	it('closes on an outside click and retains its focus destination', async () => {
		const { page, selected } = await renderMenu();
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		await page.click('#save');
		await page.waitForChanges();
		await expectClosed(page);
		expect((await activeControl(page)).id).toBe('save');
		expect(selected).not.toHaveReceivedEvent();
	});

	it('allows toggling the trigger closed', async () => {
		const { page, selected } = await renderMenu();
		await (await page.$('aria/Topic 1 actions[role="button"]')).click();
		await page.waitForChanges();
		await expectMenuFocus(page, 'move-up');
		await (await page.$('aria/Topic 1 actions[role="button"]')).click();
		await page.waitForChanges();
		await expectClosed(page);
		expect(await activeControl(page)).toMatchObject({ role: 'button', name: 'Topic 1 actions' });
		expect(selected).not.toHaveReceivedEvent();
	});

	it('preserves modified shortcuts on the trigger and menu items', async () => {
		const { page, selected } = await renderMenu();
		const trigger = await page.$('aria/Topic 1 actions[role="button"]');
		await trigger.focus();
		await page.keyboard.down('Control');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.up('Control');
		await page.waitForChanges();
		await expectClosed(page);
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		await page.evaluate(() =>
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter' && event.ctrlKey) document.body.dataset.shortcut = String(!event.defaultPrevented);
			})
		);
		await page.keyboard.down('Control');
		await page.keyboard.press('Enter');
		await page.keyboard.up('Control');
		expect(await page.evaluate(() => document.body.dataset.shortcut)).toBe('true');
		expect(selected).not.toHaveReceivedEvent();
		await expectMenuFocus(page, 'move-up');
	});

	it('keeps instances independent and removes their body portals on unmount', async () => {
		const { page } = await renderMenu();
		await page.evaluate(() => {
			const second = document.createElement('kv-action-menu');
			second.setAttribute('accessible-label', 'Topic 2 actions');
			(second as HTMLElement & { items: unknown }).items = (document.querySelector('kv-action-menu') as HTMLElement & { items: unknown }).items;
			document.querySelector('form').append(second);
		});
		await page.waitForChanges();
		await openMenu(page);
		await expectMenuFocus(page, 'move-up');
		await page.evaluate(() => document.querySelector('kv-action-menu').remove());
		await page.waitForChanges();
		expect(await page.findAll('[role="menu"]')).toHaveLength(1);
		await (await page.$('aria/Topic 2 actions[role="button"]')).click();
		await page.waitForChanges();
		await expectMenuFocus(page, 'move-up');
		await page.evaluate(() => document.querySelector('kv-action-menu').remove());
		await page.waitForChanges();
		expect(await page.findAll('[role="menu"]')).toHaveLength(0);
		expect(await page.findAll('kv-portal')).toHaveLength(0);
	});
});
