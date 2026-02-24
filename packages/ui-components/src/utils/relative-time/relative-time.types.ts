import type dayjs from 'dayjs';
import type { DateInput } from '../../types';

/**
 * Relative time range keys for predefined time periods.
 *
 * @remarks
 * These keys are used to define standard time ranges in the time picker component.
 * Each key has a corresponding configuration in `RELATIVE_TIME_OFFSETS`.
 *
 * @example
 * ```typescript
 * import { ERelativeTimeRangeKey, getRelativeTimeCalculation } from '@kelvininc/ui-components';
 *
 * const config = getRelativeTimeCalculation(ERelativeTimeRangeKey.Last_24_H);
 * // Returns: { amount: -24, unit: 'hours' }
 * ```
 */
export enum ERelativeTimeRangeKey {
	// Minutes - Past
	Last_5_m = 'last-5-m',
	Last_10_m = 'last-10-m',
	Last_15_m = 'last-15-m',
	Last_30_m = 'last-30-m',

	// Hours - Past
	Last_1_H = 'last-1-h',
	Last_3_H = 'last-3-h',
	Last_6_H = 'last-6-h',
	Last_12_H = 'last-12-h',
	Last_24_H = 'last-24-h',
	Last_48_H = 'last-48-h',
	Last_72_H = 'last-72-h',

	// Days - Past
	Last_3_D = 'last-3-d',
	Last_7_D = 'last-7-d',
	Last_14_D = 'last-14-d',
	Last_30_D = 'last-30-d',
	Last_90_D = 'last-90-d',
	Last_365_D = 'last-365-d',

	// Months - Past
	Last_1_M = 'last-1-M',
	Last_6_M = 'last-6-M',

	// Years - Past
	Last_1_Y = 'last-1-y',
	Last_2_Y = 'last-2-y',
	Last_5_Y = 'last-5-y',

	// Special - Unit-based references
	Today = 'today',
	Yesterday = 'yesterday',
	Yesterday_End = 'yesterday-end',

	// "So far" ranges (from start of unit to now)
	This_Week_So_Far = 'this-week-so-far',
	This_Month_So_Far = 'this-month-so-far',
	This_Quarter_So_Far = 'this-quarter-so-far',
	This_Year_So_Far = 'this-year-so-far',

	// Minutes - Future
	Next_5_M = 'next-5-m',
	Next_10_M = 'next-10-m',
	Next_15_M = 'next-15-m',
	Next_30_M = 'next-30-m',

	// Hours - Future
	Next_1_H = 'next-1-h',
	Next_6_H = 'next-6-h',
	Next_12_H = 'next-12-h',
	Next_24_H = 'next-24-h',
	Next_48_H = 'next-48-h',
	Next_72_H = 'next-72-h',

	// Days - Future
	Next_7_D = 'next-7-d',

	// Weeks - Future
	Next_2_W = 'next-2-w',

	// Months - Future
	Next_1_M = 'next-1-m'
}

/**
 * Unit reference for relative time calculations.
 * Defines whether to align to the start or end of a time unit.
 *
 * @example
 * ```typescript
 * // "Today" starts at the beginning of the current day
 * { amount: 0, unit: 'day', unitReference: EUnitReference.StartOfUnit }
 *
 * // "End of yesterday" aligns to the end of the previous day
 * { amount: -1, unit: 'day', unitReference: EUnitReference.EndOfUnit }
 * ```
 */
export enum EUnitReference {
	StartOfUnit = 'startOfUnit',
	EndOfUnit = 'endOfUnit'
}

/**
 * Configuration for calculating a specific date/time relative to a reference point.
 *
 * @remarks
 * This type supports both simple offsets (e.g., "5 minutes ago") and unit-aligned
 * calculations (e.g., "start of today").
 *
 * @example
 * ```typescript
 * // Simple offset: "5 minutes ago"
 * const fiveMinutesAgo: DateTimeCalculation = {
 *   amount: -5,
 *   unit: 'minutes'
 * };
 *
 * // Unit-aligned: "start of today"
 * const startOfToday: DateTimeCalculation = {
 *   amount: 0,
 *   unit: 'day',
 *   unitReference: EUnitReference.StartOfUnit
 * };
 *
 * // Custom reference date
 * const fromSpecificDate: DateTimeCalculation = {
 *   date: '2024-01-01',
 *   dateFormat: 'YYYY-MM-DD',
 *   amount: 7,
 *   unit: 'days'
 * };
 * ```
 */
export type DateTimeCalculation = {
	/**
	 * Reference date for the calculation.
	 * If undefined, current time (now) will be used.
	 */
	date?: DateInput;

	/**
	 * Format of the provided date string.
	 * Only required if `date` is a string.
	 */
	dateFormat?: string;

	/**
	 * Number of units to add (positive) or subtract (negative)
	 * from the reference date.
	 *
	 * @example
	 * -5  // 5 units in the past
	 * 0   // Current unit (often used with unitReference)
	 * 10  // 10 units in the future
	 */
	amount?: number;

	/**
	 * The time unit to manipulate.
	 *
	 * Supports dayjs ManipulateType (millisecond, second, minute, hour, day, week, month, year)
	 * and QUnitType (quarter) for quarter-based calculations.
	 */
	unit?: dayjs.ManipulateType | dayjs.QUnitType;

	/**
	 * Optional: Align the result to the start or end of the specified unit.
	 *
	 * @example
	 * // "Start of this week"
	 * { amount: 0, unit: 'week', unitReference: EUnitReference.StartOfUnit }
	 *
	 * // "End of yesterday"
	 * { amount: -1, unit: 'day', unitReference: EUnitReference.EndOfUnit }
	 */
	unitReference?: EUnitReference;
};

/**
 * Formatter configuration for displaying date/time ranges.
 *
 * @remarks
 * Used to control how relative time options are displayed in the UI.
 * Dates are formatted using dayjs format strings.
 *
 * @example
 * ```typescript
 * // Display as "14 Feb until 12:39"
 * const formatter: IDateTimeRangeFormatter = {
 *   startDateFormatter: 'D MMM',
 *   separator: 'until',
 *   endDateFormatter: 'HH:mm'
 * };
 *
 * // Display as "1 Jan 2024 to 31 Jan 2024"
 * const rangeFormatter: IDateTimeRangeFormatter = {
 *   startDateFormatter: 'D MMM YYYY',
 *   separator: 'to',
 *   endDateFormatter: 'D MMM YYYY'
 * };
 *
 * // Display only start date (no end date shown)
 * const singleDateFormatter: IDateTimeRangeFormatter = {
 *   startDateFormatter: 'D MMM'
 * };
 * ```
 */
export interface IDateTimeRangeFormatter {
	/**
	 * Dayjs format string for the start date.
	 * If empty, start date will not be displayed.
	 *
	 * @see https://day.js.org/docs/en/display/format
	 */
	startDateFormatter?: string;

	/**
	 * Dayjs format string for the end date.
	 * If empty, end date will not be displayed.
	 *
	 * @see https://day.js.org/docs/en/display/format
	 */
	endDateFormatter?: string;

	/**
	 * Text separator between start and end dates.
	 * Common values: "to", "until", "-"
	 *
	 * If empty, no separator will appear between dates.
	 *
	 * @example "until" // "14 Feb until 12:39"
	 * @example "to"    // "1 Jan to 31 Jan"
	 * @example "-"     // "10:00 - 11:00"
	 */
	separator?: string;
}

/**
 * Custom interval key for time range picker.
 *
 * @remarks
 * Used to indicate that the user has selected a custom interval.
 */
export const CUSTOM_TIME_RANGE_KEY = 'customize-interval';

/**
 * Type for time range calendar keys.
 *
 * @remarks
 * Union type of all possible time range calendar keys.
 */
export type TimeRangeCalendarKeys = ERelativeTimeRangeKey | typeof CUSTOM_TIME_RANGE_KEY;
