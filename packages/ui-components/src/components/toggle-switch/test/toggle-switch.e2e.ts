import { newE2EPage } from '@stencil/core/testing';

describe('toggle switch radio-family consumer', () => {
	it('keeps its text buttons and emits one existing value per click', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-toggle-switch></kv-toggle-switch>');
		await page.evaluate(() => {
			const group = document.querySelector('kv-toggle-switch');
			group.options = [
				{ value: 'telemetry', label: 'Telemetry' },
				{ value: 'alarms', label: 'Alarms' }
			];
			group.selectedOption = 'alarms';
			group.addEventListener('checkedChange', (event: CustomEvent<string>) => {
				group.selectedOption = event.detail;
			});
		});
		await page.waitForChanges();
		const spy = await (await page.find('kv-toggle-switch')).spyOnEvent('checkedChange');
		await (await page.find('kv-toggle-switch >>> [part="toggle-button"]')).click();
		await page.waitForChanges();
		expect(spy.events).toHaveLength(1);
		expect(spy.lastEvent.detail).toBe('telemetry');
		expect(await page.evaluate(() => document.querySelector('kv-toggle-switch').selectedOption)).toBe('telemetry');
	});
});
