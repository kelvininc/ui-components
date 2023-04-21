import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Absolute Time Picker (end to end)', () => {
	let page: E2EPage;

	describe('when user clicks on a calendar date', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-absolute-time-picker></kv-absolute-time-picker>');

			const absoluteTimePickerElement = await page.find('kv-absolute-time-picker');
			spyChangeEvent = await absoluteTimePickerElement.spyOnEvent('selectRangeDatesChange');

			const buttonElement = await page.find('kv-time-picker-calendar >>> kv-time-picker-calendar-day[day="15"] >>> .time-picker-calendar-day');
			await buttonElement.click();
		});

		it('should emit the a `selectRangeDatesChange`', () => {
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});
});
