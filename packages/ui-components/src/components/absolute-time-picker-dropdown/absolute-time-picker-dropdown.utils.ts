import { isEmpty, isNil, isNumber } from 'lodash-es';
import { EAbsoluteTimeError, EAbsoluteTimePickerMode, IAbsoluteTimeLimits, SelectedRange, SelectedTimestamp } from '../../types';
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

export const getAbsoluteTimePickerError = (range: SelectedTimestamp, mode: EAbsoluteTimePickerMode, limits: IAbsoluteTimeLimits): EAbsoluteTimeError | undefined => {
	if (!isAbsoluteTimePickerFilled(range, mode)) {
		return;
	}

	if (mode === EAbsoluteTimePickerMode.Single) {
		const [date] = range;

		if (limits.minDate && dayjs(date).isBefore(limits.minDate)) {
			return EAbsoluteTimeError.StartDateBeforeMinimumDate;
		}

		if (limits.maxDate && dayjs(date).isAfter(limits.maxDate)) {
			return EAbsoluteTimeError.EndDateAfterMaximumDate;
		}

		return;
	}

	const [startDate, endDate] = range;

	if (!dayjs(endDate).isAfter(startDate)) {
		return EAbsoluteTimeError.EndDateBeforeStartDate;
	}

	if (limits.minDate && dayjs(startDate).isBefore(limits.minDate)) {
		return EAbsoluteTimeError.StartDateBeforeMinimumDate;
	}

	if (limits.maxDate && dayjs(endDate).isAfter(limits.maxDate)) {
		return EAbsoluteTimeError.EndDateAfterMaximumDate;
	}

	return;
};

export const isAbsoluteTimePickerFilled = (range: SelectedTimestamp, mode: EAbsoluteTimePickerMode): boolean => {
	if (isEmpty(range)) return false;

	if (mode === EAbsoluteTimePickerMode.Single) {
		const [date] = range;

		return isNumber(date);
	}

	const [from, to] = range;

	return isNumber(from) && isNumber(to);
};
