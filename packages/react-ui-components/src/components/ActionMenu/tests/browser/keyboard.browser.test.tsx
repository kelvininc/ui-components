import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { MENU_ACTIVATION_KEYS, MENU_NAVIGATION_KEYS, MENU_OPEN_KEYS, MENU_SHAPES, MENU_TAB_SHAPES } from '../../test-utils/matrix';
import {
	brokerField,
	expectClosed,
	expectMenuFocus,
	focusTrigger,
	focusedControl,
	menuItem,
	openMenu,
	panels,
	pressRepeated,
	renderMenu,
	saveButton,
	trigger
} from '../../test-utils/render';

const KEYS: Record<string, string> = { Enter: '{Enter}', Space: '[Space]', ArrowDown: '{ArrowDown}', ArrowUp: '{ArrowUp}', Home: '{Home}', End: '{End}' };
const KEY_VALUES: Record<string, string> = { Enter: 'Enter', Space: ' ' };

describe.each(MENU_OPEN_KEYS)('menu opens with %s', key => {
	it.each(MENU_SHAPES)('focuses the first enabled action for $name', async row => {
		const { ref, selected } = await renderMenu(row.items);
		await openMenu(ref, KEYS[key]);
		await expectMenuFocus(row.first);
		await expect.element(trigger()).toHaveAttribute('aria-haspopup', 'menu');
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true');
		expect(selected).not.toHaveBeenCalled();
	});
});

describe.each(MENU_SHAPES)('menu keyboard: $name', row => {
	it('skips disabled actions, wraps and honors Home and End without choosing', async () => {
		const { ref, selected } = await renderMenu(row.items);
		await openMenu(ref);
		await expectMenuFocus(row.first);
		for (const [index, key] of MENU_NAVIGATION_KEYS.entries()) {
			await userEvent.keyboard(KEYS[key]);
			await expectMenuFocus(row.navigation[index]);
		}
		expect(selected).not.toHaveBeenCalled();
	});

	it('closes with Escape and returns to the trigger', async () => {
		const { ref, selected } = await renderMenu(row.items);
		await openMenu(ref);
		await expectMenuFocus(row.first);
		await userEvent.keyboard('{Escape}');
		await expectClosed();
		await expect.poll(focusedControl).toBe(trigger().element());
		expect(selected).not.toHaveBeenCalled();
	});
});

describe.each(MENU_TAB_SHAPES)('menu Tab: $name', row => {
	it.each([false, true])('closes and moves to the adjacent field; reverse=%s', async reverse => {
		const { ref, selected } = await renderMenu(row.items);
		await openMenu(ref);
		await expectMenuFocus(row.first);
		await userEvent.keyboard(reverse ? '{Shift>}{Tab}{/Shift}' : '{Tab}');
		await expectClosed();
		await expect.poll(focusedControl).toBe((reverse ? brokerField() : saveButton()).element());
		expect(selected).not.toHaveBeenCalled();
	});
});

describe('menu activation', () => {
	it.each([...MENU_ACTIVATION_KEYS, 'mouse'] as const)('chooses once with %s and never submits the form', async key => {
		const { ref, selected, submitted } = await renderMenu(MENU_SHAPES[1].items);
		await openMenu(ref);
		await expectMenuFocus('move-down');
		if (key === 'mouse') await userEvent.click(menuItem('Move down'));
		else await userEvent.keyboard(KEYS[key]);
		await expect.poll(() => selected.mock.calls).toEqual([['move-down']]);
		await expectClosed();
		await expect.poll(focusedControl).toBe(trigger().element());
		expect(submitted).not.toHaveBeenCalled();
	});

	it.each(MENU_ACTIVATION_KEYS)('chooses once when %s is held and does not reopen', async key => {
		const { ref, selected } = await renderMenu();
		await openMenu(ref);
		await expectMenuFocus('move-up');
		await userEvent.keyboard(KEYS[key]);
		await expect.poll(focusedControl).toBe(trigger().element());
		pressRepeated(KEY_VALUES[key]);
		pressRepeated(KEY_VALUES[key]);
		await expect.poll(() => selected.mock.calls).toEqual([['move-up']]);
		await expectClosed();
	});

	it('keeps disabled actions visible and refuses mouse selection', async () => {
		const { ref, selected } = await renderMenu(MENU_SHAPES[1].items);
		await openMenu(ref);
		await expectMenuFocus('move-down');
		const disabled = menuItem('Move up');
		await expect.element(disabled).toHaveAttribute('aria-disabled', 'true');
		await userEvent.click(disabled, { force: true });
		expect(selected).not.toHaveBeenCalled();
		await expect.element(trigger()).toHaveAttribute('aria-expanded', 'true');
	});

	it('lets the selection handler choose the final focus destination', async () => {
		const { ref, selected } = await renderMenu();
		selected.mockImplementation(() => (brokerField().element() as HTMLInputElement).focus());
		await openMenu(ref);
		await expectMenuFocus('move-up');
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => selected.mock.calls.length).toBe(1);
		await expect.poll(focusedControl).toBe(brokerField().element());
	});

	it('refuses activation while closed', async () => {
		const { selected } = await renderMenu();
		panels()[0].querySelector<HTMLButtonElement>('[data-action-id="move-up"]')!.click();
		expect(selected).not.toHaveBeenCalled();
	});

	it('passes modified shortcuts on the trigger and the actions through', async () => {
		const { ref, selected } = await renderMenu();
		await focusTrigger(ref);
		await userEvent.keyboard('{Control>}{ArrowDown}{/Control}');
		await expectClosed();
		await openMenu(ref);
		await expectMenuFocus('move-up');
		let shortcutReached: boolean | undefined;
		const onShortcut = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && event.ctrlKey) shortcutReached = !event.defaultPrevented;
		};
		document.addEventListener('keydown', onShortcut);
		await userEvent.keyboard('{Control>}{Enter}{/Control}');
		document.removeEventListener('keydown', onShortcut);
		expect(shortcutReached).toBe(true);
		expect(selected).not.toHaveBeenCalled();
		await expectMenuFocus('move-up');
	});
});
