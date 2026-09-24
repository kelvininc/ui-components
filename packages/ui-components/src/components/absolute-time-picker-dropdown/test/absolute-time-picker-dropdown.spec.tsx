import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePickerDropdown } from '../absolute-time-picker-dropdown';
import { h } from '@stencil/core';

describe('Absolute Time Picker Dropdown (unit tests)', () => {
	let page: SpecPage;

	describe('when default props and initial date are used', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdown],
				template: () => <kv-absolute-time-picker-dropdown initialDate="2023-03-03" />
			});
		});

		it('should match the snapshot', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when a selectedDate is provided', () => {
		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdown],
				template: () => <kv-absolute-time-picker-dropdown selectedDates={[1681319856833]} />
			});
		});

		it('should match the snapshot, the initial date on the calendar should be inherited from the selected date ("2023-04-12")', () => {
			expect(page.root).toMatchSnapshot();
		});
	});

	describe('when a date is typed in the calendar', () => {
		let component: KvAbsoluteTimePickerDropdown;

		const isApplyDisabled = () => page.root.querySelector('kv-action-button-text[text="Apply"]').hasAttribute('disabled');
		const setInputValidity = async (isValid: boolean) => {
			page.root.querySelector('kv-absolute-time-picker').dispatchEvent(new CustomEvent<boolean>('inputValidityChange', { detail: isValid }));
			await page.waitForChanges();
		};

		beforeEach(async () => {
			page = await newSpecPage({
				components: [KvAbsoluteTimePickerDropdown],
				template: () => <kv-absolute-time-picker-dropdown selectedDates={[1681319856833]} />
			});
			component = page.rootInstance;
			component.selectedDateState = [1681406272018];
			await page.waitForChanges();
		});

		it('should enable apply for a changed date', () => {
			expect(isApplyDisabled()).toBe(false);
		});

		it('should disable apply while the typed date is incomplete or invalid', async () => {
			await setInputValidity(false);
			expect(isApplyDisabled()).toBe(true);

			await setInputValidity(true);
			expect(isApplyDisabled()).toBe(false);
		});

		it('should remount the calendar to discard the typed date on cancel', async () => {
			await setInputValidity(false);
			const calendar = page.root.querySelector('kv-absolute-time-picker');

			component['onClickCancel'](new CustomEvent('clickButton'));
			await page.waitForChanges();

			expect(component.hasInvalidDateInput).toBe(false);
			expect(page.root.querySelector('kv-absolute-time-picker')).not.toBe(calendar);
		});

		it('should disable apply for a date before the calendar minimum', async () => {
			component.selectedDateState = [Date.UTC(2017, 0, 1)];
			await page.waitForChanges();

			expect(isApplyDisabled()).toBe(true);
		});
	});
});
