import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePicker } from '../absolute-time-picker';
import { h } from '@stencil/core';
import { EAbsoluteTimePickerMode, ERelativeTimeInputMode, IAbsoluteSelectedRangeDates } from '../absolute-time-picker.types';
import { getCustomIntervalTitle, getTypedSelection, parseTypedDateTime } from '../absolute-time-picker.helper';
import { DEFAULT_HEADER_TITLE, SINGLE_DATE_HEADER_TITLE } from '../absolute-time-picker.config';
import { EAbsoluteTimeError } from '../../absolute-time-picker-dropdown/absolute-time-picker-dropdown.types';

/**
 * Simulates typing in a date-time input. `kv-date-time-input` is not registered in these spec pages, so
 * its `textChange` is dispatched directly on the element the vdom attached the listener to.
 */
const typeDate = async (page: SpecPage, input: Element, text: string): Promise<void> => {
	input.dispatchEvent(new CustomEvent<string>('textChange', { detail: text }));
	await page.waitForChanges();
};

const getRangeInputs = (page: SpecPage): Element[] => Array.from(page.root.querySelectorAll('kv-date-time-input'));

const spyOnEvents = (page: SpecPage) => {
	const selectedDatesChange = jest.fn();
	const inputValidityChange = jest.fn();
	page.root.addEventListener('selectedDatesChange', (event: CustomEvent<IAbsoluteSelectedRangeDates>) => selectedDatesChange(event.detail.range));
	page.root.addEventListener('inputValidityChange', (event: CustomEvent<boolean>) => inputValidityChange(event.detail));

	return { selectedDatesChange, inputValidityChange };
};

describe('Absolute Time Picker (unit tests)', () => {
	let page: SpecPage;

	// This component in testing should always consider an initial date
	// to prevent snapshots changes
	describe('when default props and initial date are used', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker initialDate="2023-03-03" />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when the component loads with preselected dates', () => {
		let component: KvAbsoluteTimePicker;

		describe('in single mode', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAbsoluteTimePicker],
					template: () => <kv-absolute-time-picker mode={EAbsoluteTimePickerMode.Single} selectedDates={['2023-03-03 10:30:00']} />
				});
				component = page.rootInstance;
			});

			it('should initialize the single input with the selected date', () => {
				expect(component.singleInputValue).toEqual('03-03-2023 10:30:00');
			});

			it('should display the month of the selected date', () => {
				expect(component.displayedMonth.format('YYYY-MM')).toEqual('2023-03');
			});
		});

		describe('in range mode', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAbsoluteTimePicker],
					template: () => <kv-absolute-time-picker selectedDates={['2023-03-03 10:30:00', '2023-03-10 18:00:00']} />
				});
				component = page.rootInstance;
			});

			it('should initialize the from and to inputs with the selected dates', () => {
				expect(component.fromInputValue).toEqual('03-03-2023 10:30:00');
				expect(component.toInputValue).toEqual('10-03-2023 18:00:00');
			});
		});

		describe('when an initial date is provided', () => {
			beforeEach(async () => {
				page = await newSpecPage({
					components: [KvAbsoluteTimePicker],
					template: () => <kv-absolute-time-picker initialDate="2024-01-15" selectedDates={['2023-03-03 10:30:00', '2023-03-10 18:00:00']} />
				});
				component = page.rootInstance;
			});

			it('should keep the initial date as the displayed month', () => {
				expect(component.displayedMonth.format('YYYY-MM')).toEqual('2024-01');
			});
		});
	});

	describe('when no header title is provided', () => {
		const getTitle = () => page.root.querySelector('.header .title')?.textContent;

		it('should title a range as an interval', async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker initialDate="2023-03-03" />
			});

			expect(getTitle()).toEqual(DEFAULT_HEADER_TITLE);
		});

		it('should title a single date as a date', async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker initialDate="2023-03-03" mode={EAbsoluteTimePickerMode.Single} />
			});

			expect(getTitle()).toEqual(SINGLE_DATE_HEADER_TITLE);
		});

		it('should hide the header for an empty title', async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker initialDate="2023-03-03" headerTitle="" />
			});

			expect(page.root.querySelector('.header')).toBeNull();
		});
	});

	describe('when dates are typed in single mode', () => {
		let component: KvAbsoluteTimePicker;
		let events: ReturnType<typeof spyOnEvents>;
		let input: Element;

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker mode={EAbsoluteTimePickerMode.Single} selectedDates={['2023-03-03 10:30:00']} />
			});
			component = page.rootInstance;
			events = spyOnEvents(page);
			input = page.root.querySelector('#single-date-input');
		});

		it('should keep an incomplete date in the input without emitting it', async () => {
			await typeDate(page, input, '15-03-20yy 00:00:00');

			expect(component.singleInputValue).toEqual('15-03-20yy 00:00:00');
			expect(events.selectedDatesChange).not.toHaveBeenCalled();
			expect(events.inputValidityChange.mock.calls).toEqual([[false]]);
		});

		it('should not roll an impossible date over into another one', async () => {
			await typeDate(page, input, '31-02-2024 00:00:00');

			expect(events.selectedDatesChange).not.toHaveBeenCalled();
			expect(events.inputValidityChange.mock.calls).toEqual([[false]]);
			expect(input.getAttribute('helptext')).toBe('Invalid date');
			expect(input.getAttribute('state')).toBe('invalid');
			expect(component.displayedMonth.format('YYYY-MM')).toBe('2023-03');
		});

		it('should replace a stale limit error with an invalid date error and clear it after correction', async () => {
			page.root.error = EAbsoluteTimeError.StartDateBeforeMinimumDate;
			await typeDate(page, input, '31-11-2026 10:00:00');
			expect(input.getAttribute('helptext')).toBe('Invalid date');

			page.root.error = undefined;
			await typeDate(page, input, '10-11-2026 10:00:00');
			expect(input.getAttribute('state')).not.toBe('invalid');
			expect(input.getAttribute('helptext')).not.toBe('Invalid date');
		});

		it('should emit a valid date and report the input as valid again', async () => {
			await typeDate(page, input, '15-03-20yy 00:00:00');
			await typeDate(page, input, '15-03-2024 10:30:00');

			expect(events.selectedDatesChange.mock.calls).toEqual([[['2024-03-15 10:30:00']]]);
			expect(events.inputValidityChange.mock.calls).toEqual([[false], [true]]);
		});

		it('should emit no dates when the input is cleared', async () => {
			await typeDate(page, input, '');

			expect(events.selectedDatesChange.mock.calls).toEqual([[[]]]);
			expect(events.inputValidityChange).not.toHaveBeenCalled();
		});

		it('should keep the typed text when the same dates are sent again', async () => {
			await typeDate(page, input, '15-03-20yy 00:00:00');
			page.root.selectedDates = ['2023-03-03 10:30:00'];
			await page.waitForChanges();

			expect(component.singleInputValue).toEqual('15-03-20yy 00:00:00');
		});

		it('should keep the typed text when the emitted dates are sent back', async () => {
			await typeDate(page, input, '15-03-2024 10:30:00');
			await typeDate(page, input, '15-03-2024 10:3');
			page.root.selectedDates = ['2024-03-15 10:30:00'];
			await page.waitForChanges();

			expect(component.singleInputValue).toEqual('15-03-2024 10:3');
		});

		it('should replace the typed text when different dates are sent', async () => {
			await typeDate(page, input, '15-03-20yy 00:00:00');
			page.root.selectedDates = ['2023-04-01 08:00:00'];
			await page.waitForChanges();

			expect(component.singleInputValue).toEqual('01-04-2023 08:00:00');
			expect(events.inputValidityChange.mock.calls).toEqual([[false], [true]]);
		});
	});

	describe('when dates are typed in range mode', () => {
		let component: KvAbsoluteTimePicker;
		let events: ReturnType<typeof spyOnEvents>;
		let fromInput: Element;
		let toInput: Element;

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker selectedDates={['2023-03-03 10:30:00', '2023-03-10 18:00:00']} />
			});
			component = page.rootInstance;
			events = spyOnEvents(page);
			[fromInput, toInput] = getRangeInputs(page);
		});

		it('should not emit while the end is incomplete', async () => {
			await typeDate(page, toInput, '10-03-2023 1');

			expect(component.toInputValue).toEqual('10-03-2023 1');
			expect(toInput.getAttribute('helptext')).toBe('Invalid date');
			expect(fromInput.getAttribute('helptext')).not.toBe('Invalid date');
			expect(events.selectedDatesChange).not.toHaveBeenCalled();
			expect(events.inputValidityChange.mock.calls).toEqual([[false]]);
		});

		it('should not emit a new start while the end is incomplete', async () => {
			await typeDate(page, toInput, '10-03-2023 1');
			await typeDate(page, fromInput, '01-03-2023 10:30:00');

			expect(events.selectedDatesChange).not.toHaveBeenCalled();
		});

		it('should mark only the invalid start date and keep the calendar unchanged', async () => {
			const initialMonth = component.displayedMonth.format('YYYY-MM');
			await typeDate(page, fromInput, '31-11-2026 10:00:00');

			expect(fromInput.getAttribute('helptext')).toBe('Invalid date');
			expect(toInput.getAttribute('state')).not.toBe('invalid');
			expect(component.displayedMonth.format('YYYY-MM')).toBe(initialMonth);
			expect(events.selectedDatesChange).not.toHaveBeenCalled();
		});

		it('should emit both dates once the end is complete again', async () => {
			await typeDate(page, toInput, '10-03-2023 1');
			await typeDate(page, fromInput, '01-03-2023 10:30:00');
			await typeDate(page, toInput, '11-03-2023 18:00:00');

			expect(events.selectedDatesChange.mock.calls).toEqual([[['2023-03-01 10:30:00', '2023-03-11 18:00:00']]]);
			expect(events.inputValidityChange.mock.calls).toEqual([[false], [true]]);
		});

		it('should emit only the start when the end is cleared', async () => {
			await typeDate(page, toInput, '');

			expect(events.selectedDatesChange.mock.calls).toEqual([[['2023-03-03 10:30:00']]]);
			expect(events.inputValidityChange).not.toHaveBeenCalled();
		});

		it('should not emit when the start is cleared while the end is filled', async () => {
			await typeDate(page, fromInput, '');

			expect(events.selectedDatesChange).not.toHaveBeenCalled();
			expect(events.inputValidityChange.mock.calls).toEqual([[false]]);
		});

		it('should emit no dates when both inputs are cleared', async () => {
			await typeDate(page, fromInput, '');
			await typeDate(page, toInput, '');

			expect(events.selectedDatesChange.mock.calls).toEqual([[[]]]);
			expect(events.inputValidityChange.mock.calls).toEqual([[false], [true]]);
		});

		it('should keep the typed text when the same dates are sent again', async () => {
			await typeDate(page, toInput, '10-03-2023 1');
			page.root.selectedDates = ['2023-03-03 10:30:00', '2023-03-10 18:00:00'];
			await page.waitForChanges();

			expect(component.toInputValue).toEqual('10-03-2023 1');
		});
	});

	describe('when only the end is typed in range mode', () => {
		let events: ReturnType<typeof spyOnEvents>;

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker />
			});
			events = spyOnEvents(page);
			const [, toInput] = getRangeInputs(page);
			await typeDate(page, toInput, '10-03-2023 18:00:00');
		});

		it('should wait for the start before emitting', () => {
			expect(events.selectedDatesChange).not.toHaveBeenCalled();
			expect(events.inputValidityChange.mock.calls).toEqual([[false]]);
		});
	});

	describe('when a range without an end is selected', () => {
		let component: KvAbsoluteTimePicker;

		it('should leave the end input empty for a one-date range', async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker selectedDates={['2023-03-03 10:30:00']} />
			});
			component = page.rootInstance;

			expect(component.toInputValue).toEqual('');
		});

		it('should leave the end input empty for an undefined end', async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker selectedDates={['2023-03-03 10:30:00', undefined]} />
			});
			component = page.rootInstance;

			expect(component.toInputValue).toEqual('');
		});
	});

	describe('when the relative time config is cleared along with new selected dates', () => {
		let component: KvAbsoluteTimePicker;

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => (
					<kv-absolute-time-picker
						selectedDates={['2023-03-09 18:00:00', '2023-03-10 18:00:00']}
						relativeTimeConfig={{ mode: ERelativeTimeInputMode.Text, from: 'Now - 24 hours', to: 'Now' }}
					/>
				)
			});
			component = page.rootInstance;

			page.root.selectedDates = ['2023-03-03 10:30:00', '2023-03-10 18:00:00'];
			page.root.relativeTimeConfig = undefined;
			await page.waitForChanges();
		});

		it('should show the selected dates instead of the relative texts', () => {
			expect(component.fromInputValue).toEqual('03-03-2023 10:30:00');
			expect(component.toInputValue).toEqual('10-03-2023 18:00:00');
		});
	});

	describe('when the mode changes', () => {
		let component: KvAbsoluteTimePicker;

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker selectedDates={['2023-03-03 10:30:00']} />
			});
			component = page.rootInstance;

			page.root.mode = EAbsoluteTimePickerMode.Single;
			await page.waitForChanges();
		});

		it('should fill the input of the new mode', () => {
			expect(component.singleInputValue).toEqual('03-03-2023 10:30:00');
		});
	});
});

describe('Absolute Time Picker helpers', () => {
	describe('#parseTypedDateTime', () => {
		it('should accept February 29 in a leap year', () => {
			expect(parseTypedDateTime('29-02-2028 10:00:00')?.format('YYYY-MM-DD')).toBe('2028-02-29');
		});
		it('should parse a complete date', () => {
			expect(parseTypedDateTime('15-03-2024 10:30:45')?.format('YYYY-MM-DD HH:mm:ss')).toEqual('2024-03-15 10:30:45');
		});

		// A local parse would move 01:30 to 02:30 on a host in Europe/Lisbon, which skips that hour on 31-03-2024
		it('should keep the typed wall-clock time whatever the host timezone', () => {
			const date = parseTypedDateTime('31-03-2024 01:30:00');

			expect(date?.isUTC()).toBe(true);
			expect(date?.format('YYYY-MM-DD HH:mm:ss')).toEqual('2024-03-31 01:30:00');
		});

		it.each(['', '15-03-20yy 00:00:00', '31-02-2024 00:00:00', '29-02-2023 00:00:00', '15-13-2024 00:00:00', 'Now - 24 hours'])('should reject %p', text => {
			expect(parseTypedDateTime(text)).toBeUndefined();
		});
	});

	describe('#getCustomIntervalTitle', () => {
		it('should name a single date a date and anything else an interval', () => {
			expect(getCustomIntervalTitle(EAbsoluteTimePickerMode.Single)).toEqual(SINGLE_DATE_HEADER_TITLE);
			expect(getCustomIntervalTitle(EAbsoluteTimePickerMode.Range)).toEqual(DEFAULT_HEADER_TITLE);
			expect(getCustomIntervalTitle(undefined)).toEqual(DEFAULT_HEADER_TITLE);
		});
	});

	describe('#getTypedSelection', () => {
		const A = '03-03-2023 10:30:00';
		const B = '10-03-2023 18:00:00';
		const format = (dates?: { format: (mask: string) => string }[]) => dates?.map(date => date.format('DD-MM-YYYY HH:mm:ss'));

		it.each([
			[EAbsoluteTimePickerMode.Single, { from: '', to: '', single: '' }, []],
			[EAbsoluteTimePickerMode.Single, { from: '', to: '', single: A }, [A]],
			[EAbsoluteTimePickerMode.Single, { from: '', to: '', single: '03-03-20yy 00:00:00' }, undefined],
			[undefined, { from: '', to: '', single: A }, [A]],
			[EAbsoluteTimePickerMode.Range, { from: '', to: '', single: '' }, []],
			[EAbsoluteTimePickerMode.Range, { from: A, to: '', single: '' }, [A]],
			[EAbsoluteTimePickerMode.Range, { from: A, to: B, single: '' }, [A, B]],
			[EAbsoluteTimePickerMode.Range, { from: '', to: B, single: '' }, undefined],
			[EAbsoluteTimePickerMode.Range, { from: A, to: '10-03-2023 1', single: '' }, undefined],
			[EAbsoluteTimePickerMode.Range, { from: '03-03-2023 1', to: B, single: '' }, undefined]
		])('in %s mode with %p should resolve %p', (mode, typedDates, expected) => {
			expect(format(getTypedSelection(mode, typedDates))).toEqual(expected);
		});
	});
});
