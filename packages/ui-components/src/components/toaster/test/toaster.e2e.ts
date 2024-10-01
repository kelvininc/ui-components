import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('kv-toaster', () => {
	let page: E2EPage;

	it('renders', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-toaster></kv-toaster>');

		const element = await page.find('kv-toaster');
		expect(element).toHaveClass('hydrated');
	});

	describe('when renders with main message', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-toaster header="Test to the Header" type="error"></kv-toaster>');
		});

		describe('when reset button is clicked', () => {
			let spyResetEvent: EventSpy;

			beforeEach(async () => {
				const toasterComponent = await page.find('kv-toaster');
				spyResetEvent = await toasterComponent.spyOnEvent('clickCloseButton');

				// waiting for css animation to end
				await new Promise(r => setTimeout(r, 600));

				const resetIcon = await page.find('kv-toaster >>> .toaster-close-icon');
				await resetIcon.click();
			});

			it('should emit click event', () => {
				expect(spyResetEvent).toHaveReceivedEvent();
			});
		});
	});
});
