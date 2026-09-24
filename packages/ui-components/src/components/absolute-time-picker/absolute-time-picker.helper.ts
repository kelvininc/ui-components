import dayjs from 'dayjs';
import { isEmpty } from 'lodash-es';
import { CALENDAR_DATE_TIME_MASK, CALENDAR_MASK, DATETIME_INPUT_MASK } from './absolute-time-picker.config';
import { DateInputState, EAbsoluteTimeError, EValidationState, IAbsoluteTimeLimits, SelectedRange } from '../../types';
import { EAbsoluteTimePickerMode, ITypedDates } from './absolute-time-picker.types';

export const buildSelectedDatesEventPayload = (dateA?: dayjs.Dayjs, dateB?: dayjs.Dayjs): SelectedRange => {
	if (!dateA && !dateB) {
		return [];
	}

	if (!dateB) {
		return [dateA.format(CALENDAR_DATE_TIME_MASK)];
	}

	return [dateA.format(CALENDAR_DATE_TIME_MASK), dateB.format(CALENDAR_DATE_TIME_MASK)];
};

/**
 * Parses a date typed in a date-time input. Parsing is strict, so an impossible date (31-02, month 13) or
 * one still holding mask placeholders is rejected instead of rolling over into another date.
 * @param text typed text in the DD-MM-YYYY HH:mm:ss format
 * @returns the parsed date, or undefined when the text is not a complete, valid date
 */
export const parseTypedDateTime = (text?: string | null): dayjs.Dayjs | undefined => {
	// Validated in UTC so a wall-clock time inside the host timezone's DST gap is not rejected
	if (isEmpty(text) || !dayjs.utc(text, DATETIME_INPUT_MASK, true).isValid()) {
		return;
	}

	return dayjs(text, DATETIME_INPUT_MASK);
};

/**
 * Resolves the dates typed in the inputs into the selection they describe
 * @param mode calendar mode, which defines the inputs in use
 * @param typedDates text of each input
 * @returns the typed dates, or undefined while an input holds an incomplete or invalid date, or a range
 * has its end but not its start
 */
export const getTypedSelection = (mode: EAbsoluteTimePickerMode | undefined, { from, to, single }: ITypedDates): dayjs.Dayjs[] | undefined => {
	// Like the component, which renders the single input for any mode other than range
	if (mode !== EAbsoluteTimePickerMode.Range) {
		return parseTypedDates([single]);
	}

	if (isEmpty(from) && !isEmpty(to)) {
		return;
	}

	return parseTypedDates([from, to]);
};

const parseTypedDates = (texts: string[]): dayjs.Dayjs[] | undefined => {
	const dates: dayjs.Dayjs[] = [];

	for (const text of texts) {
		if (isEmpty(text)) {
			continue;
		}

		const date = parseTypedDateTime(text);
		if (!date) {
			return;
		}

		dates.push(date);
	}

	return dates;
};

/**
 * Formats a selected date to be displayed in a date-time input
 * @param date date in the calendar date time format
 * @returns the input text, empty when there is no valid date
 */
export const formatSelectedDate = (date?: string): string => {
	const parsedDate = dayjs(date, CALENDAR_DATE_TIME_MASK);
	return !isEmpty(date) && parsedDate.isValid() ? parsedDate.format(DATETIME_INPUT_MASK) : '';
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

export const getCalendarInitialDate = (displayedMonth: dayjs.Dayjs, monthOffset: number): string => {
	return displayedMonth.isValid() ? displayedMonth.add(monthOffset, 'month').format(CALENDAR_MASK) : '';
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

export const getFromDateInputState = (error: EAbsoluteTimeError | undefined, { minDate }: IAbsoluteTimeLimits): DateInputState | undefined => {
	if (!error) {
		return;
	}

	if (error === EAbsoluteTimeError.StartDateBeforeMinimumDate && minDate) {
		const min = dayjs(minDate).format(DATETIME_INPUT_MASK);
		return {
			state: EValidationState.Invalid,
			helpText: `The 'FROM' date must be after ${min}`
		};
	}

	return;
};

export const getToDateTimeInputState = (error: EAbsoluteTimeError | undefined, { maxDate }: IAbsoluteTimeLimits): DateInputState | undefined => {
	if (!error) {
		return;
	}

	if (error === EAbsoluteTimeError.EndDateAfterMaximumDate && maxDate) {
		const max = dayjs(maxDate).format(DATETIME_INPUT_MASK);
		return {
			state: EValidationState.Invalid,
			helpText: `The 'TO' date must be before ${max}`
		};
	}

	if (error === EAbsoluteTimeError.EndDateBeforeStartDate) {
		return {
			state: EValidationState.Invalid,
			helpText: `The 'TO' date must be after 'FROM' date`
		};
	}

	return;
};

export const getSingleDateTimeInputState = (error: EAbsoluteTimeError | undefined, { minDate, maxDate }: IAbsoluteTimeLimits): DateInputState | undefined => {
	if (!error) {
		return;
	}

	if (error === EAbsoluteTimeError.StartDateBeforeMinimumDate && minDate) {
		const min = dayjs(minDate).format(DATETIME_INPUT_MASK);
		return {
			state: EValidationState.Invalid,
			helpText: `The date must be after ${min}`
		};
	}

	if (error === EAbsoluteTimeError.EndDateAfterMaximumDate && maxDate) {
		const max = dayjs(maxDate).format(DATETIME_INPUT_MASK);
		return {
			state: EValidationState.Invalid,
			helpText: `The date must be before ${max}`
		};
	}

	return;
};
