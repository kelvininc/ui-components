export const DEFAULT_HEADER_TITLE = 'Custom Interval';
export const SINGLE_DATE_HEADER_TITLE = 'Custom Date';

export const DATE_INPUT_PLACEHOLDER = 'dd-mm-yyyy 00:00:00';
export const DATETIME_INPUT_MASK = 'DD-MM-YYYY HH:mm:ss';
// Only inserts separators; strict parsing validates the date without rewriting the user's digits.
export const DATETIME_INPUT_MASK_PATTERN = '99-99-9999 99:99:99';
export const DATE_INPUT_MASK = 'DD-MM-YYYY';
export const CALENDAR_MASK = 'YYYY-MM-DD';
export const CALENDAR_DATE_TIME_MASK = 'YYYY-MM-DD HH:mm:ss';
export const CALENDAR_INPUT_MIN_DATE = '01-01-2018 00:00:00';
/**
 * The max date bellow must be setted manually due to the component tests.
 * If we use something like: dayjs().add(50, 'years'), the test will break on the following days
 */
export const CALENDAR_INPUT_MAX_DATE = '31-12-3000 23:59:59';
// Dayjs considers months in range from 0 to 11
export const MAX_INPUT_MONTH = 11;
