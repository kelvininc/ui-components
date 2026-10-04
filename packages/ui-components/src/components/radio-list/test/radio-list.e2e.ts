import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('radio list keyboard behavior', () => {
	let page: E2EPage;
	const render = async (selected = 'telemetry', disabled: Record<string, boolean> = { alarms: true }, descriptions = false) => {
		page = await newE2EPage();
		await page.setContent('<button id="before">Before</button><kv-radio-list label="Topics" required></kv-radio-list><button id="after">After</button>');
		await page.evaluate(
			(selected, disabled, descriptions) => {
				const list = document.querySelector('kv-radio-list');
				list.options = [
					{ optionId: 'telemetry', label: 'Telemetry', description: descriptions ? 'Read the [documentation](https://docs.kelvininc.com).' : undefined },
					{ optionId: 'alarms', label: 'Alarms' },
					{ optionId: 'commands', label: 'Commands' }
				];
				list.selectedOption = selected;
				list.disabledOptions = disabled;
				list.addEventListener('optionSelected', (event: CustomEvent<string>) => {
					list.selectedOption = event.detail;
				});
			},
			selected,
			disabled,
			descriptions
		);
		await page.waitForChanges();
	};
	const focusName = () =>
		page.evaluate(() => {
			let active = document.activeElement;
			while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
			return active?.getAttribute('aria-label') ?? active?.id;
		});

	it('uses a named group, skips disabled radios, wraps and exposes one radio Tab stop', async () => {
		await render();
		expect(await page.$('aria/Topics[role="radiogroup"]')).not.toBeNull();
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('Telemetry');
		await page.keyboard.press('ArrowRight');
		await page.waitForChanges();
		expect(await focusName()).toBe('Commands');
		expect(await page.evaluate(() => document.querySelector('kv-radio-list').selectedOption)).toBe('commands');
		await page.keyboard.press('ArrowDown');
		await page.waitForChanges();
		expect(await focusName()).toBe('Telemetry');
		await page.keyboard.press('ArrowLeft');
		await page.waitForChanges();
		expect(await focusName()).toBe('Commands');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('after');
		await page.keyboard.down('Shift');
		await page.keyboard.press('Tab');
		await page.keyboard.up('Shift');
		expect(await focusName()).toBe('Commands');
	});

	it('starts at the first enabled radio when the selected one is disabled', async () => {
		await render('alarms');
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('Telemetry');
	});

	it('ignores documentation-link arrows and modified radio arrows', async () => {
		await render('telemetry', {}, true);
		const spy = await (await page.find('kv-radio-list')).spyOnEvent('optionSelected');
		const link = await page.$('aria/documentation[role="link"]');
		await link.focus();
		await page.keyboard.press('ArrowRight');
		await page.waitForChanges();
		expect(spy.events).toHaveLength(0);
		await (await page.$('aria/Telemetry[role="radio"]')).focus();
		await page.keyboard.down('Control');
		await page.keyboard.press('ArrowRight');
		await page.keyboard.up('Control');
		await page.waitForChanges();
		expect(spy.events).toHaveLength(0);
		expect(await focusName()).toBe('Telemetry');
	});

	it('emits one selection when the radio circle is clicked', async () => {
		await render();
		const spy = await (await page.find('kv-radio-list')).spyOnEvent('optionSelected');
		await (await page.$('aria/Commands[role="radio"]')).click();
		await page.waitForChanges();
		expect(spy.events).toHaveLength(1);
		expect(spy.lastEvent.detail).toBe('commands');
	});

	it('skips an all-disabled group in the Tab order', async () => {
		await render('telemetry', { telemetry: true, alarms: true, commands: true });
		await page.focus('#before');
		await page.keyboard.press('Tab');
		expect(await focusName()).toBe('after');
	});
});
