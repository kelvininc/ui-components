jest.mock('../../../utils/date.helper', () => ({
	...jest.requireActual('../../../utils/date.helper'),
	getDefaultTimezone: () => 'Europe/Lisbon'
}));

import { h, SpecPage } from '@stencil/core/internal';
import { KvCalendarAdvanceDateSelector } from '../calendar-advance-date-selector';
import { newSpecPage } from '@stencil/core/testing';
import { ECalendarAdvanceTimeType } from '../calendar-advance-date-selector.types';
import { ITextField } from '../../text-field/text-field.types';

describe('Calendar Advance Date Selector (unit tests)', () => {
	let page: SpecPage;
	let component: KvCalendarAdvanceDateSelector;

	describe('when selected time is passed', () => {
		describe('and is an relative time', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarAdvanceDateSelector],
					template: () => (
						<kv-calendar-advance-date-selector
							selectedTime={{
								type: ECalendarAdvanceTimeType.Relative,
								key: 'last-24-h'
							}}
						/>
					)
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});

		describe('and is an absolute time', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarAdvanceDateSelector],
					template: () => (
						<kv-calendar-advance-date-selector
							selectedTime={{
								type: ECalendarAdvanceTimeType.Absolute,
								key: '2020-04-02#2020-04-05'
							}}
						/>
					)
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});
	});

	describe('when selected timezone is passed', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendarAdvanceDateSelector],
				template: () => <kv-calendar-advance-date-selector selectedTimezone="Europe/Lisbon" />
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when `getSelectedTimezone` is called', () => {
		describe('and a timezone is selected', () => {
			let actualResult: string | undefined;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendarAdvanceDateSelector],
					template: () => <kv-calendar-advance-date-selector selectedTimezone="Europe/Lisbon" />
				});
				component = page.rootInstance;

				actualResult = component.getSelectedTimezone();
			});

			it('should return the selected timezone', () => {
				const expectedResult = 'Europe/Lisbon';
				expect(actualResult).toBe(expectedResult);
			});
		});

		describe('and a timezone is not selected', () => {
			describe('and timezones options includes default timezone', () => {
				let actualResult: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => <kv-calendar-advance-date-selector />
					});
					component = page.rootInstance;

					actualResult = component.getSelectedTimezone();
				});

				it('should return the default timezone', () => {
					const expectedResult = 'Europe/Lisbon';
					expect(actualResult).toBe(expectedResult);
				});
			});

			describe('and timezones options do not includes default timezone', () => {
				let actualResult: string | undefined;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => <kv-calendar-advance-date-selector timezones={['Africa/Abidjan']} />
					});
					component = page.rootInstance;

					actualResult = component.getSelectedTimezone();
				});

				it('should return the default timezone', () => {
					expect(actualResult).toBeUndefined();
				});
			});
		});
	});

	describe('when `getStartInputConfig` is called', () => {
		describe('and there is a custom placeholder config defined', () => {
			describe('and a relative time is selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => (
							<kv-calendar-advance-date-selector
								absoluteTimeConfig={{ startInputConfig: { placeholder: 'Click here to select a start date' } }}
								selectedTime={{
									type: ECalendarAdvanceTimeType.Relative,
									key: 'last-24-h'
								}}
							/>
						)
					});
					component = page.rootInstance;

					actualResult = component.getStartInputConfig();
				});

				it('should return a custom config with a placeholder with relative time', () => {
					const expectedPlaceholder = 'Now - 24 hours';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});

			describe('and a relative time is not selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => <kv-calendar-advance-date-selector absoluteTimeConfig={{ startInputConfig: { placeholder: 'Click here to select a start date' } }} />
					});
					component = page.rootInstance;

					actualResult = component.getStartInputConfig();
				});

				it('should return a custom config with the custom placeholder', () => {
					const expectedPlaceholder = 'Click here to select a start date';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});
		});

		describe('and there is not a custom placeholder config defined', () => {
			describe('and a relative time is selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => (
							<kv-calendar-advance-date-selector
								selectedTime={{
									type: ECalendarAdvanceTimeType.Relative,
									key: 'last-24-h'
								}}
							/>
						)
					});
					component = page.rootInstance;

					actualResult = component.getStartInputConfig();
				});

				it('should return a custom config with a placeholder with relative time', () => {
					const expectedPlaceholder = 'Now - 24 hours';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});

			describe('and a relative time is not selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => <kv-calendar-advance-date-selector />
					});
					component = page.rootInstance;

					actualResult = component.getStartInputConfig();
				});

				it('should return a custom config with the default placeholder', () => {
					const expectedPlaceholder = 'Select a start date';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});
		});
	});

	describe('when `getEndInputConfig` is called', () => {
		describe('and there is a custom placeholder config defined', () => {
			describe('and a relative time is selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => (
							<kv-calendar-advance-date-selector
								absoluteTimeConfig={{ endInputConfig: { placeholder: 'Click here to select a start date' } }}
								selectedTime={{
									type: ECalendarAdvanceTimeType.Relative,
									key: 'last-24-h'
								}}
							/>
						)
					});
					component = page.rootInstance;

					actualResult = component.getEndInputConfig();
				});

				it('should return a custom config with a placeholder with `Now`', () => {
					const expectedPlaceholder = 'Now';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});

			describe('and a relative time is not selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => <kv-calendar-advance-date-selector absoluteTimeConfig={{ endInputConfig: { placeholder: 'Click here to select a start date' } }} />
					});
					component = page.rootInstance;

					actualResult = component.getEndInputConfig();
				});

				it('should return a custom config with the custom placeholder', () => {
					const expectedPlaceholder = 'Click here to select a start date';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});
		});

		describe('and there is not a custom placeholder config defined', () => {
			describe('and a relative time is selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => (
							<kv-calendar-advance-date-selector
								selectedTime={{
									type: ECalendarAdvanceTimeType.Relative,
									key: 'last-24-h'
								}}
							/>
						)
					});
					component = page.rootInstance;

					actualResult = component.getEndInputConfig();
				});

				it('should return a custom config with a placeholder with `Now`', () => {
					const expectedPlaceholder = 'Now';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});

			describe('and a relative time is not selected', () => {
				let actualResult: Partial<ITextField>;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendarAdvanceDateSelector],
						template: () => <kv-calendar-advance-date-selector />
					});
					component = page.rootInstance;

					actualResult = component.getEndInputConfig();
				});

				it('should return a custom config with the default placeholder', () => {
					const expectedPlaceholder = 'Select an end date';
					expect(actualResult.placeholder).toBe(expectedPlaceholder);
				});
			});
		});
	});
});
