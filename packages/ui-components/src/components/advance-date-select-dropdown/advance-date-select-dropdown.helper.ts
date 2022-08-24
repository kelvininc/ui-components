import { isEmpty } from 'lodash-es';
import { RelativeTimeOption, SelectedRange } from '../../types';
import { formatDateTime, fromDatesRangeKey } from '../../utils/date.helper';
import { DEFAULT_RELATIVE_TIME_OPTIONS } from '../calendar-advance-date-selector/calendar-advance-date-selector.config';
import { getDatesRangeFromRelativeOption } from '../calendar-advance-date-selector/calendar-advance-date-selector.helper';
import { ICalendarAdvanceSelectedTime, ECalendarAdvanceTimeType } from '../calendar-advance-date-selector/calendar-advance-date-selector.types';

export const formatAbsoluteSelectedTime = (startDate: string, endDate: string, mask?: string): string => {
	return `${formatDateTime(startDate, mask)} to ${formatDateTime(endDate, mask)}`;
};

export const getRelativeTimeLabel = (relativeTimeValue: string | undefined, relativeTimeOptions: RelativeTimeOption[] = DEFAULT_RELATIVE_TIME_OPTIONS): string | undefined =>
	relativeTimeOptions.find(option => option.value === relativeTimeValue)?.label ?? relativeTimeValue;

export const isTimeSelected = (time: ICalendarAdvanceSelectedTime | undefined): boolean => {
	return isAbsoluteTimeSelected(time) || isRelativeTimeSelected(time);
};

export const isAbsoluteTimeSelected = (time: ICalendarAdvanceSelectedTime | undefined): boolean => {
	if (time === undefined) {
		return false;
	}

	if (time.type === ECalendarAdvanceTimeType.Absolute) {
		const [startDate, endDate] = fromDatesRangeKey(time.key) as SelectedRange;

		return !isEmpty(startDate) && !isEmpty(endDate);
	}

	return false;
};

export const getTimeRange = (time: ICalendarAdvanceSelectedTime | undefined, relativeTimeOptions: RelativeTimeOption[] = DEFAULT_RELATIVE_TIME_OPTIONS): SelectedRange => {
	if (time === undefined) {
		return [];
	}

	if (time.type === ECalendarAdvanceTimeType.Relative) {
		return getDatesRangeFromRelativeOption(time.key as string | undefined, relativeTimeOptions);
	}

	if (time.type === ECalendarAdvanceTimeType.Absolute) {
		const [startDate, endDate] = fromDatesRangeKey(time.key) as SelectedRange;

		return [startDate, endDate];
	}
};

export const isRelativeTimeSelected = (time: ICalendarAdvanceSelectedTime | undefined): boolean => {
	if (time === undefined) {
		return false;
	}

	if (time.type === ECalendarAdvanceTimeType.Relative) {
		return time.key !== undefined;
	}

	return false;
};
