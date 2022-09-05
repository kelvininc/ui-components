import { capitalize } from 'lodash-es';
import { calculateDate, formatTimezoneName, getDefaultTimezone, getTimezoneOffset } from '../../utils/date.helper';
import { SelectedRange } from '../calendar/calendar.types';
import { ISingleSelectDropdownOption, ISingleSelectDropdownOptions } from '../single-select-dropdown/single-select-dropdown.types';
import { DEFAULT_TIMEZONE_GROUP_NAME, OTHER_TIMEZONES_GROUP_NAME } from './calendar-advanced-date-selector.config';
import { ITimezoneOffset, RelativeTimeOption } from './calendar-advanced-date-selector.types';

const buildDropdownOption = (label: string, timezone: string, group: string = OTHER_TIMEZONES_GROUP_NAME): ISingleSelectDropdownOption => ({
	value: timezone,
	label,
	group
});

export const buildTimezoneByOffset = (timezones: string[]): ITimezoneOffset[] => {
	return timezones
		.map(name => {
			const offset = getTimezoneOffset(name);
			const label = formatTimezoneName(name);

			return { offset, name, label };
		})
		.sort((name1, name2) => name1.offset - name2.offset);
};

export const buildTimezonesDropdownOptions = (timezones: ITimezoneOffset[]): ISingleSelectDropdownOptions => {
	const defaultTimezone = getDefaultTimezone();
	let initialValue = {};

	const timezone = timezones.find(({ name }) => name === defaultTimezone);
	if (timezone) {
		initialValue = {
			[defaultTimezone]: buildDropdownOption(timezone.label, timezone.name, DEFAULT_TIMEZONE_GROUP_NAME)
		};
	}

	if (timezones)
		return timezones.reduce<ISingleSelectDropdownOptions>((accumulator, { label, name }) => {
			accumulator[name] = accumulator[name] ?? buildDropdownOption(label, name);

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

export const getDatesRangeFromRelativeOption = (relativeTimeOptionValue: string, relativeTimeOptions: RelativeTimeOption[], timezone?: string): SelectedRange => {
	const relativeTimeOption = relativeTimeOptions.find(({ value }) => value === relativeTimeOptionValue);

	if (relativeTimeOption === undefined) {
		return [];
	}

	const { startDate, endDate } = relativeTimeOption;

	return [startDate, endDate].map(date => calculateDate(date?.relativeDate, date?.amount, date?.unit).tz(timezone).format()) as [string, string];
};
