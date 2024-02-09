import dayjs from 'dayjs';

export const DEFAULT_HEADER_TITLE = 'Custom Interval';

export const DATE_INPUT_PLACEHOLDER = 'dd-mm-yyyy 00:00:00';
export const DATETIME_INPUT_MASK = 'DD-MM-YYYY HH:mm:ss';
export const DATE_INPUT_MASK = 'DD-MM-YYYY';
export const CALENDAR_MASK = 'YYYY-MM-DD';
export const CALENDAR_DATE_TIME_MASK = 'YYYY-MM-DD HH:mm:ss';
export const CALENDAR_INPUT_MIN_DATE = '01-01-2018 00:00:00';
export const CALENDAR_INPUT_MAX_DATE = dayjs('31-12-2050 23:59:59', DATETIME_INPUT_MASK).add(50, 'year').format(DATETIME_INPUT_MASK);
export const MAX_INPUT_YEAR = dayjs().add(50, 'year').year();
// Dayjs considers months in range from 0 to 11
export const MAX_INPUT_MONTH = 11;
