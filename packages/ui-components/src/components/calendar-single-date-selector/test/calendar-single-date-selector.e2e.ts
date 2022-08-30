import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Calendar Single Date Selector (end-to-end)', () => {
	let page: E2EPage;

	describe('when user clicks on the a date', () => {
		describe('and is the same as the selected date', () => {
			let spyChangeEvent: EventSpy;
			const mouseEvent = new MouseEvent('click');

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-single-date-selector initial-date="2020-04-04" selected-date="2020-04-01"></kv-calendar-single-date-selector>');

				const calendarSingleDateSelector = await page.find('kv-calendar-single-date-selector');
				spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectDate');

				const calendarElement = await page.find('kv-calendar-single-date-selector >>> kv-calendar');
				calendarElement.triggerEvent('clickDate', {
					detail: {
						event: mouseEvent,
						payload: '2020-04-01'
					}
				});

				await page.waitForChanges();
			});

			it('should emit `SelectDate` event with no payload', () => {
				const expectedEventDetail = {
					event: mouseEvent
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and is not the same as the selected date', () => {
			let spyChangeEvent: EventSpy;
			const mouseEvent = new MouseEvent('click');

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-single-date-selector initial-date="2020-04-04"></kv-calendar-single-date-selector>');

				const calendarSingleDateSelector = await page.find('kv-calendar-single-date-selector');
				spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectDate');

				const calendarElement = await page.find('kv-calendar-single-date-selector >>> kv-calendar');
				calendarElement.triggerEvent('clickDate', {
					detail: {
						event: mouseEvent,
						payload: '2020-04-06'
					}
				});

				await page.waitForChanges();
			});

			it('should emit `SelectDate` event with clicked date', () => {
				const expectedEventDetail = {
					event: mouseEvent,
					payload: '2020-04-06'
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});
	});
});
