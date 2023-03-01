import dayjs from 'dayjs';
import { CALENDAR_DATE_TIME_MASK } from './absolute-time-picker.config';
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
