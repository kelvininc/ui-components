import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Illustration (end-to-end)', () => {
	let page: E2EPage;

	describe('when has a name', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-illustration name="pk-es-section-somethingwentwrong"></kv-illustration>');
		});

		it('should render the <svg> with part attribute', async () => {
			const svgComponent = await page.find('kv-illustration >>> svg');
			expect(svgComponent).toBeTruthy();
			expect(svgComponent.getAttribute('part').toLocaleLowerCase()).toBe('illustration');
		});

		it('should render the <use> to symbol', async () => {
			const useComponent = await page.find('kv-illustration >>> use');
			expect(useComponent).toBeTruthy();
			expect(useComponent.getAttribute('href').toLocaleLowerCase()).toBe('/svg-symbols.svg#pk-es-section-somethingwentwrong-night');
		});
	});

	describe('when has custom classes', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-illustration name="pk-es-section-somethingwentwrong" custom-class="illustration-full-size"></kv-illustration>');
		});

		it('should render the <svg> with custom classes', async () => {
			const svgComponent = await page.find('kv-illustration >>> svg');
			expect(svgComponent).toBeTruthy();
			expect(svgComponent.getAttribute('class').toLocaleLowerCase()).toBe('illustration-full-size illustration');
		});
	});
});
