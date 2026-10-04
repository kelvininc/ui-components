import { RJSFSchema } from '@rjsf/utils';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { ARRAY_SHAPES, BROKER_FORM_DATA, BROKER_SCHEMA, CHOICE_SCHEMAS, FLAT_OBJECT_SHAPES, OBJECT_SHAPES } from './matrix';

const validator = getDefaultValidator();
const errorsFor = (formData: unknown, schema: RJSFSchema) => validator.validateFormData(formData, schema).errors;

// Every fixture must be valid on its own, so a failing test points at the code under test
describe.each([...ARRAY_SHAPES, ...OBJECT_SHAPES, ...FLAT_OBJECT_SHAPES])('the $name fixture', ({ schema, formData }) => {
	it('has sample data that passes its schema', () => {
		expect(errorsFor(formData, schema)).toEqual([]);
	});
});

describe.each(CHOICE_SCHEMAS)('the $name choice fixture', ({ schema, values }) => {
	it.each(values.map(value => ({ value })))('accepts $value', ({ value }) => {
		expect(errorsFor(value, schema)).toEqual([]);
	});
});

describe('the broker fixture that error shapes apply to', () => {
	it('has sample data that passes its schema', () => {
		expect(errorsFor(BROKER_FORM_DATA, BROKER_SCHEMA)).toEqual([]);
	});
});
