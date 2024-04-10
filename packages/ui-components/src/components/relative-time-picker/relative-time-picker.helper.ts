import { IDateTimeRangeFormatter, IRelativeTimeDropdownOption, IRelativeTimePickerOption } from './relative-time-picker.types';
import { getDefaultTimezone } from '../../utils/date.helper';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import {
	BOTTOM_OPTIONS_HEIGHT,
	DEFAULT_TIMEZONE_GROUP_LABEL,
	DEFAULT_TIMEZONE_GROUP_NAME,
	GROUP_GAP,
	MAX_HEIGHT,
	OTHER_TIMEZONES_GROUP_LABEL,
	OTHER_TIMEZONES_GROUP_NAME,
	PADDING_SIZE,
	SELECT_OPTION_HEIGHT
} from './relative-time-picker.config';
import { DayjsTimeRange, ISelectSingleOption, ISelectSingleOptions, SelectedTimestamp } from '../../types';
import { buildOptionRange, buildTimestampRange } from '../../utils/relative-time.helper';
import { ITimezoneOffset } from '../time-picker/time-picker.types';

export const buildRelativeTimeSelectOptions = (options: IRelativeTimePickerOption[][], timeZone: string = getDefaultTimezone()): IRelativeTimeDropdownOption[][] => {
	return options.map<IRelativeTimeDropdownOption[]>(group => buildRelativeTimeGroupOptions(group, timeZone));
};

export const buildRelativeTimeGroupOptions = (options: IRelativeTimePickerOption[], timeZone: string): IRelativeTimeDropdownOption[] => {
	return options.map<IRelativeTimeDropdownOption>(option => {
		const dayjsRange = buildOptionRange(option, timeZone);

		return {
			key: option.value,
			...option,
			description: buildDateRangeDescription(dayjsRange, option.labelRangeFormatter),
			range: buildTimestampRange(dayjsRange)
		};
	});
};

/**
 * Builds the description of the date
 * @param startDate start date
 * @param endDate end date
 * @param formatObject specifies how the dates and the separators should be read
 * @returns description of the range accordingly with the format object
 */
export const buildDateRangeDescription = ([startDate, endDate]: DayjsTimeRange, formatObject: IDateTimeRangeFormatter) => {
	const startDateDescription = !isEmpty(formatObject.startDateFormatter) ? startDate.format(formatObject.startDateFormatter) : '';
	const separator = !isEmpty(formatObject.separator) ? ` ${formatObject.separator} ` : '';
	const endDateDescription = !isEmpty(formatObject.endDateFormatter) ? endDate.format(formatObject.endDateFormatter) : '';

	return `${startDateDescription}${separator}${endDateDescription}`;
};

export const getSelectedKeyRange = (options: IRelativeTimeDropdownOption[][], key: string): SelectedTimestamp => {
	const selectedItem = options.flat().find(item => item.key === key);
	return selectedItem?.range ?? [];
};

export const hasRangeChanged = (selectedRange: SelectedTimestamp, currentRange: SelectedTimestamp): boolean => {
	if (isEmpty(selectedRange)) return true;

	const currentRangeStartDate = getDateTimeWithResetedSeconds(currentRange[0]);
	const currentRangeEndDate = getDateTimeWithResetedSeconds(currentRange[1]);
	const selectedRangeStartDate = getDateTimeWithResetedSeconds(selectedRange[0]);
	const selectedRangeEndDate = getDateTimeWithResetedSeconds(selectedRange[1]);

	if (currentRangeStartDate !== selectedRangeStartDate || currentRangeEndDate !== selectedRangeEndDate) {
		return true;
	}

	return false;
};

const getDateTimeWithResetedSeconds = (date: number): string => {
	return dayjs(date).set('second', 0).format();
};

export const isScrollNeeded = (options: IRelativeTimePickerOption[][], displayingCustomizeOption: boolean, displayingTimezoneDropdown: boolean) => {
	const optionsListHeight = options.reduce<number>((acc, group) => {
		const groupSize = group.length * SELECT_OPTION_HEIGHT;

		return acc + groupSize + GROUP_GAP;
	}, 0);
	const customizeOptionHeight = displayingCustomizeOption ? BOTTOM_OPTIONS_HEIGHT : 0;
	const dropdownOptionHeight = displayingTimezoneDropdown ? BOTTOM_OPTIONS_HEIGHT : 0;
	return optionsListHeight > MAX_HEIGHT - customizeOptionHeight - dropdownOptionHeight - 2 * PADDING_SIZE;
};

const buildDropdownOption = (label: string, timezone: string): ISelectSingleOption => ({
	value: timezone,
	label
});

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
