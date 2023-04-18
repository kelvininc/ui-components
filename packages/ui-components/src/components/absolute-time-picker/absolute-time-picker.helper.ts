import dayjs from 'dayjs';
import { CALENDAR_DATE_TIME_MASK, MAX_INPUT_MONTH, MAX_INPUT_YEAR } from './absolute-time-picker.config';
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

export const isInputDateInLimit = (date: dayjs.Dayjs): boolean => {
	const dateMonth = date.month();
	const dateYear = date.year();

	if (dateMonth === MAX_INPUT_MONTH && dateYear === MAX_INPUT_YEAR) {
		return true;
	}

	return false;
};
