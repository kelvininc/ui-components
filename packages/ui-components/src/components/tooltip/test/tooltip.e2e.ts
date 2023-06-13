import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('Tooltip (end-to-end)', () => {
	let page: E2EPage;

	describe('when it renders with text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tooltip text="Tooltip"> content </kv-tooltip>');
			await page.waitForChanges();
		});

		it('should render a tooltip content', async () => {
			const tooltip = await page.find('kv-tooltip');
			expect(tooltip).toBeTruthy();
			expect(tooltip.getAttribute('position')).toBe(null);
		});

		describe('and we hover the tooltip content', () => {
			beforeEach(async () => {
				const tooltipContent = await page.find('kv-tooltip >>> #content');
				await tooltipContent.hover();
				// Wait for delay
				await new Promise(r => setTimeout(r, 1100));
			});

			it('should render the tooltip container with text setted', async () => {
				const textComponent = await page.find('kv-tooltip-text >>> .tooltip-container');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText.toLocaleLowerCase()).toBe('tooltip');
			});
		});
	});

	describe('when it renders without text', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tooltip> content </kv-tooltip>');
			await page.waitForChanges();
		});

		it('should render a tooltip content', async () => {
			const tooltip = await page.find('kv-tooltip');
			expect(tooltip).toBeTruthy();
			expect(tooltip.getAttribute('position')).toBe(null);
		});

		describe('and we hover the tooltip content', () => {
			beforeEach(async () => {
				const tooltipContent = await page.find('kv-tooltip >>> #content');
				await tooltipContent.hover();
				// Wait for delay
				await new Promise(r => setTimeout(r, 1100));
			});

			it("shouldn't render the tooltip container", async () => {
				const textComponent = await page.find('kv-tooltip-text >>> .tooltip-container');
				expect(textComponent).toBeFalsy();
			});
		});
	});

	describe('when it renders with position set', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-tooltip text="Tooltip" position="left"> content </kv-tooltip>');
			await page.waitForChanges();
		});

		it('should render a tooltip with position selected', async () => {
			const component = await page.find('kv-tooltip');
			expect(component).toBeTruthy();
			expect(component.getAttribute('position')).toBe('left');
		});

		describe('and we hover the tooltip content', () => {
			beforeEach(async () => {
				const tooltipContent = await page.find('kv-tooltip >>> #content');
				await tooltipContent.hover();
				// Wait for delay
				await new Promise(r => setTimeout(r, 1100));
			});

			it('should render the tooltip container with text setted', async () => {
				const textComponent = await page.find('kv-tooltip-text >>> .tooltip-container');
				expect(textComponent).toBeTruthy();
				expect(textComponent.innerText.toLocaleLowerCase()).toBe('tooltip');
			});
		});
	});
});
