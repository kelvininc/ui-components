import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { ACTION_BUTTON_CONSUMERS } from './action-button.mock';

async function renderConsumer(row: (typeof ACTION_BUTTON_CONSUMERS)[number]): Promise<E2EPage> {
	const page = await newE2EPage();
	await page.setContent(row.html);
	const host = await page.find(row.tag);
	for (const [name, value] of Object.entries(row.props ?? {})) host.setProperty(name, value);
	if (row.setup === 'option-action') {
		await page.evaluate(() => {
			const option = document.querySelector('kv-select-option');
			option.action = {
				icon: 'kv-close' as typeof option.action.icon,
				accessibleLabel: 'Remove compressor',
				onClick: () => (document.body.dataset.optionAction = 'clicked')
			};
		});
	}
	if (row.setup === 'edit') {
		await page.focus('.inline-editable-field-slot');
		await page.evaluate(() => {
			const editor = document.querySelector<HTMLElement>('.inline-editable-field-slot');
			editor.innerText = 'Updated connection';
			editor.dispatchEvent(new Event('input', { bubbles: true }));
		});
	}
	await page.waitForChanges();
	return page;
}

describe('action button consumers', () => {
	it.each(ACTION_BUTTON_CONSUMERS.flatMap(row => (['Enter', 'Space'] as const).map(key => ({ ...row, key }))))('activates $name with $key once', async row => {
		const page = await renderConsumer(row);
		const host = await page.find(row.tag);
		const parentEvent = await host.spyOnEvent(row.event);
		// Dropdown actions move into a body portal, so observe their button event there.
		const buttonEvent = await page.spyOnEvent('clickButton');
		const itemSelected = await host.spyOnEvent('itemSelected');
		const control = await page.$(`aria/${row.buttonName}[role="button"]`);
		expect(control).not.toBeNull();
		await control.focus();
		await page.keyboard.press(row.key);
		await page.waitForChanges();

		expect(buttonEvent).toHaveReceivedEventTimes(1);
		expect(parentEvent).toHaveReceivedEventTimes(1);
		expect(itemSelected).not.toHaveReceivedEvent();
		expect(
			await page.evaluate(() => ({
				optionAction: document.body.dataset.optionAction,
				editorContent: document.querySelector<HTMLElement>('.inline-editable-field-slot')?.innerText,
				dropdownOpen: document.querySelector('kv-absolute-time-picker-dropdown')?.dropdownOpen,
				timePickerOpen: document.querySelector('kv-time-picker')?.isOpen
			}))
		).toEqual({
			optionAction: row.setup === 'option-action' ? 'clicked' : undefined,
			editorContent: row.name === 'inline discard' ? 'Connection' : row.name === 'inline save' ? 'Updated connection' : undefined,
			dropdownOpen: row.name === 'absolute dropdown cancel' ? false : undefined,
			timePickerOpen: row.name === 'time picker cancel' ? false : undefined
		});
		expect(parentEvent.events.filter(event => event.type === 'contentEdited').map(event => event.detail)).toEqual(row.name === 'inline save' ? ['Updated connection'] : []);
	});

	it('passes Ctrl+Enter from an editing action to the page without saving', async () => {
		const row = ACTION_BUTTON_CONSUMERS.find(row => row.name === 'inline save');
		const page = await renderConsumer(row);
		const host = await page.find(row.tag);
		const saved = await host.spyOnEvent('contentEdited');
		await page.evaluate(() =>
			document.addEventListener('keydown', event => {
				if (event.key === 'Enter') document.body.dataset.shortcut = String(event.ctrlKey && !event.defaultPrevented);
			})
		);
		const control = await page.$('aria/Save changes[role="button"]');
		expect(control).not.toBeNull();
		await control.focus();
		await page.keyboard.down('Control');
		await page.keyboard.press('Enter');
		await page.keyboard.up('Control');
		await page.waitForChanges();

		expect(saved).not.toHaveReceivedEvent();
		expect(await page.evaluate(() => document.body.dataset.shortcut)).toBe('true');
	});
});
