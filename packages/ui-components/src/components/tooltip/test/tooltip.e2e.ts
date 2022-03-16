import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Tooltip (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tooltip text="Tooltip"></kv-tooltip>');
		});

		it('should render a tooltip with text setted', async () => {
			const component = await page.find('kv-tooltip');
			expect(component).toBeTruthy();
			expect(component.getAttribute('position')).toBe(null);
			const textComponent = await page.find('kv-tooltip >>> .tooltip-container');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe('tooltip');
		});
	});

	describe('when it renders with position setted', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tooltip text="Tooltip" position="left"></kv-tooltip>');
		});

		it('should render a tooltip with position selected', async () => {
			const component = await page.find('kv-tooltip');
			expect(component).toBeTruthy();
			expect(component.getAttribute('position')).toBe('left');
			const textComponent = await page.find('kv-tooltip >>> .tooltip-container');
			expect(textComponent).toBeTruthy();
			expect(textComponent.innerText.toLocaleLowerCase()).toBe('tooltip');
		});
	});
});
