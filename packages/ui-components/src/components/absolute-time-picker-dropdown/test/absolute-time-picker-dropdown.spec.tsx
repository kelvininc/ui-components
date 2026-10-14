import { SpecPage, newSpecPage } from '@stencil/core/testing';
import { KvAbsoluteTimePickerDropdown } from '../absolute-time-picker-dropdown';
import { getAbsoluteTimePickerError } from '../absolute-time-picker-dropdown.utils';
import { EAbsoluteTimeError, EAbsoluteTimePickerMode } from '../../../types';
import { h } from '@stencil/core';
import type { SelectedTimestamp } from '../../../types';

describe.each([EAbsoluteTimePickerMode.Single, EAbsoluteTimePickerMode.Range])('Absolute Time Picker Dropdown prop updates (%s)', mode => {
	let page: SpecPage;
	const appliedStart = Date.UTC(2026, 9, 13, 14, 58, 53);
	const appliedEnd = Date.UTC(2026, 9, 14, 14, 58, 53);
	const applied: SelectedTimestamp = mode === EAbsoluteTimePickerMode.Single ? [appliedStart] : [appliedStart, appliedEnd];
	const draft = mode === EAbsoluteTimePickerMode.Single ? ['2026-10-05 00:00:00'] : ['2026-10-05 00:00:00', '2026-10-12 23:59:59'];
	const draftTimestamps = mode === EAbsoluteTimePickerMode.Single ? [Date.UTC(2026, 9, 5)] : [Date.UTC(2026, 9, 5), Date.UTC(2026, 9, 12, 23, 59, 59)];
	const calendar = () => page.root.querySelector('kv-absolute-time-picker');
	const edit = async (range = draft) => {
		calendar().dispatchEvent(new CustomEvent('selectedDatesChange', { detail: { range } }));
		await page.waitForChanges();
	};

	beforeEach(async () => {
		page = await newSpecPage({
			components: [KvAbsoluteTimePickerDropdown],
			template: () => <kv-absolute-time-picker-dropdown mode={mode} selectedDates={applied} timezone={{ name: 'UTC', offset: 0 }} />
		});
	});

	it('should preserve the draft and apply it when an equivalent selection is supplied', async () => {
		const onChange = jest.fn();
		page.root.addEventListener('selectedDatesChange', onChange);
		await edit();
		page.root.selectedDates = [...applied];
		await page.waitForChanges();

		expect(calendar().selectedDates).toEqual(draft);
		expect(onChange).not.toHaveBeenCalled();
		const apply = page.root.querySelector('kv-action-button-text[text="Apply"]');
		expect(apply.hasAttribute('disabled')).toBe(false);
		apply.dispatchEvent(new CustomEvent('clickButton'));
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange.mock.calls[0][0].detail).toEqual(draftTimestamps);
	});

	it('should preserve a pending selection when another empty array is supplied', async () => {
		page.root.selectedDates = [];
		await page.waitForChanges();
		await edit([draft[0]]);
		const pending = calendar().selectedDates;
		page.root.selectedDates = [];
		await page.waitForChanges();

		expect(calendar().selectedDates).toEqual(pending);
	});

	it('should restore the applied selection when cancelling after an equivalent prop update', async () => {
		const initial = calendar().selectedDates;
		await edit();
		page.root.selectedDates = [...applied];
		await page.waitForChanges();
		page.root.querySelector('kv-action-button-text[text="Cancel"]').dispatchEvent(new CustomEvent('clickButton'));
		await page.waitForChanges();

		expect(calendar().selectedDates).toEqual(initial);
	});

	it('should synchronize genuine external changes and clears while editing', async () => {
		await edit();
		page.root.selectedDates = [Date.UTC(2026, 9, 7)];
		await page.waitForChanges();
		expect(calendar().selectedDates[0]).toBe('2026-10-07 00:00:00');

		page.root.selectedDates = [];
		await page.waitForChanges();
		expect(calendar().selectedDates).toEqual([]);
	});
});

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

describe('Absolute Time Picker Dropdown helpers', () => {
	describe('#getAbsoluteTimePickerError', () => {
		it('should enforce limits at the unix epoch', () => {
			expect(getAbsoluteTimePickerError([-1000], EAbsoluteTimePickerMode.Single, { minDate: 0 })).toEqual(EAbsoluteTimeError.StartDateBeforeMinimumDate);
			expect(getAbsoluteTimePickerError([1000], EAbsoluteTimePickerMode.Single, { maxDate: 0 })).toEqual(EAbsoluteTimeError.EndDateAfterMaximumDate);
			expect(getAbsoluteTimePickerError([-2000, -1000], EAbsoluteTimePickerMode.Range, { minDate: 0 })).toEqual(EAbsoluteTimeError.StartDateBeforeMinimumDate);
			expect(getAbsoluteTimePickerError([1000, 2000], EAbsoluteTimePickerMode.Range, { maxDate: 0 })).toEqual(EAbsoluteTimeError.EndDateAfterMaximumDate);
		});

		it('should not check a limit that is not set', () => {
			expect(getAbsoluteTimePickerError([-1000], EAbsoluteTimePickerMode.Single, {})).toBeUndefined();
		});
	});
});
