import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Calendar Advance Date Selector (end-to-end)', () => {
	let page: E2EPage;

	xdescribe('when user clicks on the an relative date option', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-calendar-advanced-date-selector></kv-calendar-advanced-date-selector>', { timeout: 10000 });

			const calendarAdvancedDateSelectorElement = await page.find('kv-calendar-advanced-date-selector');
			spyChangeEvent = await calendarAdvancedDateSelectorElement.spyOnEvent('relativeTimeChange');

			const dropdownElement = await page.find('kv-calendar-advanced-date-selector >>> kv-select-option');
			dropdownElement.triggerEvent('itemSelected', {
				detail: 'last-24-h'
			});

			await page.waitForChanges();
		});

		it('should emit the a `RelativeTimeChange` event with the select option key and its range', () => {
			// Cannot expect the event detail because pupperter e2e tests run in the
			// browser's context, which cannot be easily mocked. https://stenciljs.com/docs/mocking
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});

	describe('when user selects an absolute date range', () => {
		let spyChangeEvent: EventSpy;
		const mouseEvent = new MouseEvent('click');

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-calendar-advanced-date-selector></kv-calendar-advanced-date-selector>', { timeout: 10000 });

			const calendarAdvancedDateSelectorElement = await page.find('kv-calendar-advanced-date-selector');
			spyChangeEvent = await calendarAdvancedDateSelectorElement.spyOnEvent('absoluteTimeChange');

			const calendarElement = await page.find('kv-calendar-advanced-date-selector >>> kv-range-dates-select-dropdown');
			calendarElement.triggerEvent('selectRangeDates', {
				detail: {
					event: mouseEvent,
					payload: ['2020-04-01T00:00:00Z', '2020-04-05T23:59:59Z']
				}
			});

			await page.waitForChanges();
		});

		it('should emit the a `AbsoluteTimeChange` event', () => {
			const expectedEventDetail = {
				key: '2020-04-01T00:00:00Z#2020-04-05T23:59:59Z',
				range: ['2020-04-01T00:00:00Z', '2020-04-05T23:59:59Z']
			};

			expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
		});
	});

	xdescribe('when user selects a timezone', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-calendar-advanced-date-selector></kv-calendar-advanced-date-selector>', { timeout: 10000 });

			const calendarAdvancedDateSelectorElement = await page.find('kv-calendar-advanced-date-selector');
			spyChangeEvent = await calendarAdvancedDateSelectorElement.spyOnEvent('timezoneChange');

			const dropdownElement = await page.find('kv-calendar-advanced-date-selector >>> kv-single-select-dropdown');
			dropdownElement.triggerEvent('optionSelected', {
				detail: 'last-24-h'
			});

			await page.waitForChanges();
		});

		it('should emit the a `TimezoneChange` event', () => {
			const expectedEventDetail = 'last-24-h';

			expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
		});
	});
});
