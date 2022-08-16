import { SpecPage } from '@stencil/core/internal';
import { KvCalendarSingleDateSelector } from '../calendar-single-date-selector';
import { newSpecPage } from '@stencil/core/testing';

describe('Calendar Single Date Selector (unit tests)', () => {
	let page: SpecPage;
	let component: KvCalendarSingleDateSelector;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarSingleDateSelector],
				html: '<kv-calendar-single-date-selector></kv-calendar-single-date-selector>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when `getSelectedDates` is called', () => {
		describe('and there is no selected date', () => {
			let result: [string] | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarSingleDateSelector],
					html: '<kv-calendar-single-date-selector></kv-calendar-single-date-selector>'
				});
				component = page.rootInstance;
				result = component.getSelectedDates();
			});

			it('should return undefined', () => {
				expect(result).toBeUndefined();
			});
		});

		describe('and there is a selected date', () => {
			let result: [string] | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarSingleDateSelector],
					html: '<kv-calendar-single-date-selector selected-date="2022-04-01"></kv-calendar-single-date-selector>'
				});
				component = page.rootInstance;
				result = component.getSelectedDates();
			});

			it('should return an array with the selected date', () => {
				expect(result).toEqual(['2022-04-01']);
			});
		});
	});
});
