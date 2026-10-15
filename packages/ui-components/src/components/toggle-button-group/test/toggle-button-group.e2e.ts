import { E2EPage, newE2EPage } from '@stencil/core/testing';
import { ERadioControlType } from '../../radio/radio.types';

describe('toggle group keyboard behavior', () => {
	let page: E2EPage;
	const render = async (type: ERadioControlType) => {
		page = await newE2EPage();
		await page.setContent(
			'<button id="before">Before</button><kv-toggle-button-group with-radio aria-label="Topics"></kv-toggle-button-group><button id="after">After</button>'
		);
		await page.evaluate(type => {
			const group = document.querySelector('kv-toggle-button-group');
			group.buttons = [
				{ value: 'telemetry', label: 'Telemetry' },
				{ value: 'alarms', label: 'Alarms', disabled: true },
				{ value: 'commands', label: 'Commands' }
			];
			group.radioControlType = type;
			group.selectedButtons = { telemetry: true };
			group.addEventListener('checkedChange', (event: CustomEvent<string>) => {
				group.selectedButtons = type === 'radio' ? { [event.detail]: true } : { ...group.selectedButtons, [event.detail]: !group.selectedButtons[event.detail] };
			});
		}, type);
		await page.waitForChanges();
	};
	const focusName = () =>
		page.evaluate(() => {
			let active = document.activeElement;
			while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
			return active?.getAttribute('aria-label') ?? active?.id;
		});

	it('uses one radio Tab stop and moves selection and focus with wrapping arrows', async () => {
		await render(ERadioControlType.Radio);
		expect(await page.$('aria/Topics[role="radiogroup"]')).not.toBeNull();
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('Telemetry');
		await page.keyboard.press('ArrowRight');
		await page.waitForChanges();
		expect(await focusName()).toBe('Commands');
		expect(await page.evaluate(() => document.querySelector('kv-toggle-button-group').selectedButtons)).toEqual({ commands: true });
		await page.keyboard.press('ArrowDown');
		await page.waitForChanges();
		expect(await focusName()).toBe('Telemetry');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('after');
	});

	it('gives each enabled checkbox a Tab stop and toggles once while Space is held', async () => {
		await render(ERadioControlType.Checkbox);
		expect((await page.find('kv-toggle-button-group')).getAttribute('role')).toBeNull();
		const spy = await (await page.find('kv-toggle-button-group')).spyOnEvent('checkedChange');
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('Telemetry');
		await page.keyboard.down('Space');
		await page.keyboard.down('Space');
		await page.keyboard.up('Space');
		await page.waitForChanges();
		expect(spy.events).toHaveLength(1);
		expect(spy.lastEvent.detail).toBe('telemetry');
		expect(await page.evaluate(() => document.querySelector('kv-toggle-button-group').selectedButtons.telemetry)).toBe(false);
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('Commands');
		await page.keyboard.press('Space');
		await page.waitForChanges();
		expect(spy.events).toHaveLength(2);
		expect(await page.evaluate(() => document.querySelector('kv-toggle-button-group').selectedButtons.commands)).toBe(true);
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('after');
	});
});
