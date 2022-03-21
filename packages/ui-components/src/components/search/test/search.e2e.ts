import { newE2EPage } from '@stencil/core/testing';

describe('kv-search', () => {
	it('renders', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-search></kv-search>');

		const element = await page.find('kv-search');
		expect(element).toHaveClass('hydrated');
	});
});
