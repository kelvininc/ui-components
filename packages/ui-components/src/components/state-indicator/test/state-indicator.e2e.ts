import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('State Indicator (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-state-indicator text="State Indicator"></kv-state-indicator>');
		})

		it('should render a label', async () => {
			const colorComponent = await page.find('kv-state-indicator >>> .color');
			expect(colorComponent).toBeFalsy();
			const textComponent = await page.find('kv-state-indicator >>> .text');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe("state indicator");
		});
	});

	describe('when has a color', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-state-indicator text="State Indicator" color="green"></kv-state-indicator>');
		})

		it('should render the correct color', async () => {
			const colorComponent = await page.find('kv-state-indicator >>> .color')
			expect(colorComponent).toBeTruthy()
		});
	});
});
