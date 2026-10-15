import React, { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../../../test-utils/browser';
import { KvActionMenu } from '../../ActionMenu';
import type { IActionMenuHandle } from '../../types';
import { MENU_FOCUS_CANCELLATIONS, MENU_FOCUS_DESTINATIONS, MENU_ID_COLLISION, MENU_ROW_MOVE_STATES, MENU_SHAPES } from '../../test-utils/matrix';
import {
	brokerField,
	expectClosed,
	expectMenuFocus,
	focusedControl,
	menuItem,
	MENU_NAME,
	nextFrames,
	openMenu,
	panels,
	renderMenu,
	saveButton,
	trigger
} from '../../test-utils/render';

const triggerHost = (container: ParentNode = document) => container.querySelector<HTMLKvActionButtonIconElement>('kv-action-button-icon')!;

/** Holds the trigger's readiness until the returned release is called */
const holdReadiness = (host: HTMLKvActionButtonIconElement) => {
	let release!: () => void;
	let entered!: () => void;
	const waiting = new Promise<void>(resolve => (entered = resolve));
	const readiness = new Promise<HTMLKvActionButtonIconElement>(resolve => (release = () => resolve(host)));
	host.componentOnReady = () => {
		entered();
		return readiness;
	};
	return { waiting, release };
};

describe('setFocus', () => {
	it('focuses the trigger without opening or choosing', async () => {
		const { ref, selected } = await renderMenu();
		(brokerField().element() as HTMLInputElement).focus();
		await expect(ref.current!.setFocus()).resolves.toBe(true);
		expect(focusedControl()).toBe(trigger().element());
		await expectClosed();
		expect(selected).not.toHaveBeenCalled();
	});

	it('cancels the readiness wait when its caller moves focus elsewhere', async () => {
		const { ref } = await renderMenu();
		const broker = brokerField().element() as HTMLInputElement;
		const save = saveButton().element() as HTMLButtonElement;
		const { waiting, release } = holdReadiness(triggerHost());
		broker.focus();
		const pending = ref.current!.setFocus(() => document.activeElement === broker);
		await waiting;
		save.focus();
		await expect(pending).resolves.toBe(false);
		release();
		await nextFrames();
		expect(document.activeElement).toBe(save);
	});

	it.each(MENU_FOCUS_CANCELLATIONS)('cancels a pending wait when %s, without moving focus', async cancellation => {
		const { ref, selected, rerender } = await renderMenu();
		const broker = brokerField().element() as HTMLInputElement;
		const { waiting, release } = holdReadiness(triggerHost());
		broker.focus();
		let settled = false;
		const pending = ref.current!.setFocus().then(() => (settled = true));
		await waiting;
		if (cancellation === 'unmounted') await rerender(undefined, { mounted: false }, { wait: false });
		else {
			await rerender(undefined, { disabled: true }, { wait: false });
			if (cancellation === 're-enabled') await rerender(undefined, { disabled: false }, { wait: false });
		}
		await nextFrames();
		expect(settled).toBe(true);
		expect(document.activeElement).toBe(broker);
		release();
		await pending;
		await nextFrames();
		expect(document.activeElement).toBe(broker);
		if (cancellation === 're-enabled') {
			await ref.current!.setFocus();
			expect(focusedControl()).toBe(trigger().element());
		}
		expect(selected).not.toHaveBeenCalled();
	});

	it.each(MENU_FOCUS_DESTINATIONS)('settles inside a shadow root before %s', async key => {
		const shell = document.createElement('div');
		document.body.append(shell);
		const container = document.createElement('div');
		shell.attachShadow({ mode: 'open' }).append(container);
		const ref = createRef<IActionMenuHandle>();
		const screen = await render(
			<>
				<KvActionMenu ref={ref} accessibleLabel={MENU_NAME} items={MENU_SHAPES[0].items} />
				<button type="button">Save topic</button>
			</>,
			{ container }
		);
		await whenAllKelvinReady(container);
		let done = false;
		void ref.current!.setFocus().then(() => (done = true));
		await nextFrames();
		expect(done).toBe(true);
		const inner = triggerHost(container).shadowRoot!.querySelector('kv-action-button')!.shadowRoot!.querySelector('[part="button"]');
		expect(focusedControl()).toBe(inner);
		await userEvent.keyboard(key === 'Tab' ? '{Tab}' : '{Enter}');
		if (key === 'Enter') await expectMenuFocus('move-up');
		else await expect.poll(() => focusedControl()?.textContent).toBe('Save topic');
		expect(getComputedStyle(panels()[0]).display).toBe(key === 'Tab' ? 'none' : 'flex');
		await screen.unmount();
		shell.remove();
	});
});

describe('menu state', () => {
	it('keeps a disabled trigger out of Tab order and refuses focus or activation', async () => {
		const { ref, selected } = await renderMenu(undefined, { disabled: true });
		(brokerField().element() as HTMLInputElement).focus();
		await expect(ref.current!.setFocus()).resolves.toBe(false);
		expect(focusedControl()).toBe(brokerField().element());
		await expect.element(trigger()).toHaveAttribute('aria-disabled', 'true');
		await userEvent.keyboard('{Tab}');
		await expect.poll(focusedControl).toBe(saveButton().element());
		(trigger().element() as HTMLElement).click();
		await expectClosed();
		expect(selected).not.toHaveBeenCalled();
	});

	it('supports triggerTabIndex=-1 while keeping setFocus', async () => {
		const { ref } = await renderMenu(undefined, { triggerTabIndex: -1 });
		(brokerField().element() as HTMLInputElement).focus();
		await userEvent.keyboard('{Tab}');
		await expect.poll(focusedControl).toBe(saveButton().element());
		await ref.current!.setFocus();
		expect(focusedControl()).toBe(trigger().element());
	});

	it('keeps the focused action across a reorder', async () => {
		const { ref, rerender, selected } = await renderMenu();
		await openMenu(ref);
		await expectMenuFocus('move-up');
		const [moveUp, moveDown, remove] = MENU_SHAPES[0].items;
		await rerender([remove, moveDown, moveUp]);
		await expectMenuFocus('move-up');
		await userEvent.keyboard('{ArrowDown}');
		await expectMenuFocus('remove');
		expect(selected).not.toHaveBeenCalled();
	});

	it.each(MENU_SHAPES.filter(row => ['first disabled', 'all disabled', 'empty'].includes(row.name)))('repairs focus when an update leaves $name', async row => {
		const { ref, rerender, selected } = await renderMenu();
		await openMenu(ref);
		await expectMenuFocus('move-up');
		await rerender(row.items);
		await expectMenuFocus(row.first);
		expect(selected).not.toHaveBeenCalled();
	});

	it('keeps the focused action when ids collide with separator keys', async () => {
		const { ref, rerender } = await renderMenu(MENU_ID_COLLISION.before);
		await openMenu(ref);
		await expectMenuFocus('copy');
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');
		await expectMenuFocus('move-separator');
		const focused = document.activeElement as HTMLElement;
		await rerender(MENU_ID_COLLISION.after);
		await expectMenuFocus('move-separator');
		expect(document.activeElement).toBe(focused);
		expect(Array.from(panels()[0].querySelectorAll('[role="menuitem"]'), item => item.textContent)).toEqual(MENU_ID_COLLISION.after.map(item => item.label));
	});

	it('closes when the trigger becomes disabled', async () => {
		const { ref, rerender, selected } = await renderMenu();
		await openMenu(ref);
		await expectMenuFocus('move-up');
		await rerender(undefined, { disabled: true });
		await expectClosed();
		expect(selected).not.toHaveBeenCalled();
	});

	it('closes on an outside click and leaves focus where the click put it', async () => {
		const { ref, selected } = await renderMenu();
		await openMenu(ref);
		await expectMenuFocus('move-up');
		await userEvent.click(saveButton());
		await expectClosed();
		expect(focusedControl()).toBe(saveButton().element());
		expect(selected).not.toHaveBeenCalled();
	});

	it('toggles closed from the trigger', async () => {
		const { selected } = await renderMenu();
		await userEvent.click(trigger());
		await expectMenuFocus('move-up');
		await userEvent.click(trigger());
		await expectClosed();
		await expect.poll(focusedControl).toBe(trigger().element());
		expect(selected).not.toHaveBeenCalled();
	});

	it('keeps instances independent and removes their body portals on unmount', async () => {
		const first = createRef<IActionMenuHandle>();
		const second = createRef<IActionMenuHandle>();
		const Menus = ({ withFirst }: { withFirst: boolean }) => (
			<>
				{withFirst && <KvActionMenu ref={first} accessibleLabel={MENU_NAME} items={MENU_SHAPES[0].items} />}
				<KvActionMenu ref={second} accessibleLabel="Topic 2 actions" items={MENU_SHAPES[0].items} />
			</>
		);
		const screen = await render(<Menus withFirst />);
		await whenAllKelvinReady(screen.container);
		await openMenu(first);
		await expectMenuFocus('move-up');
		await screen.rerender(<Menus withFirst={false} />);
		await expect.poll(() => panels().length).toBe(1);
		await userEvent.click(trigger('Topic 2 actions'));
		await expectMenuFocus('move-up');
		await screen.unmount();
		await expect.poll(() => panels().length).toBe(0);
		await expect.poll(() => document.querySelectorAll('kv-portal').length).toBe(0);
	});
});

describe.each(MENU_ROW_MOVE_STATES)('keyed row move: %s', state => {
	it('keeps the same menu focusable and able to reopen', async () => {
		const ref = createRef<IActionMenuHandle>();
		const selected = vi.fn();
		const TopicRows = () => {
			const [ids, setIds] = useState(['topic-1', 'topic-2']);
			const move = () => setIds(['topic-2', 'topic-1']);
			return (
				<>
					<input aria-label="Broker host" />
					{/* Above the rows, so the open menu, which opens downward, can't cover it */}
					<button type="button" onClick={move}>
						Move Topic 1
					</button>
					{ids.map(id => (
						<div key={id} data-topic={id}>
							<KvActionMenu
								ref={id === 'topic-1' ? ref : undefined}
								accessibleLabel={id === 'topic-1' ? MENU_NAME : 'Topic 2 actions'}
								items={MENU_SHAPES[0].items}
								onItemSelected={id => {
									selected(id);
									move();
								}}
							/>
						</div>
					))}
				</>
			);
		};
		const screen = await render(<TopicRows />);
		await whenAllKelvinReady(screen.container);
		const original = ref.current;
		if (state !== 'closed') {
			await openMenu(ref);
			await expectMenuFocus('move-up');
		}
		if (state === 'selection') await userEvent.keyboard('{Enter}');
		else await userEvent.click(page.getByRole('button', { name: 'Move Topic 1', exact: true }));
		await expect.poll(() => screen.container.querySelector('[data-topic]')?.getAttribute('data-topic')).toBe('topic-2');
		expect(ref.current).toBe(original);
		await ref.current!.setFocus();
		expect(focusedControl()).toBe(trigger().element());
		await expectClosed();
		await userEvent.keyboard('{Enter}');
		await expectMenuFocus('move-up');
		await expect.element(menuItem('Move up')).toBeVisible();
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => selected.mock.calls.length).toBe(state === 'selection' ? 2 : 1);
		await screen.unmount();
		await expect.poll(() => document.querySelectorAll('kv-portal').length).toBe(0);
		await expect.poll(() => panels().length).toBe(0);
	});
});
