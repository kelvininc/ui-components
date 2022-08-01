import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Calendar Day (end-to-end)', () => {
	let page: E2EPage;

	describe('when user clicks on the day button', () => {
		describe('and is not disabled', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-day day="12"></kv-calendar-day>');

				const dayButtonIconElement = await page.find('kv-calendar-day');
				spyChangeEvent = await dayButtonIconElement.spyOnEvent('clickDay');

				const buttonElement = await page.find('kv-calendar-day >>> .calendar-day');
				await buttonElement.click();
			});

			it('should emit `ClickDay` event', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 12
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and is disabled', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-day day="12" disabled></kv-calendar-day>');

				const dayButtonIconElement = await page.find('kv-calendar-day');
				spyChangeEvent = await dayButtonIconElement.spyOnEvent('clickDay');

				const buttonElement = await page.find('kv-calendar-day >>> .calendar-day');
				await buttonElement.click();
			});

			it('should not emit `ClickDay` event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
