import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Illustration (end-to-end)', () => {
	let page: E2EPage;

	describe('when has custom classes', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-illustration name="kv-es-section-somethingwentwrong" custom-class="illustration-full-size"></kv-illustration>');
		});

		it('should render the <kv-es-section-somethingwentwrong> with custom classes', async () => {
			const illustration = await page.find('kv-illustration >>> kv-es-section-somethingwentwrong');
			expect(illustration.getAttribute('customClass').toLocaleLowerCase()).toBe('illustration-full-size');
		});
	});
});
