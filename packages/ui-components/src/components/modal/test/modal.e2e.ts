import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Modal (end-to-end)', () => {
	let page: E2EPage;

	describe('when rendering with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent(`<kv-modal modal-title="Modal Test">
				<div className="header">This is a modal header</div>
				<div className="body">This is a modal body</div>
				<div className="footer">This is a modal footer</div>
			</kv-modal>`);
		});

		it('should render a title', async () => {
			const labelEl = await page.find('kv-modal >>> .title');
			expect(labelEl).toBeTruthy();
		});

		describe('and user clicks on the close button', () => {
			let spyCloseEvent: EventSpy;
			let modalElement: E2EElement;

			beforeEach(async () => {
				modalElement = await page.find('kv-modal');
				spyCloseEvent = await modalElement.spyOnEvent('clickCloseButton');

				const closeBtn = await page.find('kv-modal >>> .close');
				await closeBtn.click();
				await page.waitForTimeout(300);
			});

			it('should emit state change with value `true`', () => {
				expect(spyCloseEvent).toHaveReceivedEvent();
			});
		});
	});
});
