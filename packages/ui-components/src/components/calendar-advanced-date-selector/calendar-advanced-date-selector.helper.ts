import { capitalize, isEmpty } from 'lodash-es';
import { calculateDate, formatTimezoneName, getDefaultTimezone, getTimezoneOffset } from '../../utils/date.helper';
import { SelectedRange } from '../calendar/calendar.types';
import { ISelectSingleOption, ISelectSingleOptions } from '../single-select-dropdown/single-select-dropdown.types';
import { DEFAULT_TIMEZONE_GROUP_LABEL, DEFAULT_TIMEZONE_GROUP_NAME, OTHER_TIMEZONES_GROUP_LABEL, OTHER_TIMEZONES_GROUP_NAME } from './calendar-advanced-date-selector.config';
import { ITimezoneOffset, RelativeTimeOption } from './calendar-advanced-date-selector.types';

const buildDropdownOption = (label: string, timezone: string): ISelectSingleOption => ({
	value: timezone,
	label
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

export const filterDefaultTimezone = (timezones: ITimezoneOffset[], defaultTimezone: string): ITimezoneOffset[] => {
	if (isEmpty(defaultTimezone)) return timezones;

	return timezones.filter(item => item.name !== defaultTimezone);
};

export const buildTimezonesDropdownOptions = (timezones: ITimezoneOffset[]): ISelectSingleOptions => {
	let defaultTimezoneGroup: ISelectSingleOptions = {};
	const defaultTimezone = getDefaultTimezone();
	let otherTimezones = [...timezones];

	const defaultTimezoneIndex = otherTimezones.findIndex(({ name }) => name === defaultTimezone);
	if (defaultTimezoneIndex !== -1) {
		const timezone = otherTimezones[defaultTimezoneIndex];
		otherTimezones.splice(defaultTimezoneIndex, 1);
		defaultTimezoneGroup = {
			[DEFAULT_TIMEZONE_GROUP_NAME]: {
				label: DEFAULT_TIMEZONE_GROUP_LABEL,
				value: DEFAULT_TIMEZONE_GROUP_NAME,
				options: {
					[timezone.name]: {
						value: timezone.name,
						label: timezone.label
					}
				}
			}
		};
	}

	let otherTimezoneGroup: ISelectSingleOptions = {};
	if (!isEmpty(otherTimezones)) {
		otherTimezoneGroup = {
			[OTHER_TIMEZONES_GROUP_NAME]: {
				label: OTHER_TIMEZONES_GROUP_LABEL,
				value: OTHER_TIMEZONES_GROUP_NAME,
				options: otherTimezones.reduce<ISelectSingleOptions>((accumulator, { label, name }) => {
					accumulator[name] = accumulator[name] ?? buildDropdownOption(label, name);

					return accumulator;
				}, {})
			}
		};
	}

	const options: ISelectSingleOptions = {
		...defaultTimezoneGroup,
		...otherTimezoneGroup
	};

	// Check if there's only one group
	if (Object.keys(options).length === 1) {
		const [groupKey] = Object.keys(options);

		return options[groupKey].options;
	}

	return options;
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

	return [startDate, endDate].map(date =>
		calculateDate(date?.relativeDate, date?.amount, date?.unit)
			.tz(timezone)
			.format()
	) as [string, string];
};
