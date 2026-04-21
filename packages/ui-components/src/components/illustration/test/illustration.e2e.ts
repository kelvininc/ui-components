import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Illustration (end-to-end)', () => {
	let page: E2EPage;

	describe('when has custom classes', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-illustration name="kv-no-data-available" custom-class="illustration-full-size"></kv-illustration>');
			await page.waitForChanges();
		});

		it('should render the <kv-no-data-available> with custom classes', async () => {
			const illustration = await page.find('kv-illustration >>> kv-no-data-available');
			expect(illustration.getAttribute('customClass').toLocaleLowerCase()).toBe('illustration-full-size');
		});
	});
});
