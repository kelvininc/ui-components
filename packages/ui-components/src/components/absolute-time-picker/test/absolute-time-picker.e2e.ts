import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { focusMaskedInput } from '../../date-time-input/test/date-time-input.utils';

describe('Absolute Time Picker (end to end)', () => {
	let page: E2EPage;

	it.each(['from-input', 'to-input'])('should preserve impossible dates in the range field %s', async inputName => {
		page = await newE2EPage();
		await page.setContent('<kv-absolute-time-picker initial-date="2026-11-10"></kv-absolute-time-picker>');
		const picker = await page.find('kv-absolute-time-picker');
		const changes = await picker.spyOnEvent('selectedDatesChange');
		const input = await page.find(`input[name="${inputName}"]`);
		await focusMaskedInput(page, input);
		await input.type('31112026100000');
		await input.press('Tab');
		await page.waitForChanges();

		expect(await input.getProperty('value')).toBe('31-11-2026 10:00:00');
		expect((await page.find(`kv-date-time-input[input-name="${inputName}"]`)).getAttribute('help-text')).toBe('Invalid date');
		expect(changes).not.toHaveReceivedEvent();
	});

	describe('when user clicks on a calendar date', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-absolute-time-picker></kv-absolute-time-picker>');

			const absoluteTimePickerElement = await page.find('kv-absolute-time-picker');
			spyChangeEvent = await absoluteTimePickerElement.spyOnEvent('selectedDatesChange');

			const buttonElement = await page.find('kv-calendar >>> kv-calendar-day[day="15"] >>> .calendar-day');
			await buttonElement.click();
		});

		it('should emit the a `selectedDatesChange`', () => {
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});

	describe.each(['UTC', 'Europe/Lisbon'])('when impossible dates are entered with limits in %s', timezone => {
		let input: E2EElement;
		let picker: E2EElement;
		let spyDatesChange: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.emulateTimezone(timezone);
			await page.setContent(
				'<kv-absolute-time-picker mode="single" initial-date="2026-11-10" calendar-input-min-date="25-09-2026 16:19:44" calendar-input-max-date="31-12-2027 23:59:59"></kv-absolute-time-picker>'
			);
			picker = await page.find('kv-absolute-time-picker');
			spyDatesChange = await picker.spyOnEvent('selectedDatesChange');
			input = await page.find('#single-date-input input');
			await focusMaskedInput(page, input);
		});

		it.each([
			['31112026100000', '31-11-2026 10:00:00'],
			['31022027100000', '31-02-2027 10:00:00'],
			['31-11-2026 10:00:00', '31-11-2026 10:00:00']
		])('should keep an impossible date unchanged after typing and blur when given %s', async (text, expected) => {
			await input.type(text);
			await input.press('Tab');
			await page.waitForChanges();

			expect(await input.getProperty('value')).toBe(expected);
			expect((await page.find('#single-date-input')).getAttribute('help-text')).toBe('Invalid date');
			expect(await (await page.find('kv-calendar')).getProperty('initialDate')).toBe('2026-11-10');
			expect(spyDatesChange).not.toHaveReceivedEvent();
		});

		it('should keep pasted invalid text and recover after replacing it with a valid date', async () => {
			await page.evaluate(() => {
				const clipboardData = new DataTransfer();
				clipboardData.setData('text/plain', '31-11-2026 10:00:00');
				document.querySelector('#single-date-input input').dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
			});
			await page.waitForChanges();
			expect(await input.getProperty('value')).toBe('31-11-2026 10:00:00');
			expect((await page.find('#single-date-input')).getAttribute('help-text')).toBe('Invalid date');
			expect(spyDatesChange).not.toHaveReceivedEvent();

			await input.focus();
			await page.$eval('#single-date-input input', (element: HTMLInputElement) => element.select());
			await input.type('10112026100000');
			await input.press('Tab');
			await page.waitForChanges();
			expect(await input.getProperty('value')).toBe('10-11-2026 10:00:00');
			expect((await page.find('#single-date-input')).getAttribute('state')).not.toBe('invalid');
			expect(spyDatesChange).toHaveReceivedEventDetail({ range: ['2026-11-10 10:00:00'] });
		});
	});

	describe('when user types a date in single mode', () => {
		let spyDatesChange: EventSpy;
		let spyValidityChange: EventSpy;
		let input: E2EElement;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-absolute-time-picker mode="single"></kv-absolute-time-picker>');

			const absoluteTimePickerElement = await page.find('kv-absolute-time-picker');
			spyDatesChange = await absoluteTimePickerElement.spyOnEvent('selectedDatesChange');
			spyValidityChange = await absoluteTimePickerElement.spyOnEvent('inputValidityChange');

			input = await page.find('#single-date-input input');
			await focusMaskedInput(page, input);
		});

		it('should report an incomplete date as invalid without emitting it', async () => {
			await input.type('1503');
			await page.waitForChanges();

			expect(spyValidityChange).toHaveReceivedEventDetail(false);
			expect(spyDatesChange).not.toHaveReceivedEvent();
		});

		it('should emit the date once it is complete', async () => {
			await input.type('15032024');
			await page.waitForChanges();

			expect(spyDatesChange).toHaveReceivedEventDetail({ range: ['2024-03-15 00:00:00'] });
			// Invalid while partially typed, valid once complete
			expect(spyValidityChange).toHaveReceivedEventDetail(true);
		});

		it('should emit the date again when it is retyped after being edited', async () => {
			await input.type('15032024');
			await page.waitForChanges();
			await input.press('Backspace');
			await page.waitForChanges();
			await input.type('4');
			await page.waitForChanges();

			expect(spyDatesChange).toHaveReceivedEventTimes(2);
			expect(spyValidityChange).toHaveReceivedEventDetail(true);
		});
	});
});
