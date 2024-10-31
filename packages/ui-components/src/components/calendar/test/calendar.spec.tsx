import { SpecPage, h } from '@stencil/core/internal';
import { KvCalendar } from '../calendar';
import { newSpecPage } from '@stencil/core/testing';

describe('Calendar (unit tests)', () => {
	let page: SpecPage;
	let component: KvCalendar;

	describe('when uses default props', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendar],
				template: () => <kv-calendar initialDate="2022-08-01"></kv-calendar>
			});
			component = page.rootInstance;
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});

		it('should initialize `month` and `year` correctly', () => {
			const expectedTodayMonth = 8;
			const expectedTodayYear = 2022;

			expect(component.month).toBe(expectedTodayMonth);
			expect(component.year).toBe(expectedTodayYear);
		});
	});

	describe('when selected dates is passed', () => {
		describe('and all dates are valid', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06', '2022-08-07']}></kv-calendar>
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});

		describe('and one date is invalid', () => {
			it('should throw a validation error', async () => {
				await expect(
					newSpecPage({
						components: [KvCalendar],
						template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', 'invalid-date', '2022-08-07']}></kv-calendar>
					})
				).rejects.toThrow('Selected date should be an array with valid dates');
			});
		});
	});

	describe('when initial date is passed', () => {
		describe('and is a valid date', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					html: '<kv-calendar initial-date="2022-08-01"></kv-calendar>'
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});

			it('should initialize `month` and `year` to the initial date', () => {
				const expectedTodayMonth = 8;
				const expectedTodayYear = 2022;

				expect(component.month).toBe(expectedTodayMonth);
				expect(component.year).toBe(expectedTodayYear);
			});
		});

		describe('and is an invalid date', () => {
			it('should throw a validation error', async () => {
				await expect(
					newSpecPage({
						components: [KvCalendar],
						html: '<kv-calendar initial-date="not-a-valid-initial-date"></kv-calendar>'
					})
				).rejects.toThrow('Initial date should be a valid date');
			});
		});
	});

	describe('when disabled dates is passed', () => {
		describe('and all dates are valid', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" disabledDates={['2022-08-05', '2022-08-06', '2022-08-07']}></kv-calendar>
				});
				component = page.rootInstance;
			});

			it('should match the snapshot', () => {
				expect(page.root).toMatchSnapshot();
			});
		});

		describe('and one date is invalid', () => {
			it('should throw a validation error', async () => {
				await expect(
					newSpecPage({
						components: [KvCalendar],
						template: () => <kv-calendar initialDate="2022-08-01" disabledDates={['2022-08-05', 'invalid-date', '2022-08-07']}></kv-calendar>
					})
				).rejects.toThrow('Disabled dates should be an array with valid dates');
			});
		});
	});

	describe('when `isDayDisabled` is called', () => {
		describe('with a day on the disabled dates', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" disabledDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayDisabled(5);
			});

			it('should return `true`', () => {
				expect(result).toBe(true);
			});
		});

		describe('with a day below the minimum date', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" minDate="2022-08-05"></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayDisabled(4);
			});

			it('should return `true`', () => {
				expect(result).toBe(true);
			});
		});

		describe('with a day above the maximum date', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" maxDate="2022-08-05"></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayDisabled(6);
			});

			it('should return `true`', () => {
				expect(result).toBe(true);
			});
		});

		describe('with a not disabled day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" minDate="2022-08-04" disabledDates={['2022-08-05']} maxDate="2022-08-07"></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayDisabled(6);
			});

			it('should return `false`', () => {
				expect(result).toBe(false);
			});
		});
	});

	describe('when `isDayActive` is called', () => {
		describe('with a day on the selected dates', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayActive(5);
			});

			it('should return `true`', () => {
				expect(result).toBe(true);
			});
		});

		describe('with a day not on the selected dates', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-06']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayActive(5);
			});

			it('should return `false`', () => {
				expect(result).toBe(false);
			});
		});
	});

	describe('when `onMouseEnter` is called', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendar],
				template: () => <kv-calendar initialDate="2022-08-01"></kv-calendar>
			});
			component = page.rootInstance;
			component.onMouseEnter(5);
		});

		it('should set update hovered day state', () => {
			expect(component.hoveredDay).toBe(5);
		});
	});

	describe('when `onMouseLeave` is called', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvCalendar],
				template: () => <kv-calendar initialDate="2022-08-01"></kv-calendar>
			});
			component = page.rootInstance;
			component.onMouseEnter(5);
			component.onMouseLeave(5);
		});

		it('should set reset hovered day state', () => {
			expect(component.hoveredDay).toBeUndefined();
		});
	});

	describe('when `getSelectedRange` is called', () => {
		describe('and selected dates is empty', () => {
			let result: [] | [string] | [string, string];

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={[]}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.getSelectedRange();
			});

			it('should return empty array', () => {
				expect(result).toEqual([]);
			});
		});

		describe('and selected dates only has one element', () => {
			let result: [] | [string] | [string, string];

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.getSelectedRange();
			});

			it('should return an array with only the selected date', () => {
				expect(result).toEqual(['2022-08-05']);
			});
		});

		describe('and selected dates have multiple dates', () => {
			let result: [] | [string] | [string, string];

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06', '2022-08-07']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.getSelectedRange();
			});

			it('should return an array with the first and last element of the selected dates array', () => {
				expect(result).toEqual(['2022-08-05', '2022-08-07']);
			});
		});
	});

	describe('when `isDayInRange` is called', () => {
		describe('and the day is disabled', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" disabledDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayInRange(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and there is no day selected', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01"></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayInRange(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and there is day hovered', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isDayInRange(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and there is multiple days selected', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06', '2022-08-07']}></kv-calendar>
				});
				component = page.rootInstance;
				component.hoveredDay = 9;
				result = component.isDayInRange(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and day not is between the start date and the hovered day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				component.hoveredDay = 9;
				result = component.isDayInRange(10);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and day is between the start date and the hovered day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
				});
				component = page.rootInstance;
				component.hoveredDay = 9;
				result = component.isDayInRange(7);
			});

			it('should return true', () => {
				expect(result).toBe(true);
			});
		});
	});

	describe('when `isSelectedStartDay` is called', () => {
		describe('and there is no day selected', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01"></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isSelectedStartDay(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and the is not the first selected day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isSelectedStartDay(6);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and the is the first selected day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isSelectedStartDay(5);
			});

			it('should return true', () => {
				expect(result).toBe(true);
			});
		});
	});

	describe('when `isSelectedEndDay` is called', () => {
		describe('and there is no day selected', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01"></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isSelectedEndDay(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and there is only one day selected', () => {
			describe('and the not day the selected day', () => {
				let result: boolean;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendar],
						template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
					});
					component = page.rootInstance;
					result = component.isSelectedEndDay(6);
				});

				it('should return false', () => {
					expect(result).toBe(false);
				});
			});

			describe('and the day the selected day', () => {
				let result: boolean;

				beforeEach(async () => {
					page = await newSpecPage({
						components: [KvCalendar],
						template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05']}></kv-calendar>
					});
					component = page.rootInstance;
					result = component.isSelectedEndDay(5);
				});

				it('should return true', () => {
					expect(result).toBe(true);
				});
			});
		});

		describe('and the is not the last selected day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isSelectedEndDay(5);
			});

			it('should return false', () => {
				expect(result).toBe(false);
			});
		});

		describe('and the is the last selected day', () => {
			let result: boolean;

			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvCalendar],
					template: () => <kv-calendar initialDate="2022-08-01" selectedDates={['2022-08-05', '2022-08-06']}></kv-calendar>
				});
				component = page.rootInstance;
				result = component.isSelectedEndDay(6);
			});

			it('should return true', () => {
				expect(result).toBe(true);
			});
		});
	});
});
