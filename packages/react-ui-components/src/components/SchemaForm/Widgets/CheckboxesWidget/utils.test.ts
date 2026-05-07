import { describe, it, expect } from 'vitest';
import { buildToggleButtons } from './utils';
import { ALL_BUTTON_VALUE } from './config';
import { CheckboxOption, ICheckboxConfig } from './types';

const baseConfig: ICheckboxConfig = {
	multiple: false,
	allButton: false,
	minItems: 0,
	maxItems: Number.MAX_SAFE_INTEGER
};

describe('buildToggleButtons', () => {
	describe('when options is empty', () => {
		it('should return an empty array when allButton is disabled', () => {
			expect(buildToggleButtons<CheckboxOption>([], [], baseConfig)).toEqual([]);
		});

		it('should return only the All button when multiple and allButton are enabled', () => {
			const result = buildToggleButtons<CheckboxOption>([], [], { ...baseConfig, multiple: true, allButton: true });

			expect(result).toEqual([{ label: 'All', value: ALL_BUTTON_VALUE }]);
		});
	});

	describe('when options has enabled items', () => {
		it('should return one button per option in input order with truthy disabled equal to false-or-undefined', () => {
			const options: CheckboxOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			];

			const result = buildToggleButtons(options, [], baseConfig);

			expect(result.map(button => ({ label: button.label, value: button.value }))).toEqual([
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			]);
			expect(result.every(button => !button.disabled)).toBe(true);
		});
	});

	describe('when some options are listed in enumDisabled', () => {
		it('should mark only those options as disabled', () => {
			const options: CheckboxOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			];

			const result = buildToggleButtons(options, ['b'], baseConfig);

			expect(result.map(button => button.value)).toEqual(['a', 'b', 'c']);
			expect(result[1].disabled).toBe(true);
			expect(result[0].disabled).toBeFalsy();
			expect(result[2].disabled).toBeFalsy();
		});
	});

	describe('when readonly is true', () => {
		it('should mark every button as disabled', () => {
			const options: CheckboxOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' }
			];

			const result = buildToggleButtons(options, [], { ...baseConfig, readonly: true });

			expect(result.every(button => button.disabled === true)).toBe(true);
		});
	});

	describe('when multiple and allButton are enabled with options', () => {
		it('should put the All button first, followed by per-option buttons in input order', () => {
			const options: CheckboxOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			];

			const result = buildToggleButtons(options, [], { ...baseConfig, multiple: true, allButton: true });

			expect(result.map(button => button.value)).toEqual([ALL_BUTTON_VALUE, 'a', 'b', 'c']);
			expect(result[0]).toEqual({ label: 'All', value: ALL_BUTTON_VALUE });
		});
	});

	describe('when allButton is enabled but multiple is false', () => {
		it('should not include the All button', () => {
			const options: CheckboxOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' }
			];

			const result = buildToggleButtons(options, [], { ...baseConfig, multiple: false, allButton: true });

			expect(result.map(button => button.value)).toEqual(['a', 'b']);
		});
	});

	describe('when there are many options', () => {
		it('should preserve input order across all of them', () => {
			const options: CheckboxOption[] = Array.from({ length: 25 }, (_, i) => ({ label: `L${i}`, value: `v${i}` }));

			const result = buildToggleButtons(options, [], baseConfig);

			expect(result.map(button => button.value)).toEqual(options.map(o => o.value));
		});
	});
});
