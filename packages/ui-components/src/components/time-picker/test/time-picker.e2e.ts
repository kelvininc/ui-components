import { newE2EPage } from '@stencil/core/testing';
import { focusMaskedInput } from '../../date-time-input/test/date-time-input.utils';
import { CUSTOM_TIME_RANGE_KEY } from '../../../utils/relative-time/relative-time.types';

describe('Time Picker (typed dates with limits)', () => {
	it.each(['UTC', 'Europe/Lisbon'])('should preserve invalid text and disable Apply until corrected in %s', async timezone => {
		const page = await newE2EPage();
		await page.emulateTimezone(timezone);
		await page.setContent('<kv-time-picker calendar-mode="single" show-calendar is-open></kv-time-picker>');
		const picker = await page.find('kv-time-picker');
		picker.setProperty('calendarInputMinDate', Date.UTC(2026, 10, 1, 10));
		picker.setProperty('calendarInputMaxDate', Date.UTC(2027, 2, 1, 10));
		picker.setProperty('selectedTimeOption', {
			key: CUSTOM_TIME_RANGE_KEY,
			range: [Date.UTC(2026, 10, 9, 10)],
			timezone: { name: timezone, offset: 0 }
		});
		await page.waitForChanges();
		const changes = await picker.spyOnEvent('timeRangeChange');
		const input = await page.find('#single-date-input input');
		await focusMaskedInput(page, input);
		await page.$eval('#single-date-input input', (element: HTMLInputElement) => element.select());
		await input.type('31112026100000');
		await input.press('Tab');
		await page.waitForChanges();

		expect(await input.getProperty('value')).toBe('31-11-2026 10:00:00');
		expect((await page.find('#single-date-input')).getAttribute('help-text')).toBe('Invalid date');
		expect(await (await page.find('.actions kv-action-button-text[text="Apply"]')).getProperty('disabled')).toBe(true);
		expect(changes).not.toHaveReceivedEvent();

		await focusMaskedInput(page, input);
		await page.$eval('#single-date-input input', (element: HTMLInputElement) => element.select());
		await input.type('10112026100000');
		await input.press('Tab');
		await page.waitForChanges();

		expect(await input.getProperty('value')).toBe('10-11-2026 10:00:00');
		expect((await page.find('#single-date-input')).getAttribute('state')).not.toBe('invalid');
		const apply = await page.find('.actions kv-action-button-text[text="Apply"]');
		expect(await apply.getProperty('disabled')).toBe(false);
		await apply.click();
		await page.waitForChanges();
		expect(changes).toHaveReceivedEventDetail({
			key: CUSTOM_TIME_RANGE_KEY,
			range: [Date.UTC(2026, 10, 10, 10)],
			timezone: { name: timezone, offset: 0 }
		});
	});
});
