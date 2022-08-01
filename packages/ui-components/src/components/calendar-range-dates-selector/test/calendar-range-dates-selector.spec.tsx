import { h, SpecPage } from '@stencil/core/internal';
import { KvCalendarRangeDatesSelector } from '../calendar-range-dates-selector';
import { newSpecPage } from '@stencil/core/testing';

describe('Calendar Range Dates Selector (unit tests)', () => {
	let page: SpecPage;
	let component: KvCalendarRangeDatesSelector;

	describe('when selected dates is passed', () => {
		describe('and start and end dates are valid', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarRangeDatesSelector],
					template: () => <kv-calendar-range-dates-selector selectedRangeDates={['2020-04-02', '2020-04-05']}></kv-calendar-range-dates-selector>
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});

		describe('and start date is invalid', () => {
			it('should throw a validation error', async () => {
				await expect(
					newSpecPage({
						components: [KvCalendarRangeDatesSelector],
						template: () => <kv-calendar-range-dates-selector selectedRangeDates={['invalid-date', '2020-04-05']}></kv-calendar-range-dates-selector>
					})
				).rejects.toThrow('Range selected start date should be a valid date');
			});
		});

		describe('and end date is invalid', () => {
			it('should throw a validation error', async () => {
				await expect(
					newSpecPage({
						components: [KvCalendarRangeDatesSelector],
						template: () => <kv-calendar-range-dates-selector selectedRangeDates={['2020-04-02', 'invalid-date']}></kv-calendar-range-dates-selector>
					})
				).rejects.toThrow('Range selected end date should be a valid date');
			});
		});
	});

	describe('when `getSelectedDates` is called', () => {
		describe('and there is no selected range dates', () => {
			let result: string[] | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarRangeDatesSelector],
					html: '<kv-calendar-range-dates-selector></kv-calendar-range-dates-selector>'
				});
				component = page.rootInstance;
				result = component.getSelectedDates();
			});

			it('should return undefined', () => {
				expect(result).toBeUndefined();
			});
		});

		describe('and there is no selected end range date', () => {
			let result: string[] | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarRangeDatesSelector],
					template: () => <kv-calendar-range-dates-selector selectedRangeDates={['2020-04-02']}></kv-calendar-range-dates-selector>
				});
				component = page.rootInstance;
				result = component.getSelectedDates();
			});

			it('should return an array with the selected start date', () => {
				expect(result).toEqual(['2020-04-02']);
			});
		});

		describe('and there is a selected range dates', () => {
			let result: string[] | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarRangeDatesSelector],
					template: () => <kv-calendar-range-dates-selector selectedRangeDates={['2020-04-02', '2020-04-05']}></kv-calendar-range-dates-selector>
				});
				component = page.rootInstance;
				result = component.getSelectedDates();
			});

			it('should return an array with all dates between the range', () => {
				const expectedResult = ['2020-04-02', '2020-04-03', '2020-04-04', '2020-04-05'];
				expect(result).toEqual(expectedResult);
			});
		});
	});
});
