import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Calendar (end-to-end)', () => {
	let page: E2EPage;

	describe('when component renders', () => {
		let actualTitle: string;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-calendar initial-date="2020-01-23"></kv-calendar>');
			actualTitle = (await page.find('kv-calendar >>> .calendar__header .month')).innerText;
		});

		it('should render the correct title', async () => {
			const expectedTitle = 'January 2020';
			expect(expectedTitle).toBe(actualTitle);
		});
	});

	describe('when user clicks on the previous month button', () => {
		describe('and the month is January', () => {
			let spyChangeMonthEvent: EventSpy;
			let spyChangeYearEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-01-23"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyChangeMonthEvent = await calendarElement.spyOnEvent('changeMonth');
				spyChangeYearEvent = await calendarElement.spyOnEvent('changeYear');

				const prevButtonElement = await page.find('kv-calendar >>> .calendar__header kv-action-button-icon:first-child');
				await prevButtonElement.click();
			});

			it('should emit `ChangeMonth` event with December', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 12
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});

			it('should emit `ChangeYear` event with the year decremented', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 2019
				};
				expect(spyChangeYearEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and the month not Janurary', () => {
			let spyChangeMonthEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-03-11"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyChangeMonthEvent = await calendarElement.spyOnEvent('changeMonth');

				const prevButtonElement = await page.find('kv-calendar >>> .calendar__header kv-action-button-icon:first-child');
				await prevButtonElement.click();
			});

			it('should emit `ChangeMonth` event', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 2
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});
	});

	describe('when user clicks on the next month button', () => {
		describe('and the month is December', () => {
			let spyChangeMonthEvent: EventSpy;
			let spyChangeYearEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-12-07"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyChangeMonthEvent = await calendarElement.spyOnEvent('changeMonth');
				spyChangeYearEvent = await calendarElement.spyOnEvent('changeYear');

				const nextButtonElement = await page.find('kv-calendar >>> .calendar__header kv-action-button-icon:last-child');
				await nextButtonElement.click();
			});

			it('should emit `ChangeMonth` event with January', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 1
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});

			it('should emit `ChangeYear` event with the year incremented', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 2021
				};
				expect(spyChangeYearEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and the month not December', () => {
			let spyChangeMonthEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-07-07"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyChangeMonthEvent = await calendarElement.spyOnEvent('changeMonth');

				const nextButtonElement = await page.find('kv-calendar >>> .calendar__header kv-action-button-icon:last-child');
				await nextButtonElement.click();
			});

			it('should emit `ChangeMonth` event', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: true
					},
					payload: 8
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});
	});

	describe('when user clicks on the day button', () => {
		describe('and is not disabled', () => {
			let spyClickDateEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-01-23"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyClickDateEvent = await calendarElement.spyOnEvent('clickDate');

				const buttonElement = await page.find('kv-calendar >>> kv-calendar-day[day="1"] >>> .calendar-day');
				await buttonElement.click();
			});

			it('should emit `ClickDate` event', () => {
				const expectedEventDetail = {
					event: {
						isTrusted: false
					},
					payload: '2020-01-01'
				};
				expect(spyClickDateEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});

		describe('and the day is one of the disabled dates', () => {
			let spyClickDateEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-01-23"></kv-calendar>');
				await page.$eval('kv-calendar', (elm: HTMLKvCalendarElement) => {
					elm.disabledDates = ['2020-01-01'];
				});
				await page.waitForChanges();

				const calendarElement = await page.find('kv-calendar');
				spyClickDateEvent = await calendarElement.spyOnEvent('clickDate');
				const buttonElement = await page.find('kv-calendar >>> kv-calendar-day[day="1"] >>> .calendar-day');
				await buttonElement.click();
			});

			it('should not emit `ClickDate` event', () => {
				expect(spyClickDateEvent).not.toHaveReceivedEvent();
			});
		});

		describe('and the day is before the min date', () => {
			let spyClickDateEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-01-23" min-date="2020-01-20"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyClickDateEvent = await calendarElement.spyOnEvent('clickDate');
				const buttonElement = await page.find('kv-calendar >>> kv-calendar-day[day="1"] >>> .calendar-day');
				await buttonElement.click();
			});

			it('should not emit `ClickDate` event', () => {
				expect(spyClickDateEvent).not.toHaveReceivedEvent();
			});
		});

		describe('and the day is before the max date', () => {
			let spyClickDateEvent: EventSpy;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-calendar initial-date="2020-01-23" max-date="2019-12-24"></kv-calendar>');

				const calendarElement = await page.find('kv-calendar');
				spyClickDateEvent = await calendarElement.spyOnEvent('clickDate');
				const buttonElement = await page.find('kv-calendar >>> kv-calendar-day[day="1"] >>> .calendar-day');
				await buttonElement.click();
			});

			it('should not emit `ClickDate` event', () => {
				expect(spyClickDateEvent).not.toHaveReceivedEvent();
			});
		});
	});
});
