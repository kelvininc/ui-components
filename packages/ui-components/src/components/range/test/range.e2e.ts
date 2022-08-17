import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Range (end to end)', () => {
	let page: E2EPage;

	describe('kv-range with default props', () => {
		let element: E2EElement;
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-range min=0 max=100></kv-range>');
			element = await page.find('kv-range');
		});

		it('should render', () => {
			expect(element).toHaveClass('hydrated');
		});
	});

	describe('when user clicks on slider', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-range min=0 max=100></kv-range>');

			const rangeElement = await page.find('kv-range');
			spyChangeEvent = await rangeElement.spyOnEvent('valueChange');

			const rangeSliderElement = await page.find('kv-range >>> #slider');
			await rangeSliderElement.click();
		});

		it('should emit valueChange event', () => {
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});
});
