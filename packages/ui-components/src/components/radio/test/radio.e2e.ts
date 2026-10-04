import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('radio control keyboard focus', () => {
	it('focuses its named control through the host and selects once on held Space', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-radio label="TLS"></kv-radio>');
		const host = await page.find('kv-radio');
		const spy = await host.spyOnEvent('checkedChange');
		expect(await page.$('aria/TLS[role="radio"]')).not.toBeNull();
		await page.evaluate(() => document.querySelector('kv-radio').focus());
		await page.keyboard.down('Space');
		await page.keyboard.down('Space');
		await page.keyboard.up('Space');
		await page.waitForChanges();
		expect(spy.events).toHaveLength(1);
	});
});

describe('Radio (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio></kv-radio>');
		});

		it('should not render a label', async () => {
			const labelEl = await page.find('kv-radio >>> .label');
			expect(labelEl).toBeFalsy();
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let radioElement: E2EElement;

			beforeEach(async () => {
				radioElement = await page.find('kv-radio');
				spyCheckedChangeEvent = await radioElement.spyOnEvent('checkedChange');

				const radioBtn = await page.find('kv-radio >>> .radio-container');
				await radioBtn.click();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should emit state change with value `true`', () => {
				expect(spyCheckedChangeEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with a label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio label="Accepted"></kv-radio>');
		});

		it('should render label', async () => {
			const labelComponent = await page.find('kv-radio >>> .label');
			expect(labelComponent).toBeTruthy();
			expect(labelComponent.innerText).toBe('Accepted');
		});
	});

	describe('when rendering with disabled prop', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-radio disabled></kv-radio>');
		});

		describe('and user clicks on the button', () => {
			let spyCheckedChangeEvent: EventSpy;
			let radioElement: E2EElement;

			beforeEach(async () => {
				radioElement = await page.find('kv-radio');
				spyCheckedChangeEvent = await radioElement.spyOnEvent('checkedChange');

				const radio = await page.find('kv-radio >>> .radio-container');
				await radio.click();
				await new Promise(r => setTimeout(r, 300));
			});

			it('should not emit `true` state', () => {
				expect(spyCheckedChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
