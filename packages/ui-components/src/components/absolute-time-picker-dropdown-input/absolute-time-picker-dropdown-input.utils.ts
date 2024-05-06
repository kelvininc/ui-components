import dayjs from 'dayjs';
import { SelectedTimeState, TimeRange } from './absolute-time-picker-dropdown-input.types';
import { CALENDAR_DATE_FORMAT, DATE_FORMAT } from './absolute-time-picker-dropdown-input.config';
import { isEmpty, isNumber } from 'lodash';

export const getSingleInputDate = (selectedTime: SelectedTimeState, timezoneName: string): string => {
	if (isEmpty(selectedTime)) {
		return '';
	}

	return dayjs(selectedTime[0]).tz(timezoneName).format(DATE_FORMAT);
};

export const getRangeInputValues = (selectedTime: SelectedTimeState, timezoneName: string): TimeRange => {
	if (isEmpty(selectedTime)) {
		return {
			from: '',
			to: ''
		};
	}

	const [from, to] = selectedTime;
	return {
		from: dayjs(from).tz(timezoneName).format(DATE_FORMAT),
		to: isNumber(to) ? dayjs(to).tz(timezoneName).format(DATE_FORMAT) : ''
	};
};

export const getSingleCalendarDate = (inputValue: string): string[] => {
	return isEmpty(inputValue) ? [] : [dayjs(inputValue, DATE_FORMAT).format(CALENDAR_DATE_FORMAT)];
};

export const getRangeCalendarDates = (rangeInputValues: TimeRange): string[] => {
	const from = rangeInputValues?.from;
	const to = rangeInputValues?.to;

	if (isEmpty(from) && isEmpty(to)) return [];

	if (isEmpty(from) && !isEmpty(to)) return [dayjs(to, DATE_FORMAT).format(CALENDAR_DATE_FORMAT)];

	if (!isEmpty(from) && isEmpty(to)) return [dayjs(from, DATE_FORMAT).format(CALENDAR_DATE_FORMAT)];

	return [dayjs(from, DATE_FORMAT).format(CALENDAR_DATE_FORMAT), dayjs(to, DATE_FORMAT).format(CALENDAR_DATE_FORMAT)];
};
