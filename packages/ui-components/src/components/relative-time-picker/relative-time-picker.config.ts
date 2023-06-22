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
				unit: 'days',
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
		},
		{
			label: 'This week',
			value: 'this-week',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'week',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: 0,
				unit: 'week',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM'
			}
		},
		{
			label: 'This month',
			value: 'this-month',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'month',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: 0,
				unit: 'month',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM'
			}
		},
		{
			label: 'This quarter',
			value: 'this-quarter',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'quarter',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: 0,
				unit: 'quarter',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		},
		{
			label: 'This year',
			value: 'this-year',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: 0,
				unit: 'year',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: 0,
				unit: 'year',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
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
			label: 'Last 2 hours',
			value: 'last-2-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -2,
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
		},
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
			label: 'Last 72 hours',
			value: 'last-72-h',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -72,
				unit: 'hours'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM HH:mm',
				separator: 'to',
				endDateFormatter: 'D MMM HH:mm'
			}
		}
	],
	[
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
			label: 'Last week',
			value: 'last-1-w',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: -1,
				unit: 'week',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: -1,
				unit: 'week',
				unitReference: EUnitReference.EndOfUnit
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
			label: 'Last month',
			value: 'last-1-m',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: -1,
				unit: 'month',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: -1,
				unit: 'month',
				unitReference: EUnitReference.EndOfUnit
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
			label: 'Last 90 days',
			value: 'last-90-d',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -90,
				unit: 'days'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM YYYY',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		},
		{
			label: 'Last quarter',
			value: 'last-1-q',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: -1,
				unit: 'quarter',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: -1,
				unit: 'quarter',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
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
			label: 'Last year',
			value: 'last-1-y',
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: -1,
				unit: 'year',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: -1,
				unit: 'year',
				unitReference: EUnitReference.EndOfUnit
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		}
	],
	[
		{
			label: 'Last 731 days',
			value: 'last-731-d',
			comparisonConfig: ERelativeTimeComparisonConfig.RelativeAmountOfUnits,
			startDate: {
				amount: -731,
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
			comparisonConfig: ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits,
			startDate: {
				amount: -2,
				unit: 'year',
				unitReference: EUnitReference.StartOfUnit
			},
			endDate: {
				amount: -1,
				unit: 'year',
				unitReference: EUnitReference.EndOfUnit
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
			label: 'All time',
			value: 'all-time',
			comparisonConfig: ERelativeTimeComparisonConfig.StartDate,
			startDate: {
				date: '2018-01-01',
				dateFormat: 'YYYY-MM-DD'
			},
			labelRangeFormatter: {
				startDateFormatter: 'D MMM YYYY',
				separator: 'to',
				endDateFormatter: 'D MMM YYYY'
			}
		}
	]
];

export const BOTTOM_OPTIONS_HEIGHT = 41;
export const SELECT_OPTION_HEIGHT = 32;
export const GROUP_GAP = 12; //spacing-3x
export const MAX_HEIGHT = 347;
export const PADDING_SIZE = 16; //spacing-4x
