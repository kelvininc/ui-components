import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('Range Dates Input (end-to-end)', () => {
	let page: E2EPage;

	describe('when user clicks on start date text field', () => {
		describe('and it was closed', () => {
			let spyChangeEvent: EventSpy;
			let calendarElement: E2EElement;

			beforeEach(async () => {
				page = await newE2EPage();
				await page.setContent('<kv-range-dates-select-dropdown initial-date="2020-04-04"></kv-range-dates-select-dropdown>');

				const rangeDatesSelectDropdownElement = await page.find('kv-range-dates-select-dropdown');
				spyChangeEvent = await rangeDatesSelectDropdownElement.spyOnEvent('openStateChange');

				const textFieldElement = await page.find('kv-range-dates-select-dropdown >>> .start-single-date-select-dropdown kv-text-field');
				textFieldElement.click();

				await page.waitForChanges();
				calendarElement = await page.find('kv-range-dates-select-dropdown >>> kv-calendar-range-dates-selector');
			});

			it('should emit state change with true and open calendar', () => {
				expect(spyChangeEvent).toHaveReceivedEventDetail(true);
				expect(calendarElement).toBeTruthy();
			});
		});
	});
});
