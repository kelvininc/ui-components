import { ERelativeTimeComparisonConfig, EUnitReference, IRelativeTimePickerOption } from './relative-time-picker.types';

export const TIME_RANGE_UPDATE_INTERVAL = 10000;
export const CUSTOMIZE_INTERVAL_KEY = 'customize-interval';
export const CUSTOMIZE_INTERVAL_LABEL = 'Custom Interval';

export const TIMEZONES_PLACEHOLDER = 'Select a timezone';
export const TIMEZONES_SEARCH_PLACEHOLDER = 'Search for a timezone';

export const DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS: IRelativeTimePickerOption[][] = [
	[
		{
			label: 'Today',
			value: 'today',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'day',
				unitReference: EUnitReference.StartOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'until',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Yesterday',
			value: 'yesterday',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: -1,
				unit: 'days',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: -1,
				unit: 'days',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM'
			}
		}
	],
	[
		{
			label: 'Last 24 hours',
			value: 'last-24-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -24,
				unit: 'hours'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		},
		{
			label: 'Last 48 hours',
			value: 'last-48-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -48,
				unit: 'hours'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		},
		{
			label: 'Last 7 days',
			value: 'last-7-d',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -7,
				unit: 'days'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM'
			}
		},
		{
			label: 'Last 30 days',
			value: 'last-30-d',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -30,
				unit: 'days'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM'
			}
		},
		{
			label: 'Last 90 days',
			value: 'last-90-d',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -90,
				unit: 'days'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM'
			}
		},
		{
			label: 'Last 6 months',
			value: 'last-6-m',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -6,
				unit: 'months'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM'
			}
		}
	],
	[
		{
			label: 'Last 5 minutes',
			value: 'last-5-m',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -5,
				unit: 'minutes'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Last 15 minutes',
			value: 'last-15-m',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -15,
				unit: 'minutes'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Last 30 minutes',
			value: 'last-30-m',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -30,
				unit: 'minutes'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Last 1 hour',
			value: 'last-1-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -1,
				unit: 'hour'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Last 3 hours',
			value: 'last-3-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -3,
				unit: 'hours'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Last 6 hours',
			value: 'last-6-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -6,
				unit: 'hours'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		},
		{
			label: 'Last 12 hours',
			value: 'last-12-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -12,
				unit: 'hours'
			},
			labelRangeFormatter: {
				startDateFormatter: 'HH:mm',
				separator: 'to',
				endDateFormatter: 'HH:mm'
			}
		}
	],
	[
		{
			label: 'Last 365 days',
			value: 'last-365-d',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -365,
				unit: 'days'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM YYYY',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		},
		{
			label: 'Last 2 years',
			value: 'last-2-y',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -2,
				unit: 'years'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM YYYY',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		}
	],
	[
		{
			label: 'This week so far',
			value: 'this-week-so-far',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'week',
				unitReference: EUnitReference.StartOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		},
		{
			label: 'This month so far',
			value: 'this-month-so-far',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'month',
				unitReference: EUnitReference.StartOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		},
		{
			label: 'This quarter so far',
			value: 'this-quarter-so-far',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'quarter',
				unitReference: EUnitReference.StartOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		},
		{
			label: 'This year so far',
			value: 'this-year-so-far',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'year',
				unitReference: EUnitReference.StartOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		}
	]
];

export const BOTTOM_OPTIONS_HEIGHT = 41;
export const SELECT_OPTION_HEIGHT = 32;
export const GROUP_GAP = 12; //spacing-3x
export const MAX_HEIGHT = 347;
export const PADDING_SIZE = 16; //spacing-4x
