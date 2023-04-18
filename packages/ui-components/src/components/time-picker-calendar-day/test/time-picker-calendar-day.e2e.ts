import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Time Picker Calendar Day (end-to-end)', () => {
	let page: E2EPage;

	describe('when user clicks on the day button', () => {
		describe('and is not disabled', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-time-picker-calendar-day day="12"></kv-time-picker-calendar-day>');

				const dayButtonIconElement = await page.find('kv-time-picker-calendar-day');
				spyChangeEvent = await dayButtonIconElement.spyOnEvent('clickDay');

				const buttonElement = await page.find('kv-time-picker-calendar-day >>> .time-picker-calendar-day');
				await buttonElement.click();
			});

			it('should emit `ClickDay` event', () => {
				expect(spyChangeEvent).toHaveReceivedEventDetail(12);
			});
		});

		describe('and is disabled', () => {
			let spyChangeEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-time-picker-calendar-day day="12" disabled></kv-time-picker-calendar-day>');

				const dayButtonIconElement = await page.find('kv-time-picker-calendar-day');
				spyChangeEvent = await dayButtonIconElement.spyOnEvent('clickDay');

				const buttonElement = await page.find('kv-time-picker-calendar-day >>> .time-picker-calendar-day');
				await buttonElement.click();
			});

			it('should not emit `ClickDay` event', () => {
				expect(spyChangeEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
