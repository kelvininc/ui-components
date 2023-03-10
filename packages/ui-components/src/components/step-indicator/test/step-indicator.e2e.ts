import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('StepIndicator (end to end)', () => {
	let page: E2EPage;
	let hostEl: E2EElement;
	let indicatorEl: E2EElement;

	describe('when the component renders with `enabled`', () => {
		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-step-indicator enabled></kv-step-indicator>');
			hostEl = await page.find('kv-step-indicator');
			indicatorEl = await page.find('kv-step-indicator >>> .indicator');
		});

		it('should render the indicator element', () => {
			expect(indicatorEl).toBeTruthy();
		});

		it('should assign the proper classes for the element', () => {
			expect(indicatorEl.className).toContain('indicator');
			expect(indicatorEl.className).toContain('indicator--state-enabled');
		});

		describe('and the user clicks on the indicator', () => {
			let clickSpy: EventSpy;

			beforeEach(async () => {
				clickSpy = await hostEl.spyOnEvent('indicatorClicked');
				await indicatorEl.click();
			});

			it('should emit an event after the click', () => {
				expect(clickSpy).toHaveReceivedEvent();
			});
		});
	});
});
