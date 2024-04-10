import dayjs from 'dayjs';
import { ERelativeTimeComparisonConfig, EUnitReference, IRelativeTimePickerOption } from '../types';
import { calculateDate, isDateTimeBefore, newTimezoneDate, newTimezoneDateFromFormat } from './date.helper';
import { DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS } from '../components/relative-time-picker/relative-time-picker.config';
import { DayjsTimeRange, TimestampRange } from './types';

/** Date range builders */
export const buildOptionRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
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
export const buildStartDateEndDateConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const startDateTime = newTimezoneDateFromFormat(timeZone, option.startDate.dateFormat, option.startDate.date);
	const endDateTime = newTimezoneDateFromFormat(timeZone, option.endDate.dateFormat, option.endDate.date);

	return buildDayjsRange(startDateTime, endDateTime);
};

// Build date from config with start or end date
export const buildSingleDateConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const nowDateTime = newTimezoneDate(timeZone);
	const calculatedDate = newTimezoneDateFromFormat(timeZone, option.startDate.dateFormat, option.startDate.date);

	return buildDayjsRange(nowDateTime, calculatedDate);
};

// Build date with both start and end date relative to now timestamp
export const buildAbsoluteAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const nowDateTime = newTimezoneDate(timeZone);
	const { unit: startDateUnit, amount: startDateAmount, unitReference: startUnitReference } = option.startDate;
	const { unit: endDateUnit, amount: endDateAmount, unitReference: endUnitReference } = option.endDate;

	const startDateTime = calculateDateWithUnitReference(calculateDate(nowDateTime, startDateAmount, startDateUnit), startDateUnit, startUnitReference);
	const endDateTime = calculateDateWithUnitReference(calculateDate(nowDateTime, endDateAmount, endDateUnit), endDateUnit, endUnitReference);

	return buildDayjsRange(startDateTime, endDateTime);
};

// Build date with start date relative to now timestamp
export const buildRelativeAmountOfUnitsConfigRange = (option: IRelativeTimePickerOption, timeZone: string): DayjsTimeRange => {
	const nowDateTime = newTimezoneDate(timeZone);
	const { amount, unit, unitReference } = option.startDate;
	const calculatedDate = calculateDateWithUnitReference(calculateDate(nowDateTime, amount, unit), unit, unitReference);

	return buildDayjsRange(nowDateTime, calculatedDate);
};

const calculateDateWithUnitReference = (date: dayjs.Dayjs, unit: dayjs.ManipulateType | dayjs.QUnitType, unitReference?: EUnitReference): dayjs.Dayjs => {
	if (!unitReference) {
		return date;
	}

	return unitReference === EUnitReference.StartOfUnit ? date.startOf(unit) : date.endOf(unit);
};

/**
 * Builds the range of the start and end date and returns the range array, ordering the dates if needed
 * @param dateA date (start or end)
 * @param dateB date (start or end)
 * @returns range containing start date and end date ordered
 */
export const buildDayjsRange = (dateA: dayjs.Dayjs, dateB: dayjs.Dayjs): DayjsTimeRange => {
	return isDateTimeBefore(dateA, dateB) ? [dateA, dateB] : [dateB, dateA];
};

export const buildTimestampRange = ([startDate, endDate]: DayjsTimeRange): TimestampRange => [startDate.valueOf(), endDate.valueOf()];

export const getRelativeTimeOption = (key: string, options = DEFAULT_RELATIVE_TIME_OPTIONS_GROUPS) => options.flat().find(option => option.value === key);
