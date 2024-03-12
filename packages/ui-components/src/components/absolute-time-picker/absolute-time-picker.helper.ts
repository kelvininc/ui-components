import dayjs from 'dayjs';
import { CALENDAR_DATE_TIME_MASK, CALENDAR_MASK, DATETIME_INPUT_MASK } from './absolute-time-picker.config';
import { SelectedRange } from '../../types';

export const buildSelectedDatesEventPayload = (dateA?: dayjs.Dayjs, dateB?: dayjs.Dayjs): SelectedRange => {
	if (!dateA && !dateB) {
		return [];
	}

	if (!dateB) {
		return [dateA.format(CALENDAR_DATE_TIME_MASK)];
	}

	return [dateA.format(CALENDAR_DATE_TIME_MASK), dateB.format(CALENDAR_DATE_TIME_MASK)];
};

export const isEndDateAtStartOfDay = (date: dayjs.Dayjs): boolean => {
	return date.isValid() && date.hour() === 0 && date.minute() === 0 && date.second() === 0;
};

export const getFirstCalendarInitialDate = (displayedMonth: dayjs.Dayjs): string => {
	const initialDate = displayedMonth;
	return initialDate.isValid() ? initialDate.format(CALENDAR_MASK) : '';
};

export const getSecondCalendarInitialDate = (displayedMonth: dayjs.Dayjs): string => {
	const initialDate = displayedMonth;
	return initialDate.isValid() ? initialDate.add(1, 'month').format(CALENDAR_MASK) : '';
};

export const getMinimumDateFromDayClick = (clickedDate: dayjs.Dayjs, minimumDate: string): dayjs.Dayjs => {
	const parsedMinDate = dayjs(minimumDate, DATETIME_INPUT_MASK);
	if (clickedDate.startOf('day').isBefore(parsedMinDate)) {
		return parsedMinDate;
	}

	return clickedDate.startOf('day');
};

export const getMaximumDateFromDayClick = (clickedDate: dayjs.Dayjs, maximumDate: string): dayjs.Dayjs => {
	const parsedMaxDate = dayjs(maximumDate, DATETIME_INPUT_MASK);
	if (clickedDate.endOf('day').isAfter(parsedMaxDate)) {
		return parsedMaxDate;
	}

	return clickedDate.endOf('day');
};
