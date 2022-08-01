import moment, { Moment } from 'moment';
import { MomentInput } from 'moment';

/**
 * Helper methods for date type display, parse, calculate and manipulation.
 *
 * @note The month number should be a number between 1 and 12, where 1 corresponds to January and 12 December.
 */

// Months
export const getMonthName = (month: number): string => `${moment({ month: month - 1 }).format('MMMM')}`;
export const getNumberOfDaysInMonth = (month: number, year: number): number => moment({ month: month - 1, year }).daysInMonth();

// Weekdays
export const getWeekdaysNames = (): string[] => moment.weekdaysMin();
export const getFirstWeekdayIndexOfMonth = (month: number, year: number): number =>
	Number.parseInt(
		moment({ month: month - 1, year })
			.startOf('month')
			.format('d')
	);

// Dates
export const isDateBefore = (dateA: MomentInput, dateB: MomentInput): boolean => {
	const dateAMoment = moment(dateA);
	return dateAMoment.isBefore(dateB, 'days');
};
export const isDateAfter = (dateA: MomentInput, dateB: MomentInput): boolean => {
	const dateAMoment = moment(dateA);
	return dateAMoment.isAfter(dateB, 'days');
};
export const isDateSame = (dateA: MomentInput, dateB: MomentInput): boolean => {
	const dateAMoment = moment(dateA);
	return dateAMoment.isSame(dateB, 'days');
};
export const isDateInRange = (date: MomentInput, dateRangeStart: MomentInput, dateRangeEnd: MomentInput, inclusive: boolean = true): boolean => {
	const daysOffset = inclusive ? 1 : 0;
	const dateRangeStartMoment = moment(dateRangeStart).subtract(daysOffset, 'days');
	const dateRangeEndMoment = moment(dateRangeEnd).add(daysOffset, 'days');

	return isDateAfter(date, dateRangeStartMoment) && isDateBefore(date, dateRangeEndMoment);
};
export const isDateInArray = (date: MomentInput, array: MomentInput[] = []): boolean => {
	const dateMoment = moment(date);
	return array.some(arrayDate => dateMoment.isSame(arrayDate, 'days'));
};
export const getDateMonth = (date: MomentInput): number => moment(date).month() + 1;
export const getDateYear = (date: MomentInput): number => moment(date).year();
export const getDatesBetweenRange = (dateRangeStart: MomentInput, dateRangeEnd: MomentInput, inclusive: boolean = true): string[] => {
	const daysOffset = inclusive ? 1 : 0;
	const dateRangeStartMoment = moment(dateRangeStart).subtract(daysOffset, 'days');
	const dateRangeEndMoment = moment(dateRangeEnd).add(daysOffset, 'days');

	const dates: string[] = [];

	while (dateRangeStartMoment.add(1, 'days').diff(dateRangeEndMoment) < 0) {
		dates.push(formatDate(dateRangeStartMoment));
	}

	return dates;
};

// General
export const fromDateToMoment = (day: number, month: number, year: number): Moment => moment({ day, month: month - 1, year });
export const fromISOToMoment = (date: string): Moment => moment(date);
export const areDatesValid = (dates: MomentInput[]): boolean => {
	return dates.find(date => !isDateValid(date)) === undefined;
};
export const isDateValid = (date: MomentInput): boolean => {
	if (date === undefined) {
		return false;
	}

	const dateMoment = moment(date);
	return dateMoment.isValid();
};
export const formatDatetime = (date: MomentInput, mask: string = 'YYYY-MM-DD HH:mm:ss'): string => moment(date).format(mask);
export const formatDate = (date: MomentInput, mask: string = 'YYYY-MM-DD'): string => moment(date).format(mask);
