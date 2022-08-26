import { capitalize } from 'lodash-es';
import { calculateDate, formatTimezoneName, getDefaultTimezone } from '../../utils/date.helper';
import { SelectedRange } from '../calendar/calendar.types';
import { ISingleSelectDropdownOption, ISingleSelectDropdownOptions } from '../single-select-dropdown/single-select-dropdown.types';
import { DEFAULT_TIMEZONE_GROUP_NAME, OTHER_TIMEZONES_GROUP_NAME } from './calendar-advanced-date-selector.config';
import { RelativeTimeOption } from './calendar-advanced-date-selector.types';

const buildDropdownOption = (timezone: string, group: string = OTHER_TIMEZONES_GROUP_NAME): ISingleSelectDropdownOption => ({
	label: formatTimezoneName(timezone),
	value: timezone,
	group
});

export const buildTimezonesDropdownOptions = (timezones: string[]): ISingleSelectDropdownOptions => {
	const defaultTimezone = getDefaultTimezone();

	let initialValue = {
		[defaultTimezone]: buildDropdownOption(defaultTimezone, DEFAULT_TIMEZONE_GROUP_NAME)
	};

	if (!timezones.includes(defaultTimezone)) {
		initialValue = {};
	}

	if (timezones)
		return timezones.reduce<ISingleSelectDropdownOptions>((accumulator, timezone) => {
			accumulator[timezone] = accumulator[timezone] ?? buildDropdownOption(timezone);

			return accumulator;
		}, initialValue);
};

export const buildAbsoluteTimeStartPlaceholderWhenRelativeSelected = (relativeTimeValue: string, relativeTimeOptions: RelativeTimeOption[]): string | undefined => {
	let relativeTimeOptionLabel = relativeTimeOptions.find(option => option.value === relativeTimeValue)?.label;

	if (relativeTimeOptionLabel === undefined) {
		return;
	}

	// remove last suffix
	if (relativeTimeOptionLabel.startsWith('Last ')) {
		relativeTimeOptionLabel = relativeTimeOptionLabel.substring('Last '.length, relativeTimeOptionLabel.length);
	}

	return `Now - ${capitalize(relativeTimeOptionLabel)}`;
};

export const getDatesRangeFromRelativeOption = (relativeTimeOptionValue: string, relativeTimeOptions: RelativeTimeOption[]): SelectedRange => {
	const relativeTimeOption = relativeTimeOptions.find(({ value }) => value === relativeTimeOptionValue);

	if (relativeTimeOption === undefined) {
		return [];
	}

	const { startDate, endDate } = relativeTimeOption;

	return [startDate, endDate].map(date => calculateDate(date?.relativeDate, date?.amount, date?.unit).toISOString()) as [string, string];
};
