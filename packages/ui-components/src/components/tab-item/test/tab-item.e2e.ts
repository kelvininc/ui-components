import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Tab Item (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with required props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tab-item tab-key="dashboard" label="Dashboard"></kv-tab-item>');
		});

		it('should render a label', async () => {
			const labelEl = await page.find('kv-tab-item >>> .label');
			expect(labelEl.innerText).toContain('Dashboard');
		});

		describe('and the user clicks on the tab', () => {
			let tabClickSpy: EventSpy;
			let tabEl: E2EElement;

			beforeEach(async () => {
				tabEl = await page.find('kv-tab-item');
				tabClickSpy = await tabEl.spyOnEvent('tabSelected');

				const tabContainerEl = await page.find('kv-tab-item >>> .tab-item-container');
				await tabContainerEl.click();

				await new Promise(r => setTimeout(r, 300));
			});

			it(`should emit the tab's key (tabKey)`, () => {
				expect(tabClickSpy).toHaveReceivedEventDetail('dashboard');
			});
		});
	});

	describe('when rendering with disabled attribute', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tab-item tab-key="dashboard" label="Dashboard" disabled></kv-tab-item>');
		});

		describe('and the user clicks on the tab', () => {
			let tabClickSpy: EventSpy;
			let tabEl: E2EElement;

			beforeEach(async () => {
				tabEl = await page.find('kv-tab-item');
				tabClickSpy = await tabEl.spyOnEvent('tabSelected');

				const tabContainerEl = await page.find('kv-tab-item >>> .tab-item-container');
				await tabContainerEl.click();

				await new Promise(r => setTimeout(r, 300));
			});

			it(`should not emit the tab's key (tabKey)`, () => {
				expect(tabClickSpy).not.toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with has-notification attribute', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tab-item tab-key="dashboard" label="Dashboard" has-notification></kv-tab-item>');
		});

		it('should render the notification dot', async () => {
			const dotEl = await page.find('kv-tab-item >>> .notification-dot');
			expect(dotEl).toBeTruthy();
		});
	});
});
