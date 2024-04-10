import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Absolute Time Picker (end to end)', () => {
	let page: E2EPage;

	describe('when user clicks on a calendar date', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-absolute-time-picker></kv-absolute-time-picker>');

			const absoluteTimePickerElement = await page.find('kv-absolute-time-picker');
			spyChangeEvent = await absoluteTimePickerElement.spyOnEvent('selectedDatesChange');

			const buttonElement = await page.find('kv-calendar >>> kv-calendar-day[day="15"] >>> .calendar-day');
			await buttonElement.click();
		});

		it('should emit the a `selectedDatesChange`', () => {
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});
});
