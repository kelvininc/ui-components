import { JSONSchema7 } from 'json-schema';
import { describe, expect, it } from 'vitest';
import { buildDropdownOptions, buildSelectedOptions, getSelectedOptions, processValue, resolveDropdownConfig } from './utils';
import { DEFAULT_DROPDOWN_CONFIG, IDropdownConfig } from './config';
import { buildHelperOptions } from '../../Templates/FieldTemplate/utils';

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

describe('resolveDropdownConfig', () => {
	// `const { dropdownConfig = DEFAULT_DROPDOWN_CONFIG } = formContext` only falls
	// back when the whole config is `undefined`, so any partial config replaced the
	// defaults wholesale and left `zIndex` undefined. `kv-portal` then wrote the
	// literal string "undefined" to `style.zIndex`, which the browser discards, and
	// the dropdown stayed stuck behind the page at the `-1` it was created with.
	describe('when no config is provided', () => {
		it('should return every default', () => {
			expect(resolveDropdownConfig(undefined)).toEqual(DEFAULT_DROPDOWN_CONFIG);
		});

		it('should return every default for an empty config', () => {
			expect(resolveDropdownConfig({})).toEqual(DEFAULT_DROPDOWN_CONFIG);
		});
	});

	describe('when a partial config is provided', () => {
		it('should keep the default z-index', () => {
			expect(resolveDropdownConfig({ minWidth: '240px' }).zIndex).toBe(DEFAULT_DROPDOWN_CONFIG.zIndex);
		});

		it('should retain all the other defaults', () => {
			expect(resolveDropdownConfig({ minWidth: '240px' })).toEqual({
				...DEFAULT_DROPDOWN_CONFIG,
				minWidth: '240px'
			});
		});

		it('should apply the provided override', () => {
			expect(resolveDropdownConfig({ minWidth: '240px' }).minWidth).toBe('240px');
		});

		it.each<[keyof IDropdownConfig, string]>([
			['maxHeight', '400px'],
			['minHeight', 'auto'],
			['maxWidth', 'auto'],
			['minWidth', 'max-content']
		])('should keep the default %s when only zIndex is overridden', (key, value) => {
			expect(resolveDropdownConfig({ zIndex: 10 })[key]).toBe(value);
		});
	});

	describe('when a config explicitly holds undefined values', () => {
		it('should not let an undefined override erase a default', () => {
			expect(resolveDropdownConfig({ zIndex: undefined, minWidth: '240px' }).zIndex).toBe(DEFAULT_DROPDOWN_CONFIG.zIndex);
		});
	});

	describe('when the config is fully specified', () => {
		it('should use every provided value', () => {
			const config = { zIndex: 10, maxHeight: '10px', minHeight: '1px', maxWidth: '20px', minWidth: '2px' };

			expect(resolveDropdownConfig(config)).toEqual(config);
		});
	});

	describe('when it does not mutate its inputs', () => {
		it('should leave the defaults untouched', () => {
			resolveDropdownConfig({ zIndex: 10 });

			expect(DEFAULT_DROPDOWN_CONFIG.zIndex).toBe(9004);
		});

		it('should leave the provided config untouched', () => {
			const config = { minWidth: '240px' };

			resolveDropdownConfig(config);

			expect(config).toEqual({ minWidth: '240px' });
		});
	});

	// The reported failure: one field carries `ui:dropdownConfig: { minWidth: '240px' }`
	// and a *different* field is a select. FieldTemplate leaked the first field's
	// options into the shared form context, and the select then resolved its config
	// from that polluted context.
	describe('when another field in the same form carries a partial ui:dropdownConfig', () => {
		it('should still resolve a usable z-index for the select', () => {
			const formContext: { dropdownConfig?: Record<string, unknown> } = { componentSize: 'large' } as never;

			buildHelperOptions(formContext, { dropdownConfig: { minWidth: '240px' } });

			expect(resolveDropdownConfig(formContext.dropdownConfig).zIndex).toBe(DEFAULT_DROPDOWN_CONFIG.zIndex);
		});
	});
});
