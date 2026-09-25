import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import MockDate from 'mockdate';
import { KvAbsoluteTimePicker } from '../../absolute-time-picker/absolute-time-picker';
import { CALENDAR_DATE_TIME_MASK } from '../../absolute-time-picker/absolute-time-picker.config';
import { EAbsoluteTimePickerMode } from '../../absolute-time-picker/absolute-time-picker.types';
import { KvAbsoluteTimePickerDropdown } from '../../absolute-time-picker-dropdown/absolute-time-picker-dropdown';
import { CUSTOM_TIME_RANGE_KEY } from '../../../utils/relative-time';
import { KvTimePicker } from '../time-picker';
import { createFormattedDateFromTimestampInTimezone, createTimestampInTimezoneFromFormattedDate, getCalendarLimits } from '../time-picker.helper';

// Run this suite with TZ=UTC and TZ=Europe/Lisbon: the host must not affect selected-zone dates.
describe('Time picker timezone conversion', () => {
	const text = '31-03-2024 01:30:00';

	beforeEach(() => MockDate.set('2024-07-01T00:00:00Z'));
	afterEach(() => MockDate.reset());

	describe.each([EAbsoluteTimePickerMode.Single, EAbsoluteTimePickerMode.Range])('when displaying selected dates in %s mode', mode => {
		it.each(['initial', 'updated'])('should preserve times inside the host DST gap when the selection is %s', async source => {
			const dates = mode === EAbsoluteTimePickerMode.Single ? ['2024-03-31 01:30:00'] : ['2024-03-31 01:30:00', '2024-03-31 01:45:00'];
			const previousDates = dates.map(date => date.replace('2024-03-31', '2024-03-30'));
			const page = await newSpecPage({
				components: [KvAbsoluteTimePicker],
				template: () => <kv-absolute-time-picker mode={mode} selectedDates={source === 'initial' ? dates : previousDates} />
			});

			if (source === 'updated') {
				page.root.selectedDates = dates;
				await page.waitForChanges();
			}

			const values = Array.from(page.root.querySelectorAll('kv-date-time-input'), input => input.getAttribute('value'));
			expect(values).toEqual(mode === EAbsoluteTimePickerMode.Single ? [text] : [text, '31-03-2024 01:45:00']);
		});
	});

	describe.each([
		['UTC', 0, Date.UTC(2024, 2, 31, 1, 30)],
		['America/New_York', -240, Date.UTC(2024, 2, 31, 5, 30)],
		['Asia/Tokyo', 540, Date.UTC(2024, 2, 30, 16, 30)],
		['Asia/Kolkata', 330, Date.UTC(2024, 2, 30, 20)]
	])('when the selected timezone is %s', (name, offset, timestamp) => {
		it('should preserve a time inside the host DST gap when converting in both directions', () => {
			expect(createTimestampInTimezoneFromFormattedDate(text, name)).toBe(timestamp);
			expect(createTimestampInTimezoneFromFormattedDate('2024-03-31 01:30:00', name, CALENDAR_DATE_TIME_MASK)).toBe(timestamp);
			expect(createFormattedDateFromTimestampInTimezone(timestamp, name)).toBe(text);
			expect(getCalendarLimits(timestamp, timestamp, name)).toEqual({ minDate: timestamp, maxDate: timestamp });
		});

		it.each(['time-picker', 'absolute-time-picker-dropdown'])('should retain the typed time through the %s parent and Apply event', async tag => {
			const timezone = { name, offset };
			const previousTimestamp = timestamp - 86400000;
			const page = await newSpecPage({
				components: [KvTimePicker, KvAbsoluteTimePickerDropdown, KvAbsoluteTimePicker],
				template: () =>
					tag === 'time-picker' ? (
						<kv-time-picker
							isOpen
							showCalendar
							calendarMode={EAbsoluteTimePickerMode.Single}
							selectedTimeOption={{ key: CUSTOM_TIME_RANGE_KEY, range: [previousTimestamp], timezone }}
						/>
					) : (
						<kv-absolute-time-picker-dropdown dropdownOpen mode={EAbsoluteTimePickerMode.Single} selectedDates={[previousTimestamp]} timezone={timezone} />
					)
			});
			const input = page.root.querySelector('#single-date-input');
			input.dispatchEvent(new CustomEvent<string>('textChange', { detail: text }));
			await page.waitForChanges();

			expect(input.getAttribute('value')).toBe(text);
			const apply = page.root.querySelector('kv-action-button-text[text="Apply"]');
			expect(apply.hasAttribute('disabled')).toBe(false);
			const selected = jest.fn();
			page.root.addEventListener(tag === 'time-picker' ? 'timeRangeChange' : 'selectedDatesChange', selected);
			apply.dispatchEvent(new CustomEvent('clickButton'));
			await page.waitForChanges();
			expect(selected).toHaveBeenCalledTimes(1);
			expect(selected.mock.calls[0][0].detail).toEqual(tag === 'time-picker' ? { key: CUSTOM_TIME_RANGE_KEY, range: [timestamp], timezone } : [timestamp]);
		});
	});

	it('should retain forward normalization for a gap in the selected timezone', () => {
		const timestamp = createTimestampInTimezoneFromFormattedDate(text, 'Europe/Lisbon');
		expect(timestamp).toBe(Date.UTC(2024, 2, 31, 1, 30));
		expect(createFormattedDateFromTimestampInTimezone(timestamp, 'Europe/Lisbon')).toBe('31-03-2024 02:30:00');
	});

	it.each([
		['2024-07-01T00:00:00Z', Date.UTC(2024, 9, 27, 0, 30)],
		['2024-12-01T00:00:00Z', Date.UTC(2024, 9, 27, 1, 30)]
	])('should prefer the current offset for a repeated hour when now is %s', (now, expected) => {
		MockDate.set(now);
		expect(createTimestampInTimezoneFromFormattedDate('27-10-2024 01:30:00', 'Europe/Lisbon')).toBe(expected);
	});
});
