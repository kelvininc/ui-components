import { SpecPage, h } from '@stencil/core/internal';

import { KvCalendarRangeDatesSelector } from '../../calendar-range-dates-selector/calendar-range-dates-selector';
import { KvRangeDatesSelectDropdown } from '../range-dates-select-dropdown';
import { KvTextField } from '../../text-field/text-field';
import { newSpecPage } from '@stencil/core/testing';

describe('Range Dates Input (unit tests)', () => {
	let page: SpecPage;
	let component: KvRangeDatesSelectDropdown;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
				html: '<kv-range-dates-select-dropdown></kv-range-dates-select-dropdown>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `isOpen` with false', () => {
			expect(component.isOpen).toBe(false);
		});
	});

	describe('when `getFormattedSelectedStartDate` is called', () => {
		describe('and there is no selected range dates', () => {
			let result: string | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
					html: '<kv-range-dates-select-dropdown></kv-range-dates-select-dropdown>'
				});
				component = page.rootInstance;
				result = component.getFormattedSelectedStartDate();
			});

			it('should return undefined', () => {
				expect(result).toBeUndefined();
			});
		});

		describe('and there is a range start selected date', () => {
			describe('and a custom date mask is defined', () => {
				let result: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
						template: () => (
							<kv-range-dates-select-dropdown
								selectedRangeDates={['2020-04-02', '2020-04-05']}
								startInputConfig={{ dateMask: 'Do MMM, YYYY' }}
							></kv-range-dates-select-dropdown>
						)
					});
					component = page.rootInstance;
					result = component.getFormattedSelectedStartDate();
				});

				it('should return start date formatted', () => {
					expect(result).toEqual('2nd Apr, 2020');
				});
			});

			describe('and a custom date mask is not defined', () => {
				let result: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
						template: () => <kv-range-dates-select-dropdown selectedRangeDates={['2020-04-02', '2020-04-05']}></kv-range-dates-select-dropdown>
					});
					component = page.rootInstance;
					result = component.getFormattedSelectedStartDate();
				});

				it('should return start date formatted', () => {
					expect(result).toEqual('2020-04-02 00:00:00');
				});
			});
		});
	});

	describe('when `getFormattedSelectedEndDate` is called', () => {
		describe('and there is no selected range dates', () => {
			let result: string | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
					html: '<kv-range-dates-select-dropdown></kv-range-dates-select-dropdown>'
				});
				component = page.rootInstance;
				result = component.getFormattedSelectedEndDate();
			});

			it('should return undefined', () => {
				expect(result).toBeUndefined();
			});
		});

		describe('and there is a range end selected date', () => {
			describe('and a custom date mask is defined', () => {
				let result: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
						template: () => (
							<kv-range-dates-select-dropdown
								selectedRangeDates={['2020-04-02', '2020-04-05']}
								endInputConfig={{ dateMask: 'Do MMM, YYYY' }}
							></kv-range-dates-select-dropdown>
						)
					});
					component = page.rootInstance;
					result = component.getFormattedSelectedEndDate();
				});

				it('should return end date formatted', () => {
					expect(result).toEqual('5th Apr, 2020');
				});
			});
			describe('and a custom date mask is not defined', () => {
				let result: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
						template: () => <kv-range-dates-select-dropdown selectedRangeDates={['2020-04-02', '2020-04-05']}></kv-range-dates-select-dropdown>
					});
					component = page.rootInstance;
					result = component.getFormattedSelectedEndDate();
				});

				it('should return end date formatted', () => {
					expect(result).toEqual('2020-04-05 00:00:00');
				});
			});
		});
	});

	describe('when `isStartSingleDateSelectDropdownFocus` is called', () => {
		describe('and the calendar is closed', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
					template: () => <kv-range-dates-select-dropdown isOpen={false}></kv-range-dates-select-dropdown>
				});
				component = page.rootInstance;
				result = component.isStartSingleDateSelectDropdownFocus();
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});
	});

	describe('when `isEndSingleDateSelectDropdownFocus` is called', () => {
		describe('and the calendar is closed', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvRangeDatesSelectDropdown, KvTextField, KvCalendarRangeDatesSelector],
					template: () => <kv-range-dates-select-dropdown isOpen={false}></kv-range-dates-select-dropdown>
				});
				component = page.rootInstance;
				result = component.isEndSingleDateSelectDropdownFocus();
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});
	});
});
