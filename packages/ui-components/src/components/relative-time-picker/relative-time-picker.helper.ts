import { IDateTimeRangeFormatter, IRelativeTimeDropdownOption, IRelativeTimePickerOption } from './relative-time-picker.types';
import { getDefaultTimezone } from '../../utils/date.helper';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import { BOTTOM_OPTIONS_HEIGHT, GROUP_GAP, MAX_HEIGHT, PADDING_SIZE, SELECT_OPTION_HEIGHT } from './relative-time-picker.config';
import { DayjsTimeRange, SelectedTimestampRange } from '../../types';
import { buildOptionRange, buildTimestampRange } from '../../utils/relative-time.helper';

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

export const getSelectedKeyRange = (options: IRelativeTimeDropdownOption[][], key: string): SelectedTimestampRange => {
	const selectedItem = options.flat().find(item => item.key === key);
	return selectedItem.range;
};

export const hasRangeChanged = (selectedRange: SelectedTimestampRange, currentRange: SelectedTimestampRange): boolean => {
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
