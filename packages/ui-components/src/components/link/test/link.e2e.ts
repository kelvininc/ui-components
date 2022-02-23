import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('KvLink (end-to-end)', () => {
	let page: E2EPage;
	let labelEl: E2EElement;
	let subtitleEl: E2EElement;

	describe('when rendering only with label', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-link label='Hello'></kv-link>`);
		});

		it('should render the label', async () => {
			labelEl = await page.find('kv-link >>> .label');
			expect(labelEl.innerText).toEqual('Hello');
		});

		describe('and the user clicks the label', () => {
			let spyClickEvt: EventSpy;
			let hostEl: E2EElement;

			beforeEach(async () => {
				hostEl = await page.find('kv-link');
				labelEl = await page.find('kv-link >>> .label');
				spyClickEvt = await hostEl.spyOnEvent('labelClick');
				await labelEl.click();
			});

			it('should emit an event', () => {
				expect(spyClickEvt).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with label and subtitle', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-link label='Hello' subtitle='World'></kv-link>`);
			labelEl = await page.find('kv-link >>> .label');
			subtitleEl = await page.find('kv-link >>> .subtitle');
		});

		it('should render the label and subtitle', async () => {
			expect(labelEl.innerText).toEqual('Hello');
			expect(subtitleEl.innerText).toEqual('World');
		});
	});

	describe('when rendering with label, subtitle and link', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-link label='Hello' subtitle='World' href='https://kelvin.ai'></kv-link>`);
			labelEl = await page.find('kv-link >>> .label');
			subtitleEl = await page.find('kv-link >>> .subtitle');
		});

		it('should render the label and subtitle', async () => {
			expect(labelEl.innerText).toEqual('Hello');
			expect(subtitleEl.innerText).toEqual('World');
		});

		it('should set the correct href attribute', () => {
			expect(labelEl.getAttribute('href')).toEqual('https://kelvin.ai');
		});
	});
});
