import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Loader (end-to-end)', () => {
	let page: E2EPage;

	describe('when renders with default props', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-loader></kv-loader>');
		})

		it('should not render a loader', async () => {
			const labelComponent = await page.find('kv-loader >>> .loader-container')
			expect(labelComponent).toBeFalsy()
		});
	});

	describe('when is loading', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-loader is-loading></kv-loader>');
		})

		it('should render loader', async () => {
			const loaderComponent = await page.find('kv-loader >>> .loader-container')
			expect(loaderComponent).toBeTruthy()
		});
	});

	describe('when has overlay', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-loader is-loading has-overlay></kv-loader>');
		});

		it('should render loader and overlay', async () => {
			const loaderComponent = await page.find('kv-loader >>> .loader-container')
			expect(loaderComponent).toBeTruthy()
			const overlayComponent = await page.find('kv-loader >>> .loader-container >>> .overlay')
			expect(overlayComponent).toBeTruthy()
		});
	});
});
