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

				const prevButtonElement = await page.find('kv-calendar >>> .calendar__header .navigator:first-child');
				await prevButtonElement.click();
			});

			it('should emit `ChangeMonth` event with December', () => {
				const expectedEventDetail = {
					month: 12
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});

			it('should emit `ChangeYear` event with the year decremented', () => {
				const expectedEventDetail = {
					year: 2019
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

				const prevButtonElement = await page.find('kv-calendar >>> .calendar__header .navigator:first-child');
				await prevButtonElement.click();
			});

			it('should emit `ChangeMonth` event', () => {
				const expectedEventDetail = {
					month: 2
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

				const nextButtonElement = await page.find('kv-calendar >>> .calendar__header .navigator:last-child');
				await nextButtonElement.click();
			});

			it('should emit `ChangeMonth` event with January', () => {
				const expectedEventDetail = {
					month: 1
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});

			it('should emit `ChangeYear` event with the year incremented', () => {
				const expectedEventDetail = {
					year: 2021
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

				const nextButtonElement = await page.find('kv-calendar >>> .calendar__header .navigator:last-child');
				await nextButtonElement.click();
			});

			it('should emit `ChangeMonth` event', () => {
				const expectedEventDetail = {
					month: 8
				};
				expect(spyChangeMonthEvent).toHaveReceivedEventDetail(expectedEventDetail);
			});
		});
	});
});
