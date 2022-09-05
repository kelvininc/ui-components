import { isEmpty } from 'lodash-es';
import { RelativeTimeOption, SelectedRange } from '../../types';
import { formatDateTime, formatForTimezone, fromDatesRangeKey } from '../../utils/date.helper';
import { DEFAULT_RELATIVE_TIME_OPTIONS } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.config';
import { getDatesRangeFromRelativeOption } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.helper';
import { ICalendarAdvanceSelectedTime, ECalendarAdvanceTimeType } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.types';

export const formatAbsoluteSelectedTime = (startDate: string, endDate: string, mask?: string): string => {
	return `${formatDateTime(startDate, mask)} to ${formatDateTime(endDate, mask)}`;
};

export const getRelativeTimeLabel = (relativeTimeValue: string | undefined, relativeTimeOptions: RelativeTimeOption[] = DEFAULT_RELATIVE_TIME_OPTIONS): string | undefined =>
	relativeTimeOptions.find(option => option.value === relativeTimeValue)?.label ?? relativeTimeValue;

export const isTimeSelected = (time: ICalendarAdvanceSelectedTime | undefined): boolean => {
	return isAbsoluteTimeSelected(time) || isRelativeTimeSelected(time);
};

export const isAbsoluteTimeSelected = (time: ICalendarAdvanceSelectedTime | undefined): boolean => {
	if (time && time.type === ECalendarAdvanceTimeType.Absolute) {
		const [startDate, endDate] = fromDatesRangeKey(time.key) as SelectedRange;

		return !isEmpty(startDate) && !isEmpty(endDate);
	}

	return false;
};

export const getTimeRange = (
	time: ICalendarAdvanceSelectedTime | undefined,
	relativeTimeOptions: RelativeTimeOption[] = DEFAULT_RELATIVE_TIME_OPTIONS,
	timezone: string
): SelectedRange => {
	if (time === undefined) {
		return [];
	}

	if (time.type === ECalendarAdvanceTimeType.Relative) {
		return getDatesRangeFromRelativeOption(time.key as string | undefined, relativeTimeOptions, timezone);
	}

	if (time.type === ECalendarAdvanceTimeType.Absolute) {
		const [startDate, endDate] = fromDatesRangeKey(time.key);

		return [startDate, endDate].map(date => formatForTimezone(timezone, date)) as SelectedRange;
	}
};

export const isRelativeTimeSelected = (time: ICalendarAdvanceSelectedTime | undefined): boolean => time && time.key && time.type === ECalendarAdvanceTimeType.Relative;
