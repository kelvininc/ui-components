import { isEmpty, isNil, isNumber } from 'lodash';
import { EAbsoluteTimePickerMode, SelectedRange, SelectedTimestamp } from '../../types';
import { CALENDAR_DATE_TIME_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { createTimestampInTimezoneFromFormattedDate } from '../time-picker/time-picker.helper';
import dayjs from 'dayjs';

export const getSelectedTimestampDates = (range: SelectedRange, mode: EAbsoluteTimePickerMode, timezoneName: string): SelectedTimestamp => {
	if (range?.length === 0) return [];

	if (mode === EAbsoluteTimePickerMode.Single) {
		const [date] = range;

		return [createTimestampInTimezoneFromFormattedDate(date, timezoneName, CALENDAR_DATE_TIME_MASK)];
	}

	const [from, to] = range;
	const dateFrom = createTimestampInTimezoneFromFormattedDate(from, timezoneName, CALENDAR_DATE_TIME_MASK);
	const dateTo = !isEmpty(to) ? createTimestampInTimezoneFromFormattedDate(to, timezoneName, CALENDAR_DATE_TIME_MASK) : undefined;

	return [dateFrom, dateTo];
};

export const getFormattedSelectedDates = (range: SelectedTimestamp, mode: EAbsoluteTimePickerMode, timezoneName: string): SelectedRange => {
	if (isEmpty(range)) return [];

	if (mode === EAbsoluteTimePickerMode.Single) {
		const [date] = range;

		return [dayjs(date).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK)];
	}

	const [from, to] = range;
	const dateFrom = dayjs(from).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK);
	const dateTo = !isNil(to) ? dayjs(to).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK) : undefined;

	return [dateFrom, dateTo];
};

export const areDatesValidByRange = (range: SelectedTimestamp, mode: EAbsoluteTimePickerMode): boolean => {
	if (isEmpty(range)) return false;

	if (mode === EAbsoluteTimePickerMode.Single) {
		const [date] = range;

		return isNumber(date);
	}

	const [from, to] = range;

	return isNumber(from) && isNumber(to);
};
