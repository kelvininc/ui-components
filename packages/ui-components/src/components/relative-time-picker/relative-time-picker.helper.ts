import { ERelativeTimeComparisonConfig, IDateTimeRangeFormatter, IRelativeTimeDropdownOption, IRelativeTimePickerOption, SelectedRangeDetail } from './relative-time-picker.types';
import { calculateDate, isDateTimeBefore, newDate } from '../../utils/date.helper';
import { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash-es';
import { BOTTOM_OPTIONS_HEIGHT, GROUP_GAP, MAX_HEIGHT, PADDING_SIZE, SELECT_OPTION_HEIGHT } from './relative-time-picker.config';
import { SelectedRange } from '../../types';

export const buildRelativeTimeSelectOptions = (options: IRelativeTimePickerOption[][]): IRelativeTimeDropdownOption[][] => {
	return options.reduce<IRelativeTimeDropdownOption[][]>((acc, group) => {
		const groupOptions = buildRelativeTimeGroupOptions(group);
		acc.push(groupOptions);

		return acc;
	}, []);
};

export const buildRelativeTimeGroupOptions = (options: IRelativeTimePickerOption[]): IRelativeTimeDropdownOption[] => {
	return options.reduce<IRelativeTimeDropdownOption[]>((acc, option) => {
		const { description, range } = buildOptionRange(option);

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

export const buildOptionRange = (option: IRelativeTimePickerOption): SelectedRangeDetail => {
	switch (option.comparisonConfig) {
		case ERelativeTimeComparisonConfig.StartDateEndDate:
			return buildStartDateEndDateConfigRange(option);
		case ERelativeTimeComparisonConfig.StartDate || ERelativeTimeComparisonConfig.EndDate:
			return buildSingleDateConfigRange(option);
		case ERelativeTimeComparisonConfig.AbsoluteAmountOfUnits:
			return buildAbsoluteAmountOfUnitsConfigRange(option);
		default:
			return buildRelativeAmountOfUnitsConfigRange(option);
	}
};

export const buildStartDateEndDateConfigRange = (option: IRelativeTimePickerOption): SelectedRangeDetail => {
	const startDateTime = newDate(option.startDate.date);
	const endDateTime = newDate(option.endDate.date);

	return buildSelectedRangeDetail(startDateTime, endDateTime, option.labelRangeFormatter);
};

export const buildSingleDateConfigRange = (option: IRelativeTimePickerOption): SelectedRangeDetail => {
	const nowDateTime = newDate();
	const calculatedDate = newDate(option.startDate.date);

	return buildSelectedRangeDetail(nowDateTime, calculatedDate, option.labelRangeFormatter);
};

export const buildRelativeAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption): SelectedRangeDetail => {
	const nowDateTime = newDate();
	const { amount, unit } = option.startDate;
	const calculatedDate = calculateDate(nowDateTime, amount, unit);
	return buildSelectedRangeDetail(nowDateTime, calculatedDate, option.labelRangeFormatter);
};

export const buildAbsoluteAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption): SelectedRangeDetail => {
	const nowDateTime = newDate();
	const { unit: startDateUnit, amount: startDateAmount } = option.startDate;
	const { unit: endDateUnit, amount: endDateAmount } = option.endDate;

	const startDateTime = calculateDate(nowDateTime, startDateAmount, startDateUnit);
	const endDateTime = calculateDate(nowDateTime, endDateAmount, endDateUnit);

	return buildSelectedRangeDetail(startDateTime.startOf(startDateUnit), endDateTime.endOf(endDateUnit), option.labelRangeFormatter);
};

export const buildSelectedRangeDetail = (dateA: Dayjs, dateB: Dayjs, labelRangeFormatter: IDateTimeRangeFormatter): SelectedRangeDetail => {
	if (isDateTimeBefore(dateA, dateB)) {
		return {
			range: [dateA.format(), dateB.format()],
			description: buildDateRangeDescription(dateA, dateB, labelRangeFormatter)
		};
	} else {
		return {
			range: [dateB.format(), dateA.format()],
			description: buildDateRangeDescription(dateB, dateA, labelRangeFormatter)
		};
	}
};

export const buildDateRangeDescription = (startDate: Dayjs, endDate: Dayjs, formatObject: IDateTimeRangeFormatter) => {
	const startDateDescription = !isEmpty(formatObject.startDateFormatter) ? startDate.format(formatObject.startDateFormatter) : '';
	const separator = !isEmpty(formatObject.separator) ? ` ${formatObject.separator} ` : '';
	const endDateDescription = !isEmpty(formatObject.endDateFormatter) ? endDate.format(formatObject.endDateFormatter) : '';

	return `${startDateDescription}${separator}${endDateDescription}`;
};

export const getSelectedKeyRange = (options: IRelativeTimeDropdownOption[][], key: string): SelectedRange => {
	const selectedItem = options.flat().find(item => item.key === key);
	return selectedItem.range;
};

export const hasRangeChanged = (selectedRange: SelectedRange, currentRange: SelectedRange): boolean => {
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

const getDateTimeWithResetedSeconds = (date: string): string => {
	return newDate(date).second(0).toString();
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
