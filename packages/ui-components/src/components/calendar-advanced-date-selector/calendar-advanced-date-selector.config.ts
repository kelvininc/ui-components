import { ITextField, RelativeTimeOption } from '../../types';

export const DEFAULT_TIMEZONE_GROUP_NAME = 'System Timezone - Default';
export const OTHER_TIMEZONES_GROUP_NAME = 'Other Timezones';
export const TIMEZONES_PLACEHOLDER = 'Select a timezone';
export const TIMEZONES_SEARCH_LABEL = 'Timezone';
export const TIMEZONES_SEARCH_PLACEHOLDER = 'Search for a timezone';

export const DEFAULT_START_DATE_INPUT_CONFIG: Partial<ITextField> = {
	label: 'From',
	placeholder: 'Select a start date'
};
export const DEFAULT_END_DATE_INPUT_CONFIG: Partial<ITextField> = {
	label: 'To',
	placeholder: 'Select an end date'
};

export const DEFAULT_RELATIVE_TIME_OPTIONS: RelativeTimeOption[] = [
	{
		label: 'Last 24 hours',
		value: 'last-24-h',
		startDate: {
			amount: -24,
			unit: 'hours'
		}
	},
	{
		label: 'Last 3 days',
		value: 'last-3-d',
		startDate: {
			amount: -3,
			unit: 'days'
		}
	},
	{
		label: 'Last week',
		value: 'last-7-d',
		startDate: {
			amount: -7,
			unit: 'days'
		}
	},
	{
		label: 'Last month',
		value: 'last-1-m',
		startDate: {
			amount: -1,
			unit: 'months'
		}
	}
];
