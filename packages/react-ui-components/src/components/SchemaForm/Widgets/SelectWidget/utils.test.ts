import { JSONSchema7 } from 'json-schema';
import { describe, expect, it } from 'vitest';
import { buildDropdownOptions, buildSelectedOptions, getSelectedOptions, processValue } from './utils';

describe('buildSelectedOptions', () => {
	describe('when given an array of selected values', () => {
		it('should map every value to true', () => {
			expect(buildSelectedOptions(['a', 'b'])).toEqual({ a: true, b: true });
		});

		it('should return an empty map for an empty array', () => {
			expect(buildSelectedOptions([])).toEqual({});
		});

		it('should collapse duplicates onto one key', () => {
			expect(buildSelectedOptions(['a', 'a'])).toEqual({ a: true });
		});
	});

	// A multiple select receives whatever the host form holds for the field, so the
	// value is not guaranteed to match a `type: 'array'` schema. Every one of these
	// used to throw `TypeError: … .reduce is not a function` and take the form down.
	describe('when the value is not an array', () => {
		it.each([
			['undefined', undefined],
			['null', null],
			['a string', 'a'],
			['a number', 4],
			['a boolean', true],
			['an object', { a: true }]
		])('should select nothing for %s', (_, value) => {
			expect(buildSelectedOptions(value as unknown as string[])).toEqual({});
		});
	});

	it('should round-trip through getSelectedOptions', () => {
		expect(getSelectedOptions(buildSelectedOptions(['a', 'b']))).toEqual(['a', 'b']);
	});
});

describe('processValue', () => {
	const numberArraySchema: JSONSchema7 = { type: 'array', items: { type: 'number' } };

	describe('when the value is empty', () => {
		it.each([
			['an empty string', ''],
			['undefined', undefined],
			['null', null]
		])('should return undefined for %s', (_, value) => {
			expect(processValue({ type: 'string' }, value)).toBeUndefined();
		});
	});

	describe('when the schema is an array of numbers', () => {
		it('should coerce every item to a number', () => {
			expect(processValue(numberArraySchema, ['1', '2'])).toEqual([1, 2]);
		});

		it('should coerce an integer item type too', () => {
			expect(processValue({ type: 'array', items: { type: 'integer' } }, ['3'])).toEqual([3]);
		});

		// Used to throw `TypeError: … .map is not a function`.
		it.each([
			['a string', 'a'],
			['a number', 4],
			['an object', { a: 1 }]
		])('should return %s untouched rather than coercing it', (_, value) => {
			expect(processValue(numberArraySchema, value)).toBe(value);
		});
	});

	describe('when the schema is an array of strings', () => {
		it('should return the value untouched', () => {
			const value = ['a', 'b'];

			expect(processValue({ type: 'array', items: { type: 'string' } }, value)).toBe(value);
		});
	});

	describe('when the schema is a boolean', () => {
		it.each([
			['true', true],
			['the string "true"', 'true']
		])('should return true for %s', (_, value) => {
			expect(processValue({ type: 'boolean' }, value)).toBe(true);
		});

		it('should return false for the string "false"', () => {
			expect(processValue({ type: 'boolean' }, 'false')).toBe(false);
		});
	});

	describe('when the schema is numeric', () => {
		it('should coerce a numeric string', () => {
			expect(processValue({ type: 'number' }, '1.5')).toBe(1.5);
		});

		it('should coerce for an integer schema', () => {
			expect(processValue({ type: 'integer' }, '2')).toBe(2);
		});
	});

	describe('when the schema has no type but an enum', () => {
		it('should infer a number from an all-number enum', () => {
			expect(processValue({ enum: [1, 2] }, '2')).toBe(2);
		});

		it('should infer a boolean from an all-boolean enum', () => {
			expect(processValue({ enum: [true, false] }, 'true')).toBe(true);
		});

		it('should return the value untouched for a mixed enum', () => {
			expect(processValue({ enum: [1, 'a'] }, 'a')).toBe('a');
		});
	});
});

describe('buildDropdownOptions', () => {
	const schema: JSONSchema7 = { type: 'string' };

	it('should key each option by its value', () => {
		const options = [
			{ label: 'A', value: 'a' },
			{ label: 'B', value: 'b' }
		];

		expect(buildDropdownOptions({ schema, options })).toEqual({
			a: { value: 'a', label: 'A', description: undefined, disabled: false },
			b: { value: 'b', label: 'B', description: undefined, disabled: false }
		});
	});

	it('should mark only the options listed as disabled', () => {
		const options = [
			{ label: 'A', value: 'a' },
			{ label: 'B', value: 'b' }
		];

		const result = buildDropdownOptions({ schema, options, disabledOptions: ['b'] });

		expect(result.a.disabled).toBe(false);
		expect(result.b.disabled).toBe(true);
	});

	it('should prefer multiSubOptions when they are not empty', () => {
		const multiSubOptions = { a: { value: 'a', label: 'A' } };

		expect(buildDropdownOptions({ schema, options: [{ label: 'B', value: 'b' }], multiSubOptions })).toBe(multiSubOptions);
	});

	describe('when options is not an array', () => {
		it.each([
			['undefined', undefined],
			['null', null],
			['an object', { a: 1 }]
		])('should return no options for %s', (_, options) => {
			expect(buildDropdownOptions({ schema, options })).toEqual({});
		});
	});
});
