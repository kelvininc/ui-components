import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Svg Icon (end-to-end)', () => {
	let page: E2EPage;

	describe('when has a name', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-svg-icon name="kv-logo-kelvin"></kv-svg-icon>');
		});

		it('should render the <svg> with part attribute', async () => {
			const svgComponent = await page.find('kv-svg-icon >>> svg');
			expect(svgComponent).toBeTruthy();
			expect(svgComponent.getAttribute('part').toLocaleLowerCase()).toBe('icon');
		});

		it('should render the <use> to symbol', async () => {
			const useComponent = await page.find('kv-svg-icon >>> use');
			expect(useComponent).toBeTruthy();
			expect(useComponent.getAttribute('href').toLocaleLowerCase()).toBe('svg-symbols.svg#kv-logo-kelvin');
		});
	});

	describe('when has custom classes', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-svg-icon name="kv-logo-kelvin" custom-class="icon-full-size rotate-90"></kv-svg-icon>');
		});

		it('should render the <svg> with custom classes', async () => {
			const svgComponent = await page.find('kv-svg-icon >>> svg');
			expect(svgComponent).toBeTruthy();
			expect(svgComponent.getAttribute('class').toLocaleLowerCase()).toBe('icon-full-size rotate-90 svg-icon');
		});
	});

	describe('when has custom color', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-svg-icon name="kv-logo-kelvin" custom-color="#05a357"></kv-svg-icon>');
		});

		it('should render the <svg> with default class', async () => {
			const svgComponent1 = await page.find('kv-svg-icon >>> svg');
			expect(svgComponent1).toBeTruthy();
			expect(svgComponent1.getAttribute('class').toLocaleLowerCase()).toBe('svg-icon');
		});

		it('should render the <svg> with fill color', async () => {
			const svgComponent2: E2EElement = await page.find('kv-svg-icon >>> svg');
			expect(svgComponent2).toBeTruthy();
			const styles = await svgComponent2.getComputedStyle();
			expect(styles.fill).toBe('rgb(5, 163, 87)');
		});
	});
});
