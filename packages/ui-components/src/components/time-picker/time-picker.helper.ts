import dayjs from 'dayjs';
import { IAbsoluteTimeLimits, ITimezoneOffset } from '../../types';
import { CALENDAR_DATE_TIME_MASK, CALENDAR_INPUT_MAX_DATE, CALENDAR_INPUT_MIN_DATE, DATETIME_INPUT_MASK } from '../absolute-time-picker/absolute-time-picker.config';
import { EAbsoluteTimePickerMode, ERelativeTimeInputMode, IRelativeTimeInput } from '../absolute-time-picker/absolute-time-picker.types';
import { ERelativeTimeComparisonConfig, IRelativeTimePickerOption, ITimePickerRelativeTime, ITimePickerTimezone } from '../relative-time-picker/relative-time-picker.types';
import { isEmpty, isNil, isNumber, memoize } from 'lodash-es';
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

	const fromDate = createFormattedDateFromTimestampInTimezone(from, timezoneName);
	const timezoneText = timezonesByOffset.filter(opt => opt.name === timezoneName)[0] ?? UTC_TIMEZONE_OFFSET;

	if (isNumber(to)) {
		const toDate = createFormattedDateFromTimestampInTimezone(to, timezoneName);

		return `${fromDate} to ${toDate} ${timezoneText.label}`;
	}

	return `${fromDate} ${timezoneText.label}`;
};

const getTimezoneOffsetFormatter = memoize((timezone: string): Intl.DateTimeFormat => new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'longOffset' }));

/** Reads the zone's offset without constructing a date in the host timezone, including its DST gaps. */
const getTimezoneOffsetMilliseconds = (timestamp: number, timezone: string): number => {
	const offset = getTimezoneOffsetFormatter(timezone)
		.formatToParts(timestamp)
		.find(part => part.type === 'timeZoneName')?.value;
	if (offset === 'GMT') {
		return 0;
	}

	const parts = offset?.match(/^GMT([+-])(\d{2}):(\d{2})(?::(\d{2}))?$/);
	if (!parts) {
		throw new RangeError(`Unable to read the timezone offset for ${timezone}`);
	}

	const [, sign, hours, minutes, seconds = '0'] = parts;
	return (sign === '-' ? -1 : 1) * (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) * 1000;
};

export const createFormattedDateFromTimestampInTimezone = (timestamp: number, timezone: string, format: string = DATETIME_INPUT_MASK): string => {
	const date = dayjs.utc(timestamp);
	return date.isValid() ? date.add(getTimezoneOffsetMilliseconds(date.valueOf(), timezone), 'millisecond').format(format) : date.format(format);
};

export const createTimestampInTimezoneFromFormattedDate = (date: string, timezone: string, format: string = DATETIME_INPUT_MASK): number => {
	const wallTime = dayjs.utc(date, format).valueOf();
	if (!Number.isFinite(wallTime)) {
		return wallTime;
	}

	// Resolve the offset at the requested time using UTC arithmetic only. Like Day.js's zoned parser,
	// prefer the current offset for repeated hours and move nonexistent hours forward across a gap.
	const initialOffset = getTimezoneOffsetMilliseconds(Date.now(), timezone);
	let timestamp = wallTime - initialOffset;
	const offset = getTimezoneOffsetMilliseconds(timestamp, timezone);
	if (offset === initialOffset) {
		return timestamp;
	}

	timestamp -= offset - initialOffset;
	const adjustedOffset = getTimezoneOffsetMilliseconds(timestamp, timezone);
	return offset === adjustedOffset ? timestamp : wallTime - Math.min(offset, adjustedOffset);
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

	const hasFrom = isNumber(from);
	const hasTo = isNumber(to);

	if (!hasFrom && !hasTo) {
		return [];
	}

	// A relative option is a [now, target] range; the single date calendar cares about the target
	if (mode === EAbsoluteTimePickerMode.Single && selectedOption.key !== CUSTOM_TIME_RANGE_KEY && hasFrom && hasTo) {
		return [dayjs(to).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
	}

	if (!hasTo && hasFrom) {
		if (selectedOption.key === CUSTOM_TIME_RANGE_KEY) {
			return [createFormattedDateFromTimestampInTimezone(from, timezoneName, CALENDAR_DATE_TIME_MASK)];
		}

		return [dayjs(from).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
	}

	if (selectedOption.key === CUSTOM_TIME_RANGE_KEY) {
		return [
			createFormattedDateFromTimestampInTimezone(from, timezoneName, CALENDAR_DATE_TIME_MASK),
			createFormattedDateFromTimestampInTimezone(to, timezoneName, CALENDAR_DATE_TIME_MASK)
		];
	}

	return [dayjs(from).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK), dayjs(to).utcOffset(timezoneOffset).format(CALENDAR_DATE_TIME_MASK)];
};

/**
 * Formats a calendar limit the way the calendar inputs show dates: whole seconds, in the selected timezone
 * @param date limit timestamp, if any
 * @param timezone selected timezone name
 * @param defaultDate formatted limit used when there is none
 * @returns limit in the date time input format
 */
export const getCalendarLimitDateFormatted = (date: number | undefined, timezone: string, defaultDate: string): string =>
	isNumber(date) ? createFormattedDateFromTimestampInTimezone(date, timezone) : defaultDate;

/**
 * Gets the limits a custom selection is checked against. They are read back from the formatted limits the
 * calendar receives, so a day click clamped to a limit (which drops its milliseconds) is never flagged, and
 * widened to the given limit, which a DST transition can move the formatted one past.
 * @param minDate minimum timestamp, if any
 * @param maxDate maximum timestamp, if any
 * @param timezone selected timezone name
 * @returns minimum and maximum timestamps, defaulting to the calendar's own limits
 */
export const getCalendarLimits = (minDate: number | undefined, maxDate: number | undefined, timezone: string): IAbsoluteTimeLimits => {
	const calendarMinDate = createTimestampInTimezoneFromFormattedDate(getCalendarLimitDateFormatted(minDate, timezone, CALENDAR_INPUT_MIN_DATE), timezone);
	const calendarMaxDate = createTimestampInTimezoneFromFormattedDate(getCalendarLimitDateFormatted(maxDate, timezone, CALENDAR_INPUT_MAX_DATE), timezone);

	return {
		minDate: isNumber(minDate) ? Math.min(calendarMinDate, Math.floor(minDate / 1000) * 1000) : calendarMinDate,
		maxDate: isNumber(maxDate) ? Math.max(calendarMaxDate, maxDate) : calendarMaxDate
	};
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
	if (range.length !== expectedSize) {
		return false;
	}

	const [from, to] = range;

	if (expectedSize === SINGLE_RANGE_SIZE) {
		return isNumber(from) && dayjs(from).isValid();
	}

	return isNumber(from) && isNumber(to) && dayjs(from).isValid() && dayjs(to).isValid() && dayjs(from).isBefore(to);
};

/**
 * Computes the natural height of the relative time view so the dropdown wraps its content instead of
 * always reserving the maximum height. Mirrors the layout constants used by kv-relative-time-picker.
 * @param options relative time option groups
 * @param displayCustomizeInterval whether the customize interval option is rendered
 * @param displayTimezoneDropdown whether the timezone dropdown is rendered
 * @returns height in pixels, capped at the relative time picker maximum height
 */
export const getRelativeViewHeight = (options: IRelativeTimePickerOption[][] | undefined, displayCustomizeInterval: boolean, displayTimezoneDropdown: boolean): number => {
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
