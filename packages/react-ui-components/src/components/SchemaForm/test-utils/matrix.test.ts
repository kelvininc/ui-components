import { RJSFSchema } from '@rjsf/utils';
import { get } from 'lodash';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { ARRAY_SHAPES, BROKER_FORM_DATA, BROKER_SCHEMA, CHOICE_SCHEMAS, ERROR_SHAPES, FLAT_OBJECT_SHAPES, OBJECT_SHAPES } from './matrix';

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

describe.each(ERROR_SHAPES.filter(({ messages }) => messages.length > 0))('the $name error shape', ({ messages }) => {
	// `root_brokers_1_host` is the field RJSF renders for BROKER_FORM_DATA.brokers[1].host
	it.each(messages)('expects its message under $id, a field the broker form renders', ({ id }) => {
		expect(get(BROKER_FORM_DATA, id.replace(/^root_/, '').split('_'))).toBeDefined();
	});
});

describe('the fixtures', () => {
	it("are frozen, including the schemas rows share, so a test can't change them for the next", () => {
		const [stringList, , , , oneBelowMaxItems] = ARRAY_SHAPES;

		expect(Object.isFrozen(stringList.schema)).toBe(true);
		expect(() => Object.assign(oneBelowMaxItems.schema.items as object, { title: 'Channel' })).toThrow(TypeError);
	});
});
