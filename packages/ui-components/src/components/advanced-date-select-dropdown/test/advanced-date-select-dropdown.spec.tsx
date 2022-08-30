jest.mock('../../../utils/date.helper', () => ({
	...jest.requireActual('../../../utils/date.helper'),
	getDefaultTimezone: () => 'Europe/Lisbon'
}));

import { h, SpecPage } from '@stencil/core/internal';
import { newSpecPage } from '@stencil/core/testing';
import { ECalendarAdvanceTimeType } from '../../calendar-advanced-date-selector/calendar-advanced-date-selector.types';
import { ITextField } from '../../text-field/text-field.types';
import { KvAdvancedDateSelectDropdown } from '../advanced-date-select-dropdown';

describe('Advance Date Select Dropdown (unit tests)', () => {
	let page: SpecPage;
	let component: KvAdvancedDateSelectDropdown;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAdvancedDateSelectDropdown],
				html: '<kv-advanced-date-select-dropdown></kv-advanced-date-select-dropdown>'
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when `isApplyDisabled` is called', () => {
		describe("and there's no internal time selected", () => {
			let actualResult: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					html: '<kv-advanced-date-select-dropdown></kv-advanced-date-select-dropdown>'
				});
				component = page.rootInstance;

				actualResult = component.isApplyDisabled();
			});

			it('is should return true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('and internal time is not equals to prop time', () => {
			let actualResult: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTime={{
								type: ECalendarAdvanceTimeType.Relative,
								key: 'last-24-h'
							}}
						/>
					)
				});
				component = page.rootInstance;
				component.internalSelectedTime = {
					type: ECalendarAdvanceTimeType.Absolute,
					key: '2020-04-01T00:00:00Z#2020-04-05T23:59:59Z'
				};

				actualResult = component.isApplyDisabled();
			});

			it('is should return false', () => {
				expect(actualResult).toBe(false);
			});
		});

		describe('and internal timezone is not equals to prop timezone', () => {
			let actualResult: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTime={{
								type: ECalendarAdvanceTimeType.Relative,
								key: 'last-24-h'
							}}
							selectedTimezone="Europe/Lisbon"
						/>
					)
				});
				component = page.rootInstance;
				component.internalSelectedTimezone = 'Africa/Abidjan';

				actualResult = component.isApplyDisabled();
			});

			it('is should return false', () => {
				expect(actualResult).toBe(false);
			});
		});

		describe('time is selected an internal timezone and time are equals to the props', () => {
			let actualResult: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTimezone="Europe/Lisbon"
							selectedTime={{
								type: ECalendarAdvanceTimeType.Relative,
								key: 'last-24-h'
							}}
						/>
					)
				});
				component = page.rootInstance;
				component.internalSelectedTimezone = 'Europe/Lisbon';
				component.internalSelectedTime = {
					type: ECalendarAdvanceTimeType.Relative,
					key: 'last-24-h'
				};

				actualResult = component.isApplyDisabled();
			});

			it('is should return true', () => {
				expect(actualResult).toBe(true);
			});
		});
	});

	describe('when `getInputConfig` is called', () => {
		describe('and the time is no selected', () => {
			let actualResult: Partial<ITextField>;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => <kv-advanced-date-select-dropdown />
				});
				component = page.rootInstance;

				actualResult = component.getInputConfig();
			});

			it('should return a config with undefined as the value', () => {
				expect(actualResult.value).toBeUndefined();
			});

			it('should return a config with undefined as the tooltip', () => {
				expect(actualResult.tooltipConfig.text).toBeUndefined();
			});
		});

		describe('and the selected time is relative', () => {
			let actualResult: Partial<ITextField>;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTime={{
								type: ECalendarAdvanceTimeType.Relative,
								key: 'last-24-h'
							}}
						/>
					)
				});
				component = page.rootInstance;

				actualResult = component.getInputConfig();
			});

			it('should return a config with the relative time label as the value', () => {
				expect(actualResult.value).toBe('Last 24 hours');
			});
		});

		describe('and the selected time is absolute', () => {
			let actualResult: Partial<ITextField>;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTime={{
								type: ECalendarAdvanceTimeType.Absolute,
								key: '2020-04-01T00:00:00Z#2020-04-05T23:59:59Z'
							}}
						/>
					)
				});
				component = page.rootInstance;

				actualResult = component.getInputConfig();
			});

			it('should return a config with the absolute time range as the value', () => {
				expect(actualResult.value).toBe('2020-04-01 00:00:00 to 2020-04-05 23:59:59');
			});
		});

		describe('and the timezone is not selected', () => {
			let actualResult: Partial<ITextField>;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTime={{
								type: ECalendarAdvanceTimeType.Absolute,
								key: '2020-04-01T00:00:00Z#2020-04-05T23:59:59Z'
							}}
						/>
					)
				});
				component = page.rootInstance;

				actualResult = component.getInputConfig();
			});

			it('should return a config with default timezone as the tooltip', () => {
				expect(actualResult.tooltipConfig.text).toBe('(+01:00) Europe/Lisbon');
			});
		});

		describe('and the timezone is selected', () => {
			let actualResult: Partial<ITextField>;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAdvancedDateSelectDropdown],
					template: () => (
						<kv-advanced-date-select-dropdown
							selectedTime={{
								type: ECalendarAdvanceTimeType.Absolute,
								key: '2020-04-01T00:00:00Z#2020-04-05T23:59:59Z'
							}}
							selectedTimezone="Africa/Abidjan"
						/>
					)
				});
				component = page.rootInstance;

				actualResult = component.getInputConfig();
			});

			it('should return a config with selected timezone as the tooltip', () => {
				expect(actualResult.tooltipConfig.text).toBe('(+00:00) Africa/Abidjan');
			});
		});
	});
});
