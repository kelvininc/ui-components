import { getArrayOfIndexes } from '../../utils/arrays.helper';
import { fromDateFields, getFirstWeekdayIndexOfMonth, getNumberOfDaysInMonth } from '../../utils/date.helper';
import { CALENDAR_FILLED_ROWS_NUMBER_OF_DAYS, DATE_FORMAT } from './time-picker-calendar.config';
import { SelectedRange } from '../../types';

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
	return getArrayOfIndexes(CALENDAR_FILLED_ROWS_NUMBER_OF_DAYS - filledDays).map(item => item + 1);
};

export const getSelectedRange = (selectedDates: string[]): SelectedRange => {
	if (selectedDates && selectedDates.length > 0) {
		const [startDate] = selectedDates;

		if (selectedDates.length === 1) {
			return [startDate];
		}

		const [endDate] = selectedDates.slice(-1);

		return [startDate, endDate];
	}

	return [];
};

export const getHooveredDate = (hoveredDay: number, month: number, year: number, hoveredDate: string): string => {
	if (hoveredDay !== undefined) {
		return fromDateFields(hoveredDay, month, year).format(DATE_FORMAT);
	}

	if (hoveredDate !== undefined) {
		return hoveredDate;
	}

	return undefined;
};
