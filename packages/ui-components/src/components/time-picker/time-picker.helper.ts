import dayjs from 'dayjs';
import { ITimezoneOffset } from '../../types';
import { CALENDAR_DATE_TIME_MASK, DATETIME_INPUT_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { EAbsoluteTimePickerMode, ERelativeTimeInputMode, IRelativeTimeInput } from '../absolute-time-picker/absolute-time-picker.types';
import { ERelativeTimeComparisonConfig, IRelativeTimePickerOption, ITimePickerRelativeTime, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { isEmpty, isNil, isNumber } from 'lodash-es';
import { FULL_RANGE_SIZE, SINGLE_RANGE_SIZE, UTC_TIMEZONE_OFFSET } from './time-picker.config';
import { BOTTOM_OPTIONS_HEIGHT, GROUP_GAP, MAX_HEIGHT, PADDING_SIZE, SELECT_OPTION_HEIGHT } from '../relative-time-picker/relative-time-picker.config';
import { ITimePickerTime, ITimePickerTimeState, SelectedTimestamp } from './time-picker.types';
import { newTimezoneDate } from '../../utils/date/date.helper';
import { CUSTOM_TIME_RANGE_KEY } from '../../utils/relative-time';

/**
 * Generates the text displayed in the dropdown when the custom interval option is selected
 * @param range range in timestamp
 * @param timezone timezone applied to the timestamp
 * @returns label to be displayed in the dropdown
 */
export const buildCustomIntervalTimeRange = (range: SelectedTimestamp, timezone: string): string => {
	if (!isEmpty(range)) {
		const [from, to] = range;
		const timeZoneFromDate = createFormattedDateFromTimestampInTimezone(from, timezone);
		const timeZoneToDate = createFormattedDateFromTimestampInTimezone(to, timezone);
		return isNil(to) ? timeZoneFromDate : `${timeZoneFromDate} to ${timeZoneToDate}`;
	}

	return '';
};

/**
 * Generates the text to be displayed by the tooltip when the dropdown input is hovered
 * @param range selectd range
 * @param timezones timezones available
 * @returns tooltip text to be displayed
 */
export const buildTooltipText = (range: SelectedTimestamp, selectdTimezone: ITimePickerTimezone, timezonesByOffset: ITimezoneOffset[]): string => {
	const [from, to] = range;
	const timezoneName = selectdTimezone.name;

	const fromDate = dayjs(from).tz(timezoneName);
	const timezoneText = timezonesByOffset.filter(opt => opt.name === timezoneName)[0] ?? UTC_TIMEZONE_OFFSET;

	if (isNumber(to)) {
		const toDate = dayjs(to).tz(timezoneName);

		return `${fromDate.format(DATETIME_INPUT_MASK)} to ${toDate.format(DATETIME_INPUT_MASK)} ${timezoneText.label}`;
	}

	return `${fromDate.format(DATETIME_INPUT_MASK)} ${timezoneText.label}`;
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
 * @param defaultTimezone timezone used when the selected option has none
 * @param mode calendar mode; in single mode a relative option resolves to its end date
 * @returns range in the calendar date time format
 */
export const getAbsoluteTimePickerRangeDates = (
	selectedOption: ITimePickerTimeState,
	defaultTimezone: ITimePickerTimezone,
	mode: EAbsoluteTimePickerMode = EAbsoluteTimePickerMode.Range
): string[] => {
	const [from, to] = selectedOption.range;
	const timezoneOffset = selectedOption.timezone?.offset ?? defaultTimezone.offset;
	const timezoneName = selectedOption.timezone?.name ?? defaultTimezone.name;

	if (!from && !to) {
		return [];
	}

	// A relative option is a [now, target] range; the single date calendar cares about the target
	if (mode === EAbsoluteTimePickerMode.Single && selectedOption.key !== CUSTOM_TIME_RANGE_KEY && from && to) {
		return [dayjs(to).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
	}

	if (!to && from) {
		if (selectedOption.key === CUSTOM_TIME_RANGE_KEY) {
			return [dayjs(from).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK)];
		}

		return [dayjs(from).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
	}

	if (selectedOption.key === CUSTOM_TIME_RANGE_KEY) {
		return [dayjs(from).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK), dayjs(to).tz(timezoneName).format(CALENDAR_DATE_TIME_MASK)];
	}

	return [dayjs(from).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK), dayjs(to).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
};

export const getLast24HoursRange = (): SelectedTimestamp => {
	const nowTimestamp = dayjs().utc();
	return [nowTimestamp.subtract(24, 'hours').valueOf(), nowTimestamp.valueOf()];
};

export const getRelativeTimeInputText = (options: IRelativeTimePickerOption[][], selectedTimeOption: ITimePickerRelativeTime, timezone: string): IRelativeTimeInput => {
	const option = options.flat().find(option => option.value === selectedTimeOption.key);

	if (!isEmpty(option)) {
		if (option.comparisonConfig === ERelativeTimeComparisonConfig.RelativeAmountOfUnits) {
			return {
				mode: ERelativeTimeInputMode.Text,
				from: `Now - ${Math.abs(option.startDate.amount) === 0 ? 'start of' : Math.abs(option.startDate.amount)} ${option.startDate.unit}`,
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

export const getTimestampFromDateRange = (range: SelectedTimestamp, previousTimezone: string, newTimezone: string): SelectedTimestamp => {
	return (range as number[]).map(timestamp => {
		// Load date in the previous timezone
		const parsedDate = createFormattedDateFromTimestampInTimezone(timestamp, previousTimezone);
		// Create new timestamp with the updated timezone
		return createTimestampInTimezoneFromFormattedDate(parsedDate, newTimezone);
	}) as SelectedTimestamp;
};

export const hasRangeChanged = (componentRangeState: SelectedTimestamp, propRangeState: SelectedTimestamp): boolean => {
	if (isEmpty(componentRangeState) && isEmpty(propRangeState)) {
		return false;
	}

	if (isEmpty(propRangeState) && !isEmpty(componentRangeState)) {
		return true;
	}

	if (componentRangeState?.length !== propRangeState?.length) {
		return true;
	}

	const [newRangeFrom, newRangeTo] = propRangeState;
	const [currentRangeFrom, currentRangeTo] = componentRangeState;
	return newRangeFrom !== currentRangeFrom || newRangeTo !== currentRangeTo;
};

export const validateNewRange = (range: SelectedTimestamp, expectedSize: number = FULL_RANGE_SIZE): boolean => {
	const [from, to] = range;

	if (expectedSize === SINGLE_RANGE_SIZE) {
		return isNumber(from) && dayjs(from).isValid();
	}

	return from && to && dayjs(from).isValid() && dayjs(to).isValid() && dayjs(from).isBefore(to);
};

/**
 * Computes the natural height of the relative time view so the dropdown wraps its content instead of
 * always reserving the maximum height. Mirrors the layout constants used by kv-relative-time-picker.
 * @param options relative time option groups
 * @param displayCustomizeInterval whether the customize interval option is rendered
 * @param displayTimezoneDropdown whether the timezone dropdown is rendered
 * @returns height in pixels, capped at the relative time picker maximum height
 */
export const getRelativeViewHeight = (options: IRelativeTimePickerOption[][], displayCustomizeInterval: boolean, displayTimezoneDropdown: boolean): number => {
	const groups = options ?? [];
	const optionsHeight = groups.reduce<number>((acc, group) => acc + group.length * SELECT_OPTION_HEIGHT, 0);
	const gapsHeight = Math.max(groups.length - 1, 0) * GROUP_GAP;
	const bottomOptionsHeight = (displayCustomizeInterval ? BOTTOM_OPTIONS_HEIGHT : 0) + (displayTimezoneDropdown ? BOTTOM_OPTIONS_HEIGHT : 0);

	return Math.min(optionsHeight + gapsHeight + 2 * PADDING_SIZE + bottomOptionsHeight, MAX_HEIGHT);
};

export const getTimePickerEventPayload = (timeState: ITimePickerTimeState, timezone: ITimePickerTimezone): ITimePickerTime => {
	const { key, range } = timeState;
	const timezoneOffset = timezone.offset;
	const timezoneName = timezone.name;

	return {
		key,
		range: range as [number] | [number, number],
		timezone: {
			offset: timezoneOffset,
			name: timezoneName
		}
	};
};
