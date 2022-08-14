import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Modal (end-to-end)', () => {
	let page: E2EPage;
	let hostEl: E2EElement;
	let overlayEl: E2EElement;
	let closeBtnEl: E2EElement;

	let spyCloseEvent: EventSpy;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-modal></kv-modal>');
			hostEl = await page.find('kv-modal');
			overlayEl = await page.find('kv-modal >>> .modal-overlay');
			closeBtnEl = await page.find('kv-modal >>> .close');
		});

		it('should render the modal with a backdrop', async () => {
			expect(overlayEl).toBeTruthy();
		});

		it('should render the modal with a close button', () => {
			expect(closeBtnEl).toBeTruthy();
		});

		describe('and the user clicks on the close button', () => {
			beforeEach(async () => {
				spyCloseEvent = await hostEl.spyOnEvent('clickClose');
				await closeBtnEl.click();
			});

			it('should emit the close event', () => {
				expect(spyCloseEvent).toHaveReceivedEvent();
			});
		});

		describe('and the user clicks outside the modal body', () => {
			beforeEach(async () => {
				spyCloseEvent = await hostEl.spyOnEvent('clickClose');
				await overlayEl.click({ offset: { x: 0, y: 0 } });
			});

			it('should emit the close event', () => {
				expect(spyCloseEvent).toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with closable prop false', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-modal closable="false"></kv-modal>');
			hostEl = await page.find('kv-modal');
			overlayEl = await page.find('kv-modal >>> .modal-overlay');
			closeBtnEl = await page.find('kv-modal >>> .close');
		});

		it('should not render the close button', () => {
			expect(closeBtnEl).toBeNull();
		});

		describe('and the user clicks outside the modal body', () => {
			beforeEach(async () => {
				spyCloseEvent = await hostEl.spyOnEvent('clickClose');
				await overlayEl.click({ offset: { x: 0, y: 0 } });
			});

			it('should not emit the close event', () => {
				expect(spyCloseEvent).not.toHaveReceivedEvent();
			});
		});
	});

	describe('when rendering with a title', () => {
		let headerTitleEl: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-modal header-title="Banana"></kv-modal>');
			headerTitleEl = await page.find('kv-modal >>> .title');
		});

		it('should render the label correctly', () => {
			expect(headerTitleEl.innerText).toContain('Banana');
		});
	});
});