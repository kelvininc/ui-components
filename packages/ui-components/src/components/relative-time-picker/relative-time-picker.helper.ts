import {
	ERelativeTimeComparisonConfig,
	EUnitReference,
	IDateTimeRangeFormatter,
	IRelativeTimeDropdownOption,
	IRelativeTimePickerOption,
	SelectedRangeDetail
} from './relative-time-picker.types';
import { calculateDate, getDefaultTimezone, isDateTimeBefore, newTimezoneDate, newTimezoneDateFromFormat } from '../../utils/date.helper';
import dayjs, { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash-es';
import { BOTTOM_OPTIONS_HEIGHT, GROUP_GAP, MAX_HEIGHT, PADDING_SIZE, SELECT_OPTION_HEIGHT } from './relative-time-picker.config';
import { SelectedTimestampRange } from '../../types';

export const buildRelativeTimeSelectOptions = (options: IRelativeTimePickerOption[][], timeZone: string = getDefaultTimezone()): IRelativeTimeDropdownOption[][] => {
	return options.reduce<IRelativeTimeDropdownOption[][]>((acc, group) => {
		const groupOptions = buildRelativeTimeGroupOptions(group, timeZone);
		acc.push(groupOptions);

		return acc;
	}, []);
};

export const buildRelativeTimeGroupOptions = (options: IRelativeTimePickerOption[], timeZone: string): IRelativeTimeDropdownOption[] => {
	return options.reduce<IRelativeTimeDropdownOption[]>((acc, option) => {
		const { description, range } = buildOptionRange(option, timeZone);

		const newOption: IRelativeTimeDropdownOption = {
			key: option.value,
			...option,
			description,
			range
		};

		acc.push(newOption);

		return acc;
	}, []);
};

/** Date range builders */
export const buildOptionRange = (option: IRelativeTimePickerOption, timeZone: string): SelectedRangeDetail => {
	switch (option.comparisonConfig) {
		case ERelativeTimeComparisonConfig.StartDateEndDate:
			return buildStartDateEndDateConfigRange(option, timeZone);
		case ERelativeTimeComparisonConfig.StartDate || ERelativeTimeComparisonConfig.EndDate:
			return buildSingleDateConfigRange(option, timeZone);
		case ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits:
			return buildAbsoluteAmountOfUnitsConfigRange(option, timeZone);
		default:
			return buildRelativeAmountOfUnitsConfigRange(option, timeZone);
	}
};

// Build date from config with start and end date
export const buildStartDateEndDateConfigRange = (option: IRelativeTimePickerOption, timeZone: string): SelectedRangeDetail => {
	const startDateTime = newTimezoneDateFromFormat(timeZone, option.startDate.dateFormat, option.startDate.date);
	const endDateTime = newTimezoneDateFromFormat(timeZone, option.endDate.dateFormat, option.endDate.date);

	return buildSelectedRangeDetail(startDateTime, endDateTime, option.labelRangeFormatter);
};

// Build date from config with start or end date
export const buildSingleDateConfigRange = (option: IRelativeTimePickerOption, timeZone: string): SelectedRangeDetail => {
	const nowDateTime = newTimezoneDate(timeZone);
	const calculatedDate = newTimezoneDateFromFormat(timeZone, option.startDate.dateFormat, option.startDate.date);

	return buildSelectedRangeDetail(nowDateTime, calculatedDate, option.labelRangeFormatter);
};

// Build date with both start and end date relative to now timestamp
export const buildAbsoluteAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption, timeZone: string): SelectedRangeDetail => {
	const nowDateTime = newTimezoneDate(timeZone);
	const { unit: startDateUnit, amount: startDateAmount, unitReference: startUnitReference } = option.startDate;
	const { unit: endDateUnit, amount: endDateAmount, unitReference: endUnitReference } = option.endDate;

	const startDateTime = calculateDateWithUnitReference(calculateDate(nowDateTime, startDateAmount, startDateUnit), startDateUnit, startUnitReference);
	const endDateTime = calculateDateWithUnitReference(calculateDate(nowDateTime, endDateAmount, endDateUnit), endDateUnit, endUnitReference);

	return buildSelectedRangeDetail(startDateTime, endDateTime, option.labelRangeFormatter);
};

// Build date with start date relative to now timestamp
export const buildRelativeAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption, timeZone: string): SelectedRangeDetail => {
	const nowDateTime = newTimezoneDate(timeZone);
	const { amount, unit, unitReference } = option.startDate;
	const calculatedDate = calculateDateWithUnitReference(calculateDate(nowDateTime, amount, unit), unit, unitReference);

	return buildSelectedRangeDetail(nowDateTime, calculatedDate, option.labelRangeFormatter);
};

const calculateDateWithUnitReference = (date: dayjs.Dayjs, unit: dayjs.ManipulateType | dayjs.QUnitType, unitReference?: EUnitReference): dayjs.Dayjs => {
	if (!unitReference) {
		return date;
	}

	if (unitReference === EUnitReference.StartOfUnit) {
		return date.startOf(unit);
	} else {
		return date.endOf(unit);
	}
};

/**
 * Builds the range of the start and end date and returns the range array, ordering the dates if needed
 * @param dateA date (start or end)
 * @param dateB date (start or end)
 * @param labelRangeFormatter specifies the description displayed in the list of time options
 * @returns range containing start date and end date ordered
 */
export const buildSelectedRangeDetail = (dateA: Dayjs, dateB: Dayjs, labelRangeFormatter: IDateTimeRangeFormatter): SelectedRangeDetail => {
	if (isDateTimeBefore(dateA, dateB)) {
		return {
			range: [dateA.valueOf(), dateB.valueOf()],
			description: buildDateRangeDescription(dateA, dateB, labelRangeFormatter)
		};
	} else {
		return {
			range: [dateB.valueOf(), dateA.valueOf()],
			description: buildDateRangeDescription(dateB, dateA, labelRangeFormatter)
		};
	}
};

/**
 * Builds the description of the date
 * @param startDate start date
 * @param endDate end date
 * @param formatObject specifies how the dates and the separators should be read
 * @returns description of the range accordingly with the format object
 */
export const buildDateRangeDescription = (startDate: Dayjs, endDate: Dayjs, formatObject: IDateTimeRangeFormatter) => {
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
