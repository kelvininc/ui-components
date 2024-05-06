import { newE2EPage } from '@stencil/core/testing';

describe('kv-absolute-time-picker-dropdown-input', () => {
	it('renders', async () => {
		const page = await newE2EPage();
		await page.setContent('<kv-absolute-time-picker-dropdown-input></kv-absolute-time-picker-dropdown-input>');

		const element = await page.find('kv-absolute-time-picker-dropdown-input');
		expect(element).toHaveClass('hydrated');
	});
});
