import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Modal (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with default props', () => {
		let overlayEl: E2EElement;
		let closeBtnEl: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-modal></kv-modal>');
			overlayEl = await page.find('kv-modal >>> .modal-overlay');
			closeBtnEl = await page.find('kv-modal >>> .close');
		});

		it('should render the modal with a backdrop', async () => {
			expect(overlayEl).toBeTruthy();
		});

		it('should render the modal with a close button', () => {
			expect(closeBtnEl).toBeTruthy();
		});
	});

	describe('when rendering with a label', () => {
		let labelEl: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-modal label="Banana"></kv-modal>');
			labelEl = await page.find('kv-modal >>> .title');
		});

		it('should render the label correctly', () => {
			expect(labelEl.innerText).toContain('Banana');
		});
	});
});
