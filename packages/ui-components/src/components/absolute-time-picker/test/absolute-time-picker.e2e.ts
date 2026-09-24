import { E2EElement, E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';
import { focusMaskedInput } from '../../date-time-input/test/date-time-input.utils';

describe('Absolute Time Picker (end to end)', () => {
	let page: E2EPage;

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
