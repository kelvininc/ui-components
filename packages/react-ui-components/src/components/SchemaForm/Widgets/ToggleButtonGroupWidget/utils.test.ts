import { describe, it, expect } from 'vitest';
import { buildSelectedToggleButtons, buildToggleButtons, toggleSelectedOptions } from './utils';
import { ALL_BUTTON_VALUE } from './config';
import { getOptionKey } from '../utils';
import { ToggleButtonGroupOption, IToggleButtonGroupConfig } from './types';

const baseConfig: IToggleButtonGroupConfig = {
	multiple: false,
	allButton: false,
	minItems: 0,
	maxItems: Number.MAX_SAFE_INTEGER
};

it('preserves numeric option values, including zero, through selection', () => {
	const options = [
		{ label: 'No retries', value: 0 },
		{ label: 'Three retries', value: 3 }
	];
	expect(buildToggleButtons(options, [], baseConfig).map(button => button.value)).toEqual(['choice-0', 'choice-1']);
	expect(buildSelectedToggleButtons([0], options, baseConfig)).toEqual({ 'choice-0': true });
	expect(toggleSelectedOptions('choice-1', [0], options, { ...baseConfig, multiple: true, maxItems: 2 })).toEqual([0, 3]);
	expect(toggleSelectedOptions('choice-0', [0], options, baseConfig)).toEqual([]);
});

describe('choices that share a string form', () => {
	const options = [
		{ label: 'Zero', value: 0 },
		{ label: 'Zero as text', value: '0' }
	];
	const multiple = { ...baseConfig, multiple: true, maxItems: 2 };

	it('selects only the choice whose value matches exactly', () => {
		expect(buildSelectedToggleButtons([0], options, multiple)).toEqual({ 'choice-0': true });
		expect(buildSelectedToggleButtons(['0'], options, multiple)).toEqual({ 'choice-1': true });
	});

	it('toggles each choice by its own value', () => {
		expect(toggleSelectedOptions('choice-1', [0], options, multiple)).toEqual([0, '0']);
		expect(toggleSelectedOptions('choice-0', [0, '0'], options, multiple)).toEqual(['0']);
	});

	it("keeps an option whose value is 'all' apart from the All button", () => {
		const withAll = [{ label: 'All lines', value: ALL_BUTTON_VALUE }, ...options];
		const config = { ...multiple, allButton: true, maxItems: 3 };
		expect(toggleSelectedOptions('choice-0', [0], withAll, config)).toEqual([0, ALL_BUTTON_VALUE]);
		expect(toggleSelectedOptions(ALL_BUTTON_VALUE, [0], withAll, config)).toEqual([ALL_BUTTON_VALUE, 0, '0']);
	});

	it('ignores a key that names no button', () => {
		expect(toggleSelectedOptions('choice-9', [0], options, multiple)).toEqual([0]);
	});
});

describe('buildToggleButtons', () => {
	describe('when options is empty', () => {
		it('should return an empty array when allButton is disabled', () => {
			expect(buildToggleButtons<ToggleButtonGroupOption>([], [], baseConfig)).toEqual([]);
		});

		it('should return only the All button when multiple and allButton are enabled', () => {
			const result = buildToggleButtons<ToggleButtonGroupOption>([], [], { ...baseConfig, multiple: true, allButton: true });

			expect(result).toEqual([{ label: 'All', value: ALL_BUTTON_VALUE }]);
		});
	});

	describe('when options has enabled items', () => {
		it('should return one button per option in input order with truthy disabled equal to false-or-undefined', () => {
			const options: ToggleButtonGroupOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			];

			const result = buildToggleButtons(options, [], baseConfig);

			expect(result.map(button => ({ label: button.label, value: button.value }))).toEqual([
				{ label: 'Option A', value: 'choice-0' },
				{ label: 'Option B', value: 'choice-1' },
				{ label: 'Option C', value: 'choice-2' }
			]);
			expect(result.every(button => !button.disabled)).toBe(true);
		});
	});

	describe('when some options are listed in enumDisabled', () => {
		it('should mark only those options as disabled', () => {
			const options: ToggleButtonGroupOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			];

			const result = buildToggleButtons(options, ['b'], baseConfig);

			expect(result.map(button => button.label)).toEqual(['Option A', 'Option B', 'Option C']);
			expect(result[1].disabled).toBe(true);
			expect(result[0].disabled).toBeFalsy();
			expect(result[2].disabled).toBeFalsy();
		});
	});

	describe('when readonly is true', () => {
		it('should mark every button as disabled', () => {
			const options: ToggleButtonGroupOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' }
			];

			const result = buildToggleButtons(options, [], { ...baseConfig, readonly: true });

			expect(result.every(button => button.disabled === true)).toBe(true);
		});
	});

	describe('when multiple and allButton are enabled with options', () => {
		it('should put the All button first, followed by per-option buttons in input order', () => {
			const options: ToggleButtonGroupOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' }
			];

			const result = buildToggleButtons(options, [], { ...baseConfig, multiple: true, allButton: true });

			expect(result.map(button => button.value)).toEqual([ALL_BUTTON_VALUE, 'choice-0', 'choice-1', 'choice-2']);
			expect(result[0]).toEqual({ label: 'All', value: ALL_BUTTON_VALUE });
		});
	});

	describe('when allButton is enabled but multiple is false', () => {
		it('should not include the All button', () => {
			const options: ToggleButtonGroupOption[] = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' }
			];

			const result = buildToggleButtons(options, [], { ...baseConfig, multiple: false, allButton: true });

			expect(result.map(button => button.value)).toEqual(['choice-0', 'choice-1']);
		});
	});

	describe('when there are many options', () => {
		it('should preserve input order across all of them', () => {
			const options: ToggleButtonGroupOption[] = Array.from({ length: 25 }, (_, i) => ({ label: `L${i}`, value: `v${i}` }));

			const result = buildToggleButtons(options, [], baseConfig);

			expect(result.map(button => button.value)).toEqual(options.map((_, index) => getOptionKey(index)));
		});
	});
});
