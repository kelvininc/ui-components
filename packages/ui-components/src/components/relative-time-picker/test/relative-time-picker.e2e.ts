import { E2EPage, EventSpy, newE2EPage } from '@stencil/core/testing';

describe('relative-time-picker', () => {
	let page: E2EPage;

	describe('when user clicks on the an relative date option', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-relative-time-picker selectedTimeKey="today" />');
			await page.waitForChanges();

			const relativeTimePickerSelectorElement = await page.find('kv-relative-time-picker');
			spyChangeEvent = await relativeTimePickerSelectorElement.spyOnEvent('selectedRelativeTimeChange');

			const dropdownElement = await page.find('kv-relative-time-picker >>> kv-time-picker-select-option');
			dropdownElement.triggerEvent('itemSelected', {
				detail: 'yesterday'
			});
			await page.waitForChanges();
		});

		it('should emit the a `selectedRelativeTimeChange` event with the select option key and its range', () => {
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});

	describe('when user selects a timezone', () => {
		let spyChangeEvent: EventSpy;

		beforeEach(async () => {
			page = await newE2EPage();
			await page.setContent('<kv-relative-time-picker inputWrapperContentVisible="true"></kv-relative-time-picker>');

			const relativeTimePickerSelectorElement = await page.find('kv-relative-time-picker');
			spyChangeEvent = await relativeTimePickerSelectorElement.spyOnEvent('timezoneChange');

			const dropdownElement = await page.find('kv-relative-time-picker >>> kv-single-select-dropdown');
			dropdownElement.triggerEvent('optionSelected', {
				detail: 'europe/lisbon'
			});

			await page.waitForChanges();
		});

		it('should emit the a `TimezoneChange` event', () => {
			expect(spyChangeEvent).toHaveReceivedEvent();
		});
	});
});
