import dayjs from 'dayjs';
import { ICalendarAdvanceTime, ITimePickerTime, SelectedRange } from '../../types';
import { getDefaultTimezone, newDate, newTimezoneDate } from '../../utils/date.helper';
import { CALENDAR_DATE_TIME_MASK, DATETIME_INPUT_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { ERelativeTimeInputMode, IRelativeTimeInput } from '../absolute-time-picker/absolute-time-picker.types';
import { ERelativeTimeComparisonConfig, IRelativeTimePickerOption } from '../relative-time-picker/relative-time-picker.types';
import { buildTimezoneByOffset } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.helper';
import { isEmpty } from 'lodash-es';

export const getRelativeTimeLabel = (relativeTimeValue: string | undefined, relativeTimeOptions: IRelativeTimePickerOption[][]): string | undefined =>
	relativeTimeOptions.flat().find(option => option.value === relativeTimeValue)?.label ?? relativeTimeValue;

export const getCalendarRangeFromRelativeOption = (option: ICalendarAdvanceTime, timezone: string = getDefaultTimezone()): [string, string] => {
	const [from, to] = option.range;
	const fromDate = newTimezoneDate(timezone, from).format(CALENDAR_DATE_TIME_MASK);
	const toDate = newTimezoneDate(timezone, to).format(CALENDAR_DATE_TIME_MASK);

	return [fromDate, toDate];
};

export const getRelativeTimeInputText = (
	options: IRelativeTimePickerOption[][],
	selectedTimeOption: ICalendarAdvanceTime,
	timezone: string = getDefaultTimezone()
): IRelativeTimeInput => {
	const option = options.flat().find(option => option.value === selectedTimeOption.key);

	if (!isEmpty(option)) {
		if (option.comparisonConfig === ERelativeTimeComparisonConfig.RelativeAmountOfUnits) {
			return {
				mode: ERelativeTimeInputMode.Text,
				from: `Now - ${Math.abs(option.startDate.amount)} ${option.startDate.unit}`,
				to: 'Now'
			};
		} else {
			const [from, to] = selectedTimeOption.range;
			const fromDate = newTimezoneDate(timezone, from).format(DATETIME_INPUT_MASK);
			const toDate = newTimezoneDate(timezone, to).format(DATETIME_INPUT_MASK);

			return {
				mode: ERelativeTimeInputMode.Date,
				from: fromDate,
				to: toDate
			};
		}
	}
};

export const getAbsoluteTimezonedDates = (range: SelectedRange): SelectedRange => {
	const [from, to] = range;
	const fromDate = dayjs(from, CALENDAR_DATE_TIME_MASK);
	const toDate = dayjs(to, CALENDAR_DATE_TIME_MASK);

	return [fromDate.format(CALENDAR_DATE_TIME_MASK), toDate.format(CALENDAR_DATE_TIME_MASK)];
};

export const buildTooltipText = (option: ITimePickerTime, timezones: string[]): string => {
	const [from, to] = option.range;
	const timezoneName = option.timezone?.name;

	const fromDate = dayjs(from, CALENDAR_DATE_TIME_MASK);
	const toDate = dayjs(to, CALENDAR_DATE_TIME_MASK);
	const timezonesByOffset = buildTimezoneByOffset(timezones);
	const [timezoneText] = timezonesByOffset.filter(opt => opt.name === timezoneName);

	return `${fromDate.format(DATETIME_INPUT_MASK)} to ${toDate.format(DATETIME_INPUT_MASK)} ${timezoneText.label}`;
};

export const hasRangeChanged = (newRange: SelectedRange, currentRange: SelectedRange): boolean => {
	if ((newRange && newRange.length === 0) || (currentRange && currentRange.length === 0)) {
		return true;
	}

	const [newRangeFrom, newRangeTo] = newRange;
	const [currentRangeFrom, currentRangeTo] = currentRange;
	return newRangeFrom !== currentRangeFrom || newRangeTo !== currentRangeTo;
};

export const getLast24HoursRange = (): SelectedRange => {
	const nowTimestamp = newDate();
	return [nowTimestamp.subtract(24, 'hours').format(CALENDAR_DATE_TIME_MASK), nowTimestamp.format(CALENDAR_DATE_TIME_MASK)];
};

export const buildCustomIntervalTimeRange = (range: SelectedRange): string => {
	const [from, to] = range;
	const timeZoneFromDate = newDate(from).format(DATETIME_INPUT_MASK);
	const timeZoneToDate = newDate(to).format(DATETIME_INPUT_MASK);
	return `${timeZoneFromDate} to ${timeZoneToDate}`;
};
