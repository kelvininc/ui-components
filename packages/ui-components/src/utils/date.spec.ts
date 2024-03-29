import {
	areDatesValid,
	calculateDate,
	formatDate,
	formatDateTime,
	formatForTimezone,
	formatTimezoneName,
	fromDateFields,
	fromDatesRangeKey,
	fromISO,
	getDateMonth,
	getDateYear,
	getDatesBetweenRange,
	getDatesRangeKey,
	getDefaultTimezone,
	getFirstWeekdayIndexOfMonth,
	getMonthName,
	getNumberOfDaysInMonth,
	getTimezoneOffset,
	getTimezonesNames,
	getWeekdaysNames,
	isDateAfter,
	isDateBefore,
	isDateInArray,
	isDateInRange,
	isDateSame,
	isDateTimeBefore
} from './date.helper';

import MockDate from 'mockdate';
import dayjs from 'dayjs';

MockDate.set(new Date('2022-08-08'));

describe('Date Helper', () => {
	let randomDateMock: dayjs.Dayjs;
	let anotherDateMock: dayjs.Dayjs;
	let yesterdayMock: dayjs.Dayjs;
	let todayMock: dayjs.Dayjs;

	beforeAll(() => {
		randomDateMock = dayjs('1996-03-30 17:30:59.000');
		anotherDateMock = dayjs('1999-12-19 9:20:04.000');
	});

	beforeEach(() => {
		yesterdayMock = dayjs().subtract(1, 'day');
		todayMock = dayjs();
	});

	describe('#fromDateFields', () => {
		describe('when passing date fiels as arguments', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = randomDateMock.isSame(fromDateFields(30, 3, 1996), 'day');
			});

			it('should construct a correct date', () => {
				expect(actualResult).toBe(true);
			});
		});
	});

	describe('#fromISO', () => {
		describe('when passing ISO string', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = randomDateMock.isSame(fromISO('1996-03-30T17:30:59.000Z'), 'seconds');
			});

			it('should parse string correctly', () => {
				expect(actualResult).toBe(true);
			});
		});
	});

	describe('#getMonthName', () => {
		describe('when it receives 3', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = getMonthName(3);
			});

			it('should return March', () => {
				expect(actualResult).toBe('March');
			});
		});

		describe('when it receives 12', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = getMonthName(12);
			});

			it('should return December', () => {
				expect(actualResult).toBe('December');
			});
		});
	});

	describe('#getNumberOfDaysInMonth', () => {
		describe('when it is march of 1996', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getNumberOfDaysInMonth(3, 1996);
			});

			it('should return 31 days', () => {
				expect(actualResult).toBe(31);
			});
		});

		describe('when it is february and leap year', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getNumberOfDaysInMonth(2, 2022);
			});

			it('should return 28 days', () => {
				expect(actualResult).toBe(28);
			});
		});

		describe('when it is february and not a leap year', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getNumberOfDaysInMonth(2, 2020);
			});

			it('should return 29 days', () => {
				expect(actualResult).toBe(29);
			});
		});
	});

	describe('#getWeekdaysNames', () => {
		let actualResult: string[];

		beforeEach(() => {
			actualResult = getWeekdaysNames();
		});

		it('week days should be "Su, Mo, Tu, We, Th, Fr, Sa"', () => {
			expect(actualResult).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
		});
	});

	describe('#getFirstWeekdayIndexOfMonth', () => {
		describe('when it is march of 1996', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getFirstWeekdayIndexOfMonth(3, 1996);
			});

			it('should be friday', () => {
				expect(actualResult).toBe(5);
			});
		});

		describe('when it is august of 2022', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getFirstWeekdayIndexOfMonth(8, 2022);
			});

			it('should be monday', () => {
				expect(actualResult).toBe(1);
			});
		});

		describe('when it is may of 2022', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getFirstWeekdayIndexOfMonth(5, 2022);
			});

			it('should be sunday', () => {
				expect(actualResult).toBe(0);
			});
		});
	});

	describe('#isDateBefore', () => {
		describe('when it is before', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateBefore(randomDateMock, anotherDateMock);
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when it is not before', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateBefore(anotherDateMock, randomDateMock);
			});

			it('should be false', () => {
				expect(actualResult).toBe(false);
			});
		});
	});

	describe('#isDateAfter', () => {
		describe('when it is after', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateAfter(anotherDateMock, randomDateMock);
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when it is not after', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateAfter(randomDateMock, anotherDateMock);
			});

			it('should be false', () => {
				expect(actualResult).toBe(false);
			});
		});
	});

	describe('#isDateSame', () => {
		describe('when it is same', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateSame(new Date(), new Date());
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when it is not same', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateSame(new Date(), randomDateMock);
			});

			it('should be true', () => {
				expect(actualResult).toBe(false);
			});
		});
	});

	describe('#isDateInRange', () => {
		describe('when it is in range', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateInRange(yesterdayMock, randomDateMock, todayMock);
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when it is not in range', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateInRange(todayMock, randomDateMock, yesterdayMock);
			});

			it('should be false', () => {
				expect(actualResult).toBe(false);
			});
		});
	});

	describe('#isDateInArray', () => {
		describe('when it is in array', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateInArray(todayMock, [new Date()]);
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when it is not in array', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = isDateInArray(todayMock, [yesterdayMock]);
			});

			it('should be false', () => {
				expect(actualResult).toBe(false);
			});
		});
	});

	describe('#getDateMonth', () => {
		describe('when it is march', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getDateMonth(randomDateMock);
			});

			it('should be 2', () => {
				expect(actualResult).toBe(3);
			});
		});

		describe('when it is december', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getDateMonth(anotherDateMock);
			});

			it('should be 2', () => {
				expect(actualResult).toBe(12);
			});
		});
	});

	describe('#getDateYear', () => {
		describe('when it is 1996', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getDateYear(randomDateMock);
			});

			it('should be 1996', () => {
				expect(actualResult).toBe(1996);
			});
		});
	});

	describe('#getDatesBetweenRange', () => {
		describe('between yesterday and today are two dates inclusive', () => {
			let actualResult: number;

			beforeEach(() => {
				actualResult = getDatesBetweenRange(yesterdayMock, todayMock, true).length;
			});

			it('should be 2', () => {
				expect(actualResult).toBe(2);
			});
		});
	});

	describe('#getTimezonesNames', () => {
		describe('when checking if Europe/Lisbon is present', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = getTimezonesNames().includes('Europe/Lisbon');
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});
	});

	describe('#getDefaultTimezone', () => {
		describe('when it is UTC', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = getDefaultTimezone();
			});

			it('should be UTC', () => {
				expect(actualResult).toBe('UTC');
			});
		});
	});

	describe('#formatDateTime', () => {
		describe('when it is 30/03/1996 at 17h30', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = formatDateTime(randomDateMock);
			});

			it('should be 1996-03-30 17:30:21', () => {
				expect(actualResult).toBe('1996-03-30 17:30:59');
			});
		});
	});

	describe('#formatDate', () => {
		describe('when it is 19/12/1999', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = formatDate(anotherDateMock);
			});

			it('should be 1999-12-19', () => {
				expect(actualResult).toBe('1999-12-19');
			});
		});
	});

	describe('#formatTimezoneName', () => {
		describe('when it is Europe/Lisbon and summer time', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = formatTimezoneName('Europe/Lisbon', randomDateMock);
			});

			it('should be (+01:00) Europe/Lisbon', () => {
				expect(actualResult).toBe('(+01:00) Europe/Lisbon');
			});
		});

		describe('when it is Europe/Lisbon and winter time', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = formatTimezoneName('Europe/Lisbon', anotherDateMock);
			});

			it('should be (+00:00) Europe/Lisbon', () => {
				expect(actualResult).toBe('(+00:00) Europe/Lisbon');
			});
		});

		describe('when it is Pacific/Port_Moresby and winter time', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = formatTimezoneName('Pacific/Port_Moresby', anotherDateMock);
			});

			it('should be (+10:00) Pacific/Port Moresby', () => {
				expect(actualResult).toBe('(+10:00) Pacific/Port Moresby');
			});
		});
	});

	describe('#areDatesValid', () => {
		describe('when date are valid', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = areDatesValid(['2016-06-10', '1996-03-30']);
			});

			it('should be true', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when dates are not valid', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = areDatesValid(['not a valid date']);
			});

			it('should be false', () => {
				expect(actualResult).toBe(false);
			});
		});
	});

	describe('#calculateDate', () => {
		describe('when it is today and calculating -24 horus', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = calculateDate(todayMock, -24, 'hours').isSame(yesterdayMock, 'day');
			});

			it('should be yesterday', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when it is yesterday and calculating +24 horus', () => {
			let actualResult: boolean;

			beforeEach(() => {
				actualResult = calculateDate(yesterdayMock, 24, 'hours').isSame(todayMock, 'day');
			});

			it('should be today', () => {
				expect(actualResult).toBe(true);
			});
		});

		describe('when a quarter is added', () => {
			it('should return date with a quarter ahead', () => {
				expect(calculateDate(dayjs('01-01-2023', 'DD-MM-YYYY'), 1, 'quarter').format('DD-MM-YYYY')).toEqual(dayjs('01-04-2023', 'DD-MM-YYYY').format('DD-MM-YYYY'));
			});
		});

		describe('when a quarter is subtracted', () => {
			it('should return date with a quarter behind', () => {
				expect(calculateDate(dayjs('01-01-2023', 'DD-MM-YYYY'), -1, 'quarter').format('DD-MM-YYYY')).toEqual(dayjs('01-10-2022', 'DD-MM-YYYY').format('DD-MM-YYYY'));
			});
		});
	});

	describe('#getDatesRangeKey', () => {
		describe('when giving two valid date strings', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = getDatesRangeKey('2019-06-20', '2019-09-04');
			});

			it('should return the dates separated by #', () => {
				expect(actualResult).toBe('2019-06-20#2019-09-04');
			});
		});
	});

	describe('#fromDatesRangeKey', () => {
		describe('when giving two date separated by #', () => {
			let actualResult: string[];

			beforeEach(() => {
				actualResult = fromDatesRangeKey('2019-06-20#2019-09-04');
			});

			it('should return the array of the two dates', () => {
				expect(actualResult).toEqual(['2019-06-20', '2019-09-04']);
			});
		});

		describe('when passing the result to the getDatesRangeKey', () => {
			let actualResult: string;

			beforeEach(() => {
				actualResult = getDatesRangeKey(...fromDatesRangeKey('2019-06-20#2019-09-04'));
			});

			it('should be equal to the input', () => {
				expect(actualResult).toBe('2019-06-20#2019-09-04');
			});
		});
	});

	describe('#getTimezoneOffset', () => {
		describe('when the timezone is "America/New_York"', () => {
			it('should return -240', () => {
				expect(getTimezoneOffset('America/New_York')).toEqual(-240);
			});
		});
	});

	describe('#formatForTimezone', () => {
		describe('when the timezone is "America/New_York"', () => {
			it('should return a formatted date with timezone', () => {
				expect(formatForTimezone('America/New_York', anotherDateMock)).toEqual('1999-12-19T04:20:04-05:00');
			});
		});
	});

	describe('#isDateTimeBefore', () => {
		describe('when date A is before date B by days', () => {
			it('should return true', () => {
				expect(isDateTimeBefore(dayjs('26-12-1996', 'DD-MM-YYYY'), dayjs('29-12-1996', 'DD-MM-YYYY'))).toEqual(true);
			});
		});

		describe('when date A is after date B by days', () => {
			it('should return false', () => {
				expect(isDateTimeBefore(dayjs('29-12-1996', 'DD-MM-YYYY'), dayjs('26-12-1996', 'DD-MM-YYYY'))).toEqual(false);
			});
		});

		describe('when date A is before date B by hours', () => {
			it('should return true', () => {
				expect(isDateTimeBefore(dayjs('26-12-1996 22:00:02', 'DD-MM-YYYY HH:mm:ss'), dayjs('26-12-1996 22:01:02', 'DD-MM-YYYY HH:mm:ss'))).toEqual(true);
			});
		});

		describe('when date A is after date B by hours', () => {
			it('should return false', () => {
				expect(isDateTimeBefore(dayjs('26-12-1996 22:10:02', 'DD-MM-YYYY HH:mm:ss'), dayjs('26-12-1996 22:00:02', 'DD-MM-YYYY HH:mm:ss'))).toEqual(false);
			});
		});
	});
});
