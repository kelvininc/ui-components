import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { DESCRIPTION_CONSUMERS } from './accessible-description.matrix';

type Consumer = (typeof DESCRIPTION_CONSUMERS)[number];
type DescribedElement = Element & { ariaDescribedByElements: readonly Element[] | null };

const setDescription = (page: E2EPage, row: Consumer, id?: string, empty = false) =>
	page.evaluate(
		({ tag, mode, label, id, empty }) => {
			const references = id ? [document.getElementById(id)] : empty ? [] : undefined;
			const host = document.querySelector(tag);
			if (mode === 'input') {
				(host as HTMLKvDropdownElement).inputConfig = { accessibleLabel: label, accessibleDescriptionElements: references };
			} else if (mode === 'buttons') {
				(host as HTMLKvToggleButtonGroupElement).buttons = [{ value: 'telemetry', label: 'Telemetry', accessibleDescriptionElements: references }];
			} else if (mode === 'options') {
				if (tag === 'kv-radio-list') {
					(host as HTMLKvRadioListElement).options = [{ optionId: 'telemetry', label: 'Telemetry', accessibleDescriptionElements: references }];
				} else {
					(host as HTMLKvToggleSwitchElement).options = [{ value: 'telemetry', label: 'Telemetry', accessibleDescriptionElements: references }];
				}
			} else {
				(host as HTMLKvTextFieldElement).accessibleDescriptionElements = references;
			}
		},
		{ tag: row.tag, mode: row.mode, label: row.label, id, empty }
	);

const expectDescription = async (page: E2EPage, row: Consumer, id?: string) => {
	const control = await page.$(`aria/${row.label}[role="${row.role}"]`);
	expect(control).not.toBeNull();
	expect(
		await control.evaluate((element, id) => {
			const expected = id ? document.getElementById(id) : undefined;
			const references = (element as DescribedElement).ariaDescribedByElements ?? [];
			return references.length === (expected ? 1 : 0) && (!expected || references[0] === expected);
		}, id)
	).toBe(true);
	const snapshot = await page.accessibility.snapshot({ root: control });
	expect(snapshot?.description ?? '').toBe(id === 'errors' ? 'Broker host is required.' : id === 'replacement' ? 'Broker host is unavailable.' : '');
};

describe.each(DESCRIPTION_CONSUMERS)('accessible description consumer: $name', row => {
	it('updates and clears the actual control reference and native AX description', async () => {
		const page = await newE2EPage();
		await page.setContent(`<div id="errors"><kv-form-help-text></kv-form-help-text></div><p id="replacement">Broker host is unavailable.</p>${row.markup}`);
		await page.evaluate(() => (document.querySelector<HTMLKvFormHelpTextElement>('#errors kv-form-help-text').helpText = ['Broker host is required.']));
		await setDescription(page, row, 'errors');
		await page.waitForChanges();
		await expectDescription(page, row, 'errors');
		await setDescription(page, row, 'replacement');
		await page.waitForChanges();
		await expectDescription(page, row, 'replacement');
		await setDescription(page, row, undefined, true);
		await page.waitForChanges();
		await expectDescription(page, row);
		await setDescription(page, row, 'errors');
		await page.waitForChanges();
		await setDescription(page, row);
		await page.waitForChanges();
		await expectDescription(page, row);
	});
});

describe('accessible description control lifetime', () => {
	it('accepts a description element without an ID', async () => {
		const page = await newE2EPage();
		await page.setContent('<p>Broker host is required.</p><kv-text-field accessible-label="Broker"></kv-text-field>');
		await page.evaluate(() => (document.querySelector('kv-text-field').accessibleDescriptionElements = [document.querySelector('p')]));
		await page.waitForChanges();
		const control = await page.$('aria/Broker[role="textbox"]');
		expect(await control.evaluate(element => (element as DescribedElement).ariaDescribedByElements[0] === document.querySelector('p'))).toBe(true);
		expect((await page.accessibility.snapshot({ root: control }))?.description).toBe('Broker host is required.');
	});

	it('describes a replacement text input after loading finishes', async () => {
		const page = await newE2EPage();
		const row = DESCRIPTION_CONSUMERS[0];
		await page.setContent('<p id="errors">Broker host is required.</p><kv-text-field accessible-label="Broker" loading></kv-text-field>');
		await setDescription(page, row, 'errors');
		const host = await page.find('kv-text-field');
		host.setProperty('loading', false);
		await page.waitForChanges();
		await expectDescription(page, row, 'errors');
		host.setProperty('loading', true);
		await page.waitForChanges();
		host.setProperty('loading', false);
		await page.waitForChanges();
		await expectDescription(page, row, 'errors');
	});

	it('keeps a select-option checkbox named and selectable when no description is supplied', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-select-option label="Telemetry" value="telemetry" togglable></kv-select-option>');
		const selected = await (await page.find('kv-select-option')).spyOnEvent('itemSelected');
		const control = await page.$('aria/Telemetry[role="checkbox"]');
		const snapshot = await page.accessibility.snapshot({ root: control });
		expect(snapshot?.description).toBeUndefined();
		await control.focus();
		await page.keyboard.press('Space');
		await page.waitForChanges();
		expect(selected.events).toHaveLength(1);
		expect(selected.lastEvent.detail).toBe('telemetry');
	});
});

describe('accessible description baseline: searchable select', () => {
	it('keeps its search input named and undescribed while searching and selecting an option', async () => {
		const page = await newE2EPage();
		await page.setContent(
			'<kv-select searchable search-value="broker" search-placeholder="Find assets"><kv-select-option label="Telemetry" value="telemetry" togglable></kv-select-option></kv-select>'
		);
		const select = await page.find('kv-select');
		const searchChange = await select.spyOnEvent('searchChange');
		const selected = await select.spyOnEvent('itemSelected');
		await page.evaluate(() => {
			const host = document.querySelector('kv-select');
			host.addEventListener('searchChange', event => (host.searchValue = event.detail));
		});
		const input = await page.$('aria/Find assets[role="textbox"]');
		expect(input).not.toBeNull();
		const snapshot = await page.accessibility.snapshot({ root: input });
		expect(snapshot?.name).toBe('Find assets');
		expect(snapshot?.description).toBeUndefined();
		expect(await input.evaluate(element => element.getAttribute('aria-label'))).toBeNull();
		expect(await input.evaluate(element => (element as DescribedElement).ariaDescribedByElements?.length ?? 0)).toBe(0);
		await select.callMethod('focusSearch');
		expect(await input.evaluate(element => (element.getRootNode() as ShadowRoot).activeElement === element)).toBe(true);
		await page.keyboard.down('Control');
		await page.keyboard.press('KeyA');
		await page.keyboard.up('Control');
		await page.keyboard.type('telemetry');
		await page.waitForChanges();
		expect(searchChange.lastEvent.detail).toBe('telemetry');
		expect(await select.getProperty('searchValue')).toBe('telemetry');
		expect(await input.evaluate(element => (element as HTMLInputElement).value)).toBe('telemetry');
		expect((await page.accessibility.snapshot({ root: input }))?.description).toBeUndefined();
		expect(await input.evaluate(element => (element as DescribedElement).ariaDescribedByElements?.length ?? 0)).toBe(0);
		const option = await page.$('aria/Telemetry[role="checkbox"]');
		await option.focus();
		await page.keyboard.press('Space');
		await page.waitForChanges();
		expect(selected.events).toHaveLength(1);
		expect(selected.lastEvent.detail).toBe('telemetry');
	});
});

describe('accessible description caller relationship', () => {
	it.each([false, true])('restores a toggle ID description after temporary references (caller updates: %p)', async updateCaller => {
		const page = await newE2EPage();
		await page.setContent('<p id="errors">Broker host is required.</p><kv-toggle-button value="telemetry" label="Telemetry"></kv-toggle-button>');
		await page.evaluate(() => {
			const host = document.querySelector('kv-toggle-button');
			const help = document.createElement('span');
			help.id = 'telemetry-help';
			help.textContent = 'Telemetry connects to the plant broker.';
			const replacement = document.createElement('span');
			replacement.id = 'telemetry-replacement';
			replacement.textContent = 'Telemetry uses the backup broker.';
			host.shadowRoot.append(help, replacement);
			host.customAttributes = { 'aria-describedby': help.id };
		});
		await page.waitForChanges();
		const control = await page.$('aria/Telemetry[role="button"]');
		expect((await page.accessibility.snapshot({ root: control }))?.description).toBe('Telemetry connects to the plant broker.');
		await page.evaluate(() => (document.querySelector('kv-toggle-button').accessibleDescriptionElements = [document.getElementById('errors')]));
		await page.waitForChanges();
		expect((await page.accessibility.snapshot({ root: control }))?.description).toBe('Broker host is required.');
		if (updateCaller) {
			await page.evaluate(() => (document.querySelector('kv-toggle-button').customAttributes = { 'aria-describedby': 'telemetry-replacement' }));
			await page.waitForChanges();
		}
		expect((await page.accessibility.snapshot({ root: control }))?.description).toBe('Broker host is required.');
		await page.evaluate(() => (document.querySelector('kv-toggle-button').accessibleDescriptionElements = []));
		await page.waitForChanges();
		expect((await page.accessibility.snapshot({ root: control }))?.description ?? '').toBe('');
		await page.evaluate(() => (document.querySelector('kv-toggle-button').accessibleDescriptionElements = undefined));
		await page.waitForChanges();
		const expectedId = updateCaller ? 'telemetry-replacement' : 'telemetry-help';
		expect(await control.evaluate(element => element.getAttribute('aria-describedby'))).toBe(expectedId);
		expect(
			await control.evaluate(
				(element, id) => (element as DescribedElement).ariaDescribedByElements[0] === (element.getRootNode() as ShadowRoot).querySelector(`#${id}`),
				expectedId
			)
		).toBe(true);
		expect((await page.accessibility.snapshot({ root: control }))?.description).toBe(
			updateCaller ? 'Telemetry uses the backup broker.' : 'Telemetry connects to the plant broker.'
		);
	});
});
