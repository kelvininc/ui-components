import dayjs from 'dayjs';
import { ITimePickerTime, SelectedTimestampRange } from '../../types';
import { newTimezoneDate } from '../../utils/date.helper';
import { CALENDAR_DATE_TIME_MASK, DATETIME_INPUT_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { ERelativeTimeInputMode, IRelativeTimeInput } from '../absolute-time-picker/absolute-time-picker.types';
import { ERelativeTimeComparisonConfig, IRelativeTimePickerOption, ITimePickerRelativeTime } from '../relative-time-picker/relative-time-picker.types';
import { buildTimezoneByOffset } from '../calendar-advanced-date-selector/calendar-advanced-date-selector.helper';
import { isEmpty } from 'lodash-es';
import { CUSTOMIZE_INTERVAL_KEY } from '../relative-time-picker/relative-time-picker.config';

/**
 * Generates the text displayed in the dropdown when the custom interval option is selected
 * @param range range in timestamp
 * @param timezone timezone applied to the timestamp
 * @returns label to be displayed in the dropdown
 */
export const buildCustomIntervalTimeRange = (range: SelectedTimestampRange, timezone: string): string => {
	const [from, to] = range;
	const timeZoneFromDate = createFormattedDateFromTimestampInTimezone(from, timezone);
	const timeZoneToDate = createFormattedDateFromTimestampInTimezone(to, timezone);
	return `${timeZoneFromDate} to ${timeZoneToDate}`;
};

/**
 * Generates the text to be displayed by the tooltip when the dropdown input is hovered
 * @param option selectd time option
 * @param timezones timezones available
 * @returns tooltip text to be displayed
 */
export const buildTooltipText = (option: ITimePickerTime, timezones: string[]): string => {
	const [from, to] = option.range;
	const timezoneName = option.timezone?.name;

	const fromDate = dayjs(from).tz(timezoneName);
	const toDate = dayjs(to).tz(timezoneName);
	const timezonesByOffset = buildTimezoneByOffset(timezones);
	const [timezoneText] = timezonesByOffset.filter(opt => opt.name === timezoneName);

	return `${fromDate.format(DATETIME_INPUT_MASK)} to ${toDate.format(DATETIME_INPUT_MASK)} ${timezoneText.label}`;
};

const createFormattedDateFromTimestampInTimezone = (date: number, timezone: string): string => {
	return dayjs(date).tz(timezone).format(DATETIME_INPUT_MASK);
};

export const createTimestampInTimezoneFromFormattedDate = (date: string, timezone: string, format: string = DATETIME_INPUT_MASK): number => {
	return dayjs(date, format).tz(timezone, true).valueOf();
};

/**
 * Transforms the selected timestamp range in formatted dates to be read by the kv-absolute-time-picker component
 * @param selectedOption selected ranges and timezone
 * @returns range in the calendar date time format
 */
export const getAbsoluteTimePickerRangeDates = (selectedOption: ITimePickerTime): string[] => {
	const [from, to] = selectedOption.range;
	const timezoneOffset = selectedOption.timezone.offset;
	const timezoneName = selectedOption.timezone.name;

	if (!from && !to) {
		return [];
	}

	if (!to && from) {
		if (selectedOption.key === CUSTOMIZE_INTERVAL_KEY) {
			return [dayjs(from).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK)];
		}

		return [dayjs(from).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
	}

	if (selectedOption.key === CUSTOMIZE_INTERVAL_KEY) {
		return [dayjs(from).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK), dayjs(to).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK)];
	}

	return [dayjs(from).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK), dayjs(to).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
};

export const getLast24HoursRange = (): SelectedTimestampRange => {
	const nowTimestamp = dayjs().utc();
	return [nowTimestamp.subtract(24, 'hours').valueOf(), nowTimestamp.valueOf()];
};

export const getRelativeTimeInputText = (options: IRelativeTimePickerOption[][], selectedTimeOption: ITimePickerRelativeTime, timezone: string): IRelativeTimeInput => {
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
			return {
				mode: ERelativeTimeInputMode.Date,
				from: newTimezoneDate(timezone, from).format(DATETIME_INPUT_MASK),
				to: newTimezoneDate(timezone, to).format(DATETIME_INPUT_MASK)
			};
		}
	}
};

export const getRelativeTimeLabel = (relativeTimeValue: string | undefined, relativeTimeOptions: IRelativeTimePickerOption[][]): string | undefined =>
	relativeTimeOptions.flat().find(option => option.value === relativeTimeValue)?.label ?? relativeTimeValue;

export const getTimestampFromDateRange = (range: SelectedTimestampRange, previousTimezone: string, newTimezone: string): SelectedTimestampRange => {
	const [from, to] = range;
	// Load date in the previous timezone
	const parsedFromDate = createFormattedDateFromTimestampInTimezone(from, previousTimezone);
	const parsedToDate = createFormattedDateFromTimestampInTimezone(to, previousTimezone);

	// Create new timestamps with the updated timezone
	const fromDate = createTimestampInTimezoneFromFormattedDate(parsedFromDate, newTimezone);
	const toDate = createTimestampInTimezoneFromFormattedDate(parsedToDate, newTimezone);

	return [fromDate, toDate];
};

export const hasRangeChanged = (currentRange: SelectedTimestampRange, newRange?: SelectedTimestampRange): boolean => {
	if (!newRange) {
		return true;
	}

	if ((newRange && newRange.length === 0) || (currentRange && currentRange.length === 0)) {
		return true;
	}

	const [newRangeFrom, newRangeTo] = newRange;
	const [currentRangeFrom, currentRangeTo] = currentRange;
	return newRangeFrom !== currentRangeFrom || newRangeTo !== currentRangeTo;
};

export const validateNewRange = (range: SelectedTimestampRange): boolean => {
	const [from, to] = range;
	return dayjs(from).isValid() && dayjs(to).isValid();
};
