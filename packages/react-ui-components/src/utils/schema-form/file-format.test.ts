import standardValidator from '@rjsf/validator-ajv8';
import { RJSFSchema } from '@rjsf/utils';
import { describe, expect, it } from 'vitest';
import { R6_FILE_REFERENCE_SHAPES, R6_FILE_VALUES } from '../../components/SchemaForm/test-utils/matrix';
import { DEFAULT_VALIDATOR } from './config';

const fileSchema: RJSFSchema = { type: 'string', format: 'data-url' };

describe.each(R6_FILE_REFERENCE_SHAPES)('file reference: $name', row => {
	it('accepts only a complete secret reference', () => {
		expect(DEFAULT_VALIDATOR.isValid(fileSchema, row.value, fileSchema)).toBe(row.valid);
		expect(standardValidator.isValid(fileSchema, row.value, fileSchema)).toBe(false);
	});
});

describe.each(R6_FILE_VALUES.filter(row => row.name !== 'secret reference'))('existing file format: $name', row => {
	it('preserves the standard RJSF data URL validation', () => {
		for (const value of row.values) {
			expect(DEFAULT_VALIDATOR.isValid(fileSchema, value, fileSchema)).toBe(standardValidator.isValid(fileSchema, value, fileSchema));
		}
	});
});

it('keeps the string type and other format constraints', () => {
	for (const value of [null, 7, {}, ['<% secrets.ca %>']]) expect(DEFAULT_VALIDATOR.isValid(fileSchema, value, fileSchema)).toBe(false);
	const emailSchema: RJSFSchema = { type: 'string', format: 'email' };
	expect(DEFAULT_VALIDATOR.isValid(emailSchema, 'operator@kelvininc.com', emailSchema)).toBe(true);
	expect(DEFAULT_VALIDATOR.isValid(emailSchema, '<% secrets.ca %>', emailSchema)).toBe(false);
});
