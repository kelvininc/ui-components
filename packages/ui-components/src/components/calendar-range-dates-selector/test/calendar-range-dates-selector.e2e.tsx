import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Calendar Range Dates Selector (end-to-end)', () => {
	let page: E2EPage;

	describe('when user clicks on the a date', () => {
		describe('and there is not range dates selected', () => {
			let spyChangeEvent: EventSpy;
			const mouseEvent = new MouseEvent('click');

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-range-dates-selector initial-date="2020-04-04"></kv-calendar-range-dates-selector>');

				const calendarSingleDateSelector = await page.find('kv-calendar-range-dates-selector');
				spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectRangeDates');

				const calendarElement = await page.find('kv-calendar-range-dates-selector >>> kv-calendar');
				calendarElement.triggerEvent('clickDate', {
					detail: {
						event: mouseEvent,
						payload: '2020-04-01'
					}
				});

				await page.waitForChanges();
			});

			it('should emit `SelectRangeDates` event with the clicked date as the range start date', () => {
				const expectedEventDetail = {
					event: mouseEvent,
					payload: ['2020-04-01 00:00:00']
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and the clicked date is the same as the selected range start date', () => {
			describe('and there is no selected range end date', () => {
				let spyChangeEvent: EventSpy;
				const mouseEvent = new MouseEvent('click');

				beforeEach(async () => {
					page = await newE2EPage();
					await page.setContent('<kv-calendar-range-dates-selector initial-date="2020-04-04"></kv-calendar-range-dates-selector>');
					await page.$eval('kv-calendar-range-dates-selector', (elm: HTMLKvCalendarRangeDatesSelectorElement) => {
						elm.selectedRangeDates = ['2020-04-01'];
					});

					const calendarSingleDateSelector = await page.find('kv-calendar-range-dates-selector');
					spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectRangeDates');

					const calendarElement = await page.find('kv-calendar-range-dates-selector >>> kv-calendar');
					calendarElement.triggerEvent('clickDate', {
						detail: {
							event: mouseEvent,
							payload: '2020-04-01'
						}
					});

					await page.waitForChanges();
				});

				it('should emit `SelectRangeDates` event with the clicked date as the range start and end dates', () => {
					const expectedEventDetail = {
						event: mouseEvent,
						payload: ['2020-04-01 00:00:00', '2020-04-01 23:59:59']
					};

					expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
				});
			});

			describe('and there is a selected range end date', () => {
				let spyChangeEvent: EventSpy;
				const mouseEvent = new MouseEvent('click');

				beforeEach(async () => {
					page = await newE2EPage();
					await page.setContent('<kv-calendar-range-dates-selector initial-date="2020-04-04"></kv-calendar-range-dates-selector>');
					await page.$eval('kv-calendar-range-dates-selector', (elm: HTMLKvCalendarRangeDatesSelectorElement) => {
						elm.selectedRangeDates = ['2020-04-01', '2020-04-05'];
					});

					const calendarSingleDateSelector = await page.find('kv-calendar-range-dates-selector');
					spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectRangeDates');

					const calendarElement = await page.find('kv-calendar-range-dates-selector >>> kv-calendar');
					calendarElement.triggerEvent('clickDate', {
						detail: {
							event: mouseEvent,
							payload: '2020-04-01'
						}
					});

					await page.waitForChanges();
				});

				it('should emit `SelectRangeDates` event with empty array', () => {
					const expectedEventDetail = {
						event: mouseEvent,
						payload: []
					};

					expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
				});
			});
		});

		describe('and there is a selected range end date', () => {
			let spyChangeEvent: EventSpy;
			const mouseEvent = new MouseEvent('click');

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-range-dates-selector initial-date="2020-04-04"></kv-calendar-range-dates-selector>');
				await page.$eval('kv-calendar-range-dates-selector', (elm: HTMLKvCalendarRangeDatesSelectorElement) => {
					elm.selectedRangeDates = ['2020-04-01', '2020-04-05'];
				});

				const calendarSingleDateSelector = await page.find('kv-calendar-range-dates-selector');
				spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectRangeDates');

				const calendarElement = await page.find('kv-calendar-range-dates-selector >>> kv-calendar');
				calendarElement.triggerEvent('clickDate', {
					detail: {
						event: mouseEvent,
						payload: '2020-04-02'
					}
				});

				await page.waitForChanges();
			});

			it('should emit `SelectRangeDates` event with the clicked date as the range start date', () => {
				const expectedEventDetail = {
					event: mouseEvent,
					payload: ['2020-04-02 00:00:00']
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and the clicked date is before the selected range start date', () => {
			let spyChangeEvent: EventSpy;
			const mouseEvent = new MouseEvent('click');

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-range-dates-selector initial-date="2020-04-04"></kv-calendar-range-dates-selector>');
				await page.$eval('kv-calendar-range-dates-selector', (elm: HTMLKvCalendarRangeDatesSelectorElement) => {
					elm.selectedRangeDates = ['2020-04-01', '2020-04-05'];
				});

				const calendarSingleDateSelector = await page.find('kv-calendar-range-dates-selector');
				spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectRangeDates');

				const calendarElement = await page.find('kv-calendar-range-dates-selector >>> kv-calendar');
				calendarElement.triggerEvent('clickDate', {
					detail: {
						event: mouseEvent,
						payload: '2020-03-31'
					}
				});

				await page.waitForChanges();
			});

			it('should emit `SelectRangeDates` event with the clicked date as the range start date', () => {
				const expectedEventDetail = {
					event: mouseEvent,
					payload: ['2020-03-31 00:00:00']
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and there is no selected range end date and the clicked date is after the selected range start date', () => {
			let spyChangeEvent: EventSpy;
			const mouseEvent = new MouseEvent('click');

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar-range-dates-selector initial-date="2020-04-04"></kv-calendar-range-dates-selector>');
				await page.$eval('kv-calendar-range-dates-selector', (elm: HTMLKvCalendarRangeDatesSelectorElement) => {
					elm.selectedRangeDates = ['2020-04-01'];
				});

				const calendarSingleDateSelector = await page.find('kv-calendar-range-dates-selector');
				spyChangeEvent = await calendarSingleDateSelector.spyOnEvent('selectRangeDates');

				const calendarElement = await page.find('kv-calendar-range-dates-selector >>> kv-calendar');
				calendarElement.triggerEvent('clickDate', {
					detail: {
						event: mouseEvent,
						payload: '2020-04-02'
					}
				});

				await page.waitForChanges();
			});

			it('should emit `SelectRangeDates` event with the current selected range start date and the clicked date as the range end date', () => {
				const expectedEventDetail = {
					event: mouseEvent,
					payload: ['2020-04-01 00:00:00', '2020-04-02 23:59:59']
				};

				expect(spyChangeEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});
	});
});
