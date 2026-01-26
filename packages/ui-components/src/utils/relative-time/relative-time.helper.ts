import dayjs from 'dayjs';
import { ERelativeTimeComparisonConfig, IRelativeTimePickerOption } from '../../types';
import { calculateOffsetDate, isDateTimeBefore, newDate, newTimezoneDate, newTimezoneDateFromFormat } from '../date/date.helper';
import { DayjsTimeRange, TimestampRange, type SelectedRange } from '../types';
import { RELATIVE_TIME_OFFSETS } from './relative-time.config';
import { DateTimeCalculation, ERelativeTimeRangeKey, EUnitReference, IDateTimeRangeFormatter } from './relative-time.types';

/** Date range builders */
export const buildOptionRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	switch (option.comparisonConfig) {
		case ERelativeTimeComparisonConfig.StartDateEndDate:
			return buildStartDateEndDateConfigRange(option, timeZone);
		case ERelativeTimeComparisonConfig.StartDate || ERelativeTimeComparisonConfig.EndDate:
			return buildSingleDateConfigRange(option, timeZone);
		case ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits:
			return buildAbsoluteAmountOfUnitsConfigRange(option, timeZone);
		default:
			return buildRelativeAmountOfUnitsConfigRange(option, timeZone);
	}
};

// Build date from config with start and end date
export const buildStartDateEndDateConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const startDateTime = newTimezoneDateFromFormat(timeZone, option.startDate.dateFormat, option.startDate.date);
	const endDateTime = newTimezoneDateFromFormat(timeZone, option.endDate.dateFormat, option.endDate.date);

	return buildDayjsRange(startDateTime, endDateTime);
};

// Build date from config with start or end date
export const buildSingleDateConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const nowDateTime = newTimezoneDate(timeZone);
	const calculatedDate = newTimezoneDateFromFormat(timeZone, option.startDate.dateFormat, option.startDate.date);

	return buildDayjsRange(nowDateTime, calculatedDate);
};

// Build date with both start and end date relative to now timestamp
export const buildAbsoluteAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const nowDateTime = newTimezoneDate(timeZone);
	const { unit: startDateUnit, amount: startDateAmount, unitReference: startUnitReference } = option.startDate;
	const { unit: endDateUnit, amount: endDateAmount, unitReference: endUnitReference } = option.endDate;

	const startDateTime = calculateOffsetDateWithUnitReference(calculateOffsetDate(nowDateTime, startDateAmount, startDateUnit), startDateUnit, startUnitReference);
	const endDateTime = calculateOffsetDateWithUnitReference(calculateOffsetDate(nowDateTime, endDateAmount, endDateUnit), endDateUnit, endUnitReference);

	return buildDayjsRange(startDateTime, endDateTime);
};

// Build date with start date relative to now timestamp
export const buildRelativeAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const nowDateTime = newTimezoneDate(timeZone);
	const { amount, unit, unitReference } = option.startDate;
	const calculatedDate = calculateOffsetDateWithUnitReference(calculateOffsetDate(nowDateTime, amount, unit), unit, unitReference);

	return buildDayjsRange(nowDateTime, calculatedDate);
};

const calculateOffsetDateWithUnitReference = (date: dayjs.Dayjs, unit: dayjs.ManipulateType | dayjs.QUnitType, unitReference?: EUnitReference): dayjs.Dayjs => {
	if (!unitReference) {
		return date;
	}

	return unitReference === EUnitReference.StartOfUnit ? date.startOf(unit) : date.endOf(unit);
};

/**
 * Builds the range of the start and end date and returns the range array, ordering the dates if needed
 * @param dateA date (start or end)
 * @param dateB date (start or end)
 * @returns range containing start date and end date ordered
 */
export const buildDayjsRange = (dateA: dayjs.Dayjs, dateB: dayjs.Dayjs): DayjsTimeRange => {
	return isDateTimeBefore(dateA, dateB) ? [dateA, dateB] : [dateB, dateA];
};

export const buildTimestampRange = ([startDate, endDate]: DayjsTimeRange): TimestampRange => [startDate.valueOf(), endDate.valueOf()];

/**
 * Finds a relative time option by its key from the provided options groups.
 *
 * @param key - The option key to search for
 * @param options - Optional: The option groups to search in (defaults to DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS)
 * @returns The matching option or undefined
 */
export const getRelativeTimeOption = (key: string, options?: IRelativeTimePickerOption[][]) =>
	(options ?? DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS).flat().find(option => option.value === key);

/**
 * Derives DateTimeCalculation configuration from a relative time range key.
 * This eliminates manual duplication of offset data.
 *
 * @param key - The relative time range key
 * @returns DateTimeCalculation object ready for use in IRelativeTimePickerOption
 *
 * @example
 * ```typescript
 * // Simple offset
 * getRelativeTimeCalculation(ERelativeTimeRangeKey.Last_5_m)
 * // Returns: { amount: -5, unit: 'minutes' }
 * ```
 *
 * @example
 * ```typescript
 * // Unit reference offset
 * getRelativeTimeCalculation(ERelativeTimeRangeKey.Today)
 * // Returns: { amount: 0, unit: 'day', unitReference: EUnitReference.StartOfUnit }
 * ```
 *
 * @throws {Error} If no configuration is found for the provided key
 */
export const getRelativeTimeCalculation = (key: ERelativeTimeRangeKey): DateTimeCalculation => {
	const config = RELATIVE_TIME_OFFSETS[key];

	if (config === undefined) {
		throw new Error(`No offset configuration found for key: ${key}`);
	}

	return {
		amount: config.offset,
		unit: config.unit,
		...(config.unitReference !== undefined && { unitReference: config.unitReference })
	};
};

/**
 * Builder function to create IRelativeTimePickerOption with automatic
 * startDate/endDate derivation from RELATIVE_TIME_OFFSETS.
 *
 * @param label - Display label for the option
 * @param value - Relative time range key
 * @param comparisonConfig - How the time calculation should be performed
 * @param labelRangeFormatter - Optional formatter for date range display
 * @param endDateKey - Optional: If provided, derives endDate from this key
 * @returns Complete IRelativeTimePickerOption
 *
 * @example
 * ```typescript
 * // Simple option
 * buildRelativeTimeOption(
 *   'Last 5 minutes',
 *   ERelativeTimeRangeKey.Last_5_m,
 *   ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
 *   {
 *     startDateFormatter: 'HH:mm',
 *     separator: 'to',
 *     endDateFormatter: 'HH:mm'
 *   }
 * )
 * ```
 *
 * @example
 * ```typescript
 * // Option with endDate
 * buildRelativeTimeOption(
 *   'Yesterday',
 *   ERelativeTimeRangeKey.Yesterday,
 *   ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
 *   { startDateFormatter: 'D MMM' },
 *   ERelativeTimeRangeKey.Yesterday_End
 * )
 * ```
 */
export const buildRelativeTimeOption = (
	label: string,
	value: ERelativeTimeRangeKey,
	comparisonConfig: ERelativeTimeComparisonConfig,
	labelRangeFormatter?: IDateTimeRangeFormatter,
	endDateKey?: ERelativeTimeRangeKey
): IRelativeTimePickerOption => {
	const option: IRelativeTimePickerOption = {
		label,
		value,
		comparisonConfig,
		startDate: getRelativeTimeCalculation(value),
		...(labelRangeFormatter !== undefined && { labelRangeFormatter })
	};

	if (endDateKey !== undefined) {
		option.endDate = getRelativeTimeCalculation(endDateKey);
	}

	return option;
};

/**
 * Validates that all keys in RELATIVE_TIME_OFFSETS are valid enum values.
 * Useful for development/testing to ensure consistency.
 *
 * @returns true if all keys are valid
 * @throws {Error} If any invalid keys are found
 *
 * @example
 * ```typescript
 * // In tests or development
 * validateRelativeTimeOffsets(); // throws if config is invalid
 * ```
 */
export const validateRelativeTimeOffsets = (): boolean => {
	const enumValues = Object.values(ERelativeTimeRangeKey);
	const offsetKeys = Object.keys(RELATIVE_TIME_OFFSETS);

	const invalidKeys = offsetKeys.filter(key => !enumValues.includes(key as ERelativeTimeRangeKey));

	if (invalidKeys.length > 0) {
		throw new Error(`Invalid keys in RELATIVE_TIME_OFFSETS: ${invalidKeys.join(', ')}`);
	}

	return true;
};

/**
 * Default relative time option groups for the time picker component.
 *
 * @remarks
 * This configuration is built using the `buildRelativeTimeOption` helper to ensure
 * consistency with `RELATIVE_TIME_OFFSETS` and avoid data duplication.
 *
 * Organized into 5 groups:
 * 1. Today/Yesterday
 * 2. Day/Month ranges (24h, 48h, 7d, 30d, 90d, 6M)
 * 3. Minute/Hour ranges (5m, 15m, 30m, 1h, 3h, 6h, 12h)
 * 4. Long-term ranges (365d, 2y)
 * 5. "So far" ranges (week, month, quarter, year)
 */
export const DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS: IRelativeTimePickerOption[][] = [
	[
		buildRelativeTimeOption('Today', ERelativeTimeRangeKey.Today, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM',
			separator: 'until',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption(
			'Yesterday',
			ERelativeTimeRangeKey.Yesterday,
			ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			{
				startDateFormatter: 'D MMM'
			},
			ERelativeTimeRangeKey.Yesterday_End
		)
	],
	[
		buildRelativeTimeOption('Last 24 hours', ERelativeTimeRangeKey.Last_24_H, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM HH:mm',
			separator: 'to',
			endDateFormatter: 'D MMM HH:mm'
		}),
		buildRelativeTimeOption('Last 48 hours', ERelativeTimeRangeKey.Last_48_H, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM HH:mm',
			separator: 'to',
			endDateFormatter: 'D MMM HH:mm'
		}),
		buildRelativeTimeOption('Last 7 days', ERelativeTimeRangeKey.Last_7_D, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM',
			separator: 'to',
			endDateFormatter: 'D MMM'
		}),
		buildRelativeTimeOption('Last 30 days', ERelativeTimeRangeKey.Last_30_D, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM',
			separator: 'to',
			endDateFormatter: 'D MMM'
		}),
		buildRelativeTimeOption('Last 90 days', ERelativeTimeRangeKey.Last_90_D, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM',
			separator: 'to',
			endDateFormatter: 'D MMM'
		}),
		buildRelativeTimeOption('Last 6 months', ERelativeTimeRangeKey.Last_6_M, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM',
			separator: 'to',
			endDateFormatter: 'D MMM'
		})
	],
	[
		buildRelativeTimeOption('Last 5 minutes', ERelativeTimeRangeKey.Last_5_m, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption('Last 15 minutes', ERelativeTimeRangeKey.Last_15_m, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption('Last 30 minutes', ERelativeTimeRangeKey.Last_30_m, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption('Last 1 hour', ERelativeTimeRangeKey.Last_1_H, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption('Last 3 hours', ERelativeTimeRangeKey.Last_3_H, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption('Last 6 hours', ERelativeTimeRangeKey.Last_6_H, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		}),
		buildRelativeTimeOption('Last 12 hours', ERelativeTimeRangeKey.Last_12_H, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'HH:mm',
			separator: 'to',
			endDateFormatter: 'HH:mm'
		})
	],
	[
		buildRelativeTimeOption('Last 365 days', ERelativeTimeRangeKey.Last_365_D, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM YYYY',
			separator: 'to',
			endDateFormatter: 'D MMM YYYY'
		}),
		buildRelativeTimeOption('Last 2 years', ERelativeTimeRangeKey.Last_2_Y, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM YYYY',
			separator: 'to',
			endDateFormatter: 'D MMM YYYY'
		})
	],
	[
		buildRelativeTimeOption('This week so far', ERelativeTimeRangeKey.This_Week_So_Far, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM HH:mm',
			separator: 'to',
			endDateFormatter: 'D MMM HH:mm'
		}),
		buildRelativeTimeOption('This month so far', ERelativeTimeRangeKey.This_Month_So_Far, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM HH:mm',
			separator: 'to',
			endDateFormatter: 'D MMM HH:mm'
		}),
		buildRelativeTimeOption('This quarter so far', ERelativeTimeRangeKey.This_Quarter_So_Far, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM HH:mm',
			separator: 'to',
			endDateFormatter: 'D MMM HH:mm'
		}),
		buildRelativeTimeOption('This year so far', ERelativeTimeRangeKey.This_Year_So_Far, ERelativeTimeComparisonConfig.RelativeAmountOfUnits, {
			startDateFormatter: 'D MMM HH:mm',
			separator: 'to',
			endDateFormatter: 'D MMM HH:mm'
		})
	]
];

/**
 * Base helper function to calculate relative time range.
 * @param key the relative time key
 * @param cursor the relative timestamp cursor (as dayjs instance)
 * @returns DayjsTimeRange with start and end dates
 * @private
 */
const getRelativeTimeRange = (key: ERelativeTimeRangeKey, cursor: dayjs.Dayjs): DayjsTimeRange => {
	const { offset, unit } = RELATIVE_TIME_OFFSETS[key];

	let startDate: dayjs.Dayjs;
	let endDate: dayjs.Dayjs;

	if (offset < 0) {
		startDate = calculateOffsetDate(cursor, offset, unit);
		endDate = cursor;
	} else {
		endDate = calculateOffsetDate(cursor, offset, unit);
		startDate = cursor;
	}

	return [startDate, endDate];
};

/**
 * Returns a start and end time according to a relative time range in utc.
 * @param key the relative time key
 * @param cursor the relative timestamp cursor
 * @returns an array with datetime strings
 */
export const getRelativeTimeRangeISO = (key: ERelativeTimeRangeKey, cursor: string | number | Date = newDate().toISOString()): [string, string] => {
	const cursorDate = newDate(cursor);
	const [startDate, endDate] = getRelativeTimeRange(key, cursorDate);
	return [startDate.toISOString(), endDate.toISOString()];
};

/**
 * Returns a start and end time according to a relative time range as timestamps.
 * @param key the relative time key
 * @param cursor the relative timestamp cursor
 * @returns an array with timestamps
 */
export const getRelativeTimeRangeTimestamp = (key: ERelativeTimeRangeKey, cursor = newDate()): [number, number] => {
	const [startDate, endDate] = getRelativeTimeRange(key, cursor);
	return [startDate.valueOf(), endDate.valueOf()];
};

/**
 * Returns the provided range in utc.
 * @range the absolute time range
 * @offset the timezone offset
 * @returns an array with datetime strings
 */
export const getAbsoluteTimeRange = (range: SelectedRange, offset = 0): [string, string] => {
	return range.map(date => calculateOffsetDate(date, offset, 'minutes').toISOString()) as [string, string];
};
