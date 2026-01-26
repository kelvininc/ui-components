import type { SelectedRange } from '../types';
import { getAbsoluteTimeRange, getRelativeTimeRangeISO, getRelativeTimeRangeTimestamp } from './relative-time.helper';
import { ERelativeTimeRangeKey } from './relative-time.types';
import { newDate } from '../date/date.helper';

describe('Relative Time Spec', () => {
	const randomDate: Date = new Date('2019-09-04 10:30:21');
	const mockCurrentDate: Date = new Date('2023-03-02T16:20:00.000Z');

	describe('#getAbsoluteTimeRange', () => {
		describe('when absolute timezone is already in utc', () => {
			let actualResult: [string, string];
			const selectedRange: SelectedRange = ['2019-08-28T10:30:21.000Z', '2019-09-04T10:30:21.000Z'];
			const timezoneOffset = 0;

			beforeEach(() => {
				actualResult = getAbsoluteTimeRange(selectedRange, timezoneOffset);
			});

			it('should return a the same time range', () => {
				expect(actualResult).toEqual(['2019-08-28T10:30:21.000Z', '2019-09-04T10:30:21.000Z']);
			});
		});

		describe('when absolute timezone is not in utc', () => {
			let actualResult: [string, string];
			const selectedRange: SelectedRange = ['2019-08-28T10:30:21.000Z', '2019-09-04T10:30:21.000Z'];
			const timezoneOffset = -420;

			beforeEach(() => {
				actualResult = getAbsoluteTimeRange(selectedRange, timezoneOffset);
			});

			it('should return a the same time range', () => {
				expect(actualResult).toEqual(['2019-08-28T03:30:21.000Z', '2019-09-04T03:30:21.000Z']);
			});
		});
	});

	describe('#getRelativeTimeRangeISO', () => {
		describe('when relative time is in the past', () => {
			let actualResult: [string, string];

			beforeEach(() => {
				actualResult = getRelativeTimeRangeISO(ERelativeTimeRangeKey.Last_30_m, randomDate.toISOString());
			});

			it('should return a time range in the past with the provided time range', () => {
				expect(actualResult).toEqual(['2019-09-04T10:00:21.000Z', '2019-09-04T10:30:21.000Z']);
			});
		});

		describe('when relative time is in the future', () => {
			let actualResult: [string, string];

			beforeEach(() => {
				actualResult = getRelativeTimeRangeISO(ERelativeTimeRangeKey.Next_30_M, randomDate.toISOString());
			});

			it('should return a time range in the future with the provided time range', () => {
				expect(actualResult).toEqual(['2019-09-04T10:30:21.000Z', '2019-09-04T11:00:21.000Z']);
			});
		});

		describe('when cursor is not provided', () => {
			let actualResult: [string, string];

			beforeEach(() => {
				jest.useFakeTimers();
				jest.setSystemTime(mockCurrentDate);
				actualResult = getRelativeTimeRangeISO(ERelativeTimeRangeKey.Last_12_H);
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it('should return a time range using the current time as the cursor', () => {
				expect(actualResult).toEqual(['2023-03-02T04:20:00.000Z', '2023-03-02T16:20:00.000Z']);
			});
		});
	});

	describe('#getRelativeTimeRangeTimestamp', () => {
		describe('when relative time is in the past', () => {
			let actualResult: [number, number];
			const cursor = newDate(randomDate);

			beforeEach(() => {
				actualResult = getRelativeTimeRangeTimestamp(ERelativeTimeRangeKey.Last_30_m, cursor);
			});

			it('should return a timestamp range in the past with the provided time range', () => {
				const expectedStart = newDate('2019-09-04T10:00:21.000Z').valueOf();
				const expectedEnd = newDate('2019-09-04T10:30:21.000Z').valueOf();
				expect(actualResult).toEqual([expectedStart, expectedEnd]);
			});

			it('should return values as numbers (timestamps)', () => {
				expect(typeof actualResult[0]).toBe('number');
				expect(typeof actualResult[1]).toBe('number');
			});
		});

		describe('when relative time is in the future', () => {
			let actualResult: [number, number];
			const cursor = newDate(randomDate);

			beforeEach(() => {
				actualResult = getRelativeTimeRangeTimestamp(ERelativeTimeRangeKey.Next_30_M, cursor);
			});

			it('should return a timestamp range in the future with the provided time range', () => {
				const expectedStart = newDate('2019-09-04T10:30:21.000Z').valueOf();
				const expectedEnd = newDate('2019-09-04T11:00:21.000Z').valueOf();
				expect(actualResult).toEqual([expectedStart, expectedEnd]);
			});
		});

		describe('when cursor is not provided', () => {
			let actualResult: [number, number];

			beforeEach(() => {
				jest.useFakeTimers();
				jest.setSystemTime(mockCurrentDate);
				actualResult = getRelativeTimeRangeTimestamp(ERelativeTimeRangeKey.Last_1_H);
			});

			afterEach(() => {
				jest.useRealTimers();
			});

			it('should return a timestamp range using the current time as the cursor', () => {
				const expectedEnd = mockCurrentDate.getTime();
				const expectedStart = expectedEnd - 60 * 60 * 1000; // 1 hour in milliseconds

				expect(actualResult).toEqual([expectedStart, expectedEnd]);
			});
		});
	});
});
