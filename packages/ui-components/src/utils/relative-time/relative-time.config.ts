import type dayjs from 'dayjs';
import { ERelativeTimeRangeKey, EUnitReference } from './relative-time.types';

/**
 * Configuration for relative time offset calculations.
 *
 * @remarks
 * Supports two patterns:
 * - Simple offset: `{ offset: -5, unit: 'minutes' }` - Calculates by adding/subtracting offset units from current time
 * - Unit reference offset: `{ offset: 0, unit: 'day', unitReference: 'startOfUnit' }` - Calculates relative to the start/end of a time unit
 */
export type RelativeTimeOffsetConfig = {
	/** Number of units to add (positive) or subtract (negative) */
	offset: number;
	/** The time unit to manipulate */
	unit: dayjs.ManipulateType | dayjs.QUnitType;
	/** Optional: Reference point within the unit (start or end) */
	unitReference?: EUnitReference;
};

/**
 * Configuration mapping for all relative time range keys.
 *
 * @remarks
 * Defines how each `ERelativeTimeRangeKey` should be calculated:
 * - Simple offsets add/subtract units from current time
 * - Unit reference offsets align to start/end of time units
 *
 * @see {RelativeTimeOffsetConfig}
 * @see {getRelativeTimeCalculation}
 */
export const RELATIVE_TIME_OFFSETS: Record<ERelativeTimeRangeKey, RelativeTimeOffsetConfig> = {
	[ERelativeTimeRangeKey.Last_5_m]: {
		offset: -5,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Last_10_m]: {
		offset: -10,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Last_15_m]: {
		offset: -15,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Last_30_m]: {
		offset: -30,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Last_1_H]: {
		offset: -1,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_3_H]: {
		offset: -3,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_6_H]: {
		offset: -6,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_12_H]: {
		offset: -12,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_24_H]: {
		offset: -24,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_48_H]: {
		offset: -48,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_72_H]: {
		offset: -72,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Last_3_D]: {
		offset: -3,
		unit: 'days'
	},
	[ERelativeTimeRangeKey.Last_7_D]: {
		offset: -7,
		unit: 'days'
	},
	[ERelativeTimeRangeKey.Last_14_D]: {
		offset: -14,
		unit: 'days'
	},
	[ERelativeTimeRangeKey.Last_30_D]: {
		offset: -30,
		unit: 'days'
	},
	[ERelativeTimeRangeKey.Last_90_D]: {
		offset: -90,
		unit: 'days'
	},
	[ERelativeTimeRangeKey.Last_1_M]: {
		offset: -1,
		unit: 'months'
	},
	[ERelativeTimeRangeKey.Last_6_M]: {
		offset: -6,
		unit: 'months'
	},
	[ERelativeTimeRangeKey.Last_1_Y]: {
		offset: -1,
		unit: 'years'
	},
	[ERelativeTimeRangeKey.Last_2_Y]: {
		offset: -2,
		unit: 'years'
	},
	[ERelativeTimeRangeKey.Last_5_Y]: {
		offset: -5,
		unit: 'years'
	},
	[ERelativeTimeRangeKey.Last_365_D]: {
		offset: -365,
		unit: 'days'
	},

	// Special - Unit-based references
	[ERelativeTimeRangeKey.Today]: {
		offset: 0,
		unit: 'day',
		unitReference: EUnitReference.StartOfUnit
	},
	[ERelativeTimeRangeKey.Yesterday]: {
		offset: -1,
		unit: 'day',
		unitReference: EUnitReference.StartOfUnit
	},
	[ERelativeTimeRangeKey.Yesterday_End]: {
		offset: -1,
		unit: 'day',
		unitReference: EUnitReference.EndOfUnit
	},

	// "So far" ranges (from start of unit to now)
	[ERelativeTimeRangeKey.This_Week_So_Far]: {
		offset: 0,
		unit: 'week',
		unitReference: EUnitReference.StartOfUnit
	},
	[ERelativeTimeRangeKey.This_Month_So_Far]: {
		offset: 0,
		unit: 'month',
		unitReference: EUnitReference.StartOfUnit
	},
	[ERelativeTimeRangeKey.This_Quarter_So_Far]: {
		offset: 0,
		unit: 'quarter',
		unitReference: EUnitReference.StartOfUnit
	},
	[ERelativeTimeRangeKey.This_Year_So_Far]: {
		offset: 0,
		unit: 'year',
		unitReference: EUnitReference.StartOfUnit
	},

	[ERelativeTimeRangeKey.Next_5_M]: {
		offset: 5,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Next_10_M]: {
		offset: 10,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Next_15_M]: {
		offset: 15,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Next_30_M]: {
		offset: 30,
		unit: 'minutes'
	},
	[ERelativeTimeRangeKey.Next_1_H]: {
		offset: 1,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Next_6_H]: {
		offset: 6,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Next_12_H]: {
		offset: 12,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Next_24_H]: {
		offset: 24,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Next_48_H]: {
		offset: 48,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Next_72_H]: {
		offset: 72,
		unit: 'hours'
	},
	[ERelativeTimeRangeKey.Next_7_D]: {
		offset: 7,
		unit: 'days'
	},
	[ERelativeTimeRangeKey.Next_2_W]: {
		offset: 2,
		unit: 'weeks'
	},
	[ERelativeTimeRangeKey.Next_1_M]: {
		offset: 1,
		unit: 'months'
	}
};
