import { getArrayOfIndexes } from '../../utils/arrays.helper';
import { getFirstWeekdayIndexOfMonth, getNumberOfDaysInMonth } from '../../utils/date.helper';

export const getCalendarStartDisabledDays = (month: number, year: number): number[] => {
	const currentMonthFirstWeekday = getFirstWeekdayIndexOfMonth(month, year);
	const lastMonthNumberOfDays = getNumberOfDaysInMonth(month - 1, year);
	const lastMonthDays = [];
	let index = currentMonthFirstWeekday;

	while (index > 0) {
		lastMonthDays.push(lastMonthNumberOfDays - index + 1);
		index = index - 1;
	}
	return lastMonthDays;
};

export const getCalendarEndDisabledDays = (filledDays: number): number[] => {
	const filledCalendarNumberOfDays = 42;
	return getArrayOfIndexes(filledCalendarNumberOfDays - filledDays).map(item => item + 1);
};
