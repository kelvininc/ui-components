import dayjs from 'dayjs';
import { SelectedRange, DateInput } from '../types';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import objectSupport from 'dayjs/plugin/objectSupport';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import utc from 'dayjs/plugin/utc';
import { TIMEZONES } from './date.config';

dayjs.extend(quarterOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(objectSupport);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(utc);

/**
 * Helper methods for date type display, parse, calculate and manipulation.
 *
 * @note The month number should be a number between 1 and 12, where 1 corresponds to January and 12 December.
 */

export const newDate = (date?: DateInput) => dayjs(date);
export const newTimezoneDate = (timezone: string, date?: DateInput) => dayjs.tz(date, timezone);

// Constructors
export const fromISO = (date: string): dayjs.Dayjs => newDate(date);
export const fromDateFields = (day: number, month: number, year: number): dayjs.Dayjs => newDate({ day, month: month - 1, year });
export const fromDateInput = (date: DateInput): dayjs.Dayjs => newDate(date);

// Months
export const getMonthName = (month: number): string =>
	`${dayjs()
		.month(month - 1)
		.format('MMMM')}`;
export const getNumberOfDaysInMonth = (month: number, year: number): number =>
	dayjs()
		.month(month - 1)
		.year(year)
		.daysInMonth();

// Weekdays
export const getWeekdaysNames = (): string[] => dayjs.weekdaysMin();
export const getFirstWeekdayIndexOfMonth = (month: number, year: number): number =>
	Number.parseInt(
		newDate({ month: month - 1, year })
			.startOf('month')
			.format('d')
	);

// Dates
export const isDateBefore = (dateA: DateInput, dateB: DateInput): boolean => newDate(dateA).isBefore(dateB, 'days');
export const isDateTimeBefore = (dateA: DateInput, dateB: DateInput): boolean => newDate(dateA).isBefore(dateB);
export const isDateTimeAfter = (dateA: DateInput, dateB: DateInput): boolean => newDate(dateA).isAfter(dateB);
export const isDateAfter = (dateA: DateInput, dateB: DateInput): boolean => newDate(dateA).isAfter(dateB, 'days');
export const isDateSame = (dateA: DateInput, dateB: DateInput): boolean => newDate(dateA).isSame(dateB, 'days');
export const isDateInRange = (date: DateInput, rangeStartDate: DateInput, rangeEndDate: DateInput, inclusive: boolean = true): boolean => {
	const daysOffset = inclusive ? 1 : 0;
	const rangeStartDateInstance = newDate(rangeStartDate).subtract(daysOffset, 'days');
	const rangeEndDateInstance = newDate(rangeEndDate).add(daysOffset, 'days');

	return isDateAfter(date, rangeStartDateInstance) && isDateBefore(date, rangeEndDateInstance);
};
export const isDateInArray = (date: DateInput, array: DateInput[] = []): boolean => array.some(arrayDate => newDate(date).isSame(arrayDate, 'days'));

export const getDateMonth = (date: DateInput): number => newDate(date).month() + 1;
export const getDateYear = (date: DateInput): number => newDate(date).year();
export const getDatesBetweenRange = (dateRangeStart: DateInput, dateRangeEnd: DateInput, inclusive: boolean = true): string[] => {
	const daysOffset = inclusive ? 1 : 0;
	const rangeStartDateInstance = newDate(dateRangeStart).subtract(daysOffset, 'days');
	const rangeEndDateInstance = newDate(dateRangeEnd).add(daysOffset, 'days');

	const dates: string[] = [];

	for (let indexDate = rangeStartDateInstance.add(1, 'days'); indexDate.diff(rangeEndDateInstance, 'days') < 0; indexDate = indexDate.add(1, 'days')) {
		dates.push(formatDate(indexDate));
	}

	return dates;
};

// Timezones
export const getTimezonesNames = () => window?.Intl?.supportedValuesOf?.('timeZone') ?? TIMEZONES;
export const getDefaultTimezone = () => dayjs.tz.guess() ?? 'UTC';
export const getTimezoneOffset = (zone: string) => newDate().tz(zone).utcOffset();

// Formatters
export const formatDateTime = (date: DateInput, mask: string = 'YYYY-MM-DD HH:mm:ss'): string => fromDateInput(date).format(mask);
export const formatDate = (date: DateInput, mask: string = 'YYYY-MM-DD'): string => newDate(date).format(mask);
export const formatTimezoneName = (timezone: string, date: DateInput = dayjs()): string => `(${newDate(date).tz(timezone).format('Z')}) ${timezone.replace(/_+/g, ' ')}`;
export const formatForTimezone = (timezone: string, date?: DateInput) => newTimezoneDate(timezone, date).format();

// Utils
export const areDatesValid = (dates: DateInput[]): boolean => {
	return dates.find(date => !isDateValid(date)) === undefined;
};
export const isDateValid = (date: DateInput): boolean => {
	if (date === undefined) {
		return false;
	}

	return newDate(date).isValid();
};
export const calculateDate = (date: DateInput, amount: number = 0, unit: dayjs.ManipulateType | dayjs.QUnitType = 'days'): dayjs.Dayjs => {
	if (unit === 'quarter') {
		return newDate(date).add(amount, 'quarter');
	}

	return newDate(date).add(amount, unit as dayjs.ManipulateType);
};
export const getDatesRangeKey = (startDate: string = 'start-date', endDate: string = 'end-date'): string => `${startDate}#${endDate}`;
export const fromDatesRangeKey = (datesKey: string): SelectedRange => {
	const [startDate, endDate] = datesKey.split('#');

	return [startDate, endDate].filter(isDateValid) as SelectedRange;
};
export const getMonthTitle = (month: number, year: number): string => `${getMonthName(month)} ${year}`;
