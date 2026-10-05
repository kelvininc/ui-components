import { RJSFSchema } from '@rjsf/utils';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import {
	ARRAY_SHAPES,
	ACTION_NAME_SHAPES,
	BROKER_FORM_DATA,
	BROKER_SCHEMA,
	CHOICE_SCHEMAS,
	FLAT_OBJECT_SHAPES,
	MULTI_SELECT_SHAPES,
	OBJECT_SHAPES,
	OPTION_SOURCES,
	TEMPLATE_COMPONENTS,
	TOGGLE_BUTTON_GROUP_SHAPES
} from './matrix';

const validator = getDefaultValidator();
const errorsFor = (formData: unknown, schema: RJSFSchema) => validator.validateFormData(formData, schema).errors;

// Every fixture must be valid on its own, so a failing test points at the code under test
describe.each([...ARRAY_SHAPES, ...OBJECT_SHAPES, ...FLAT_OBJECT_SHAPES, ...MULTI_SELECT_SHAPES, ...TOGGLE_BUTTON_GROUP_SHAPES, ...ACTION_NAME_SHAPES])(
	'the $name fixture',
	({ schema, formData }) => {
		it('has sample data that passes its schema', () => {
			expect(errorsFor(formData, schema)).toEqual([]);
		});
	}
);

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

describe('the fixtures', () => {
	const arrayShape = (name: string) => ARRAY_SHAPES.find(row => row.name === name)!;

	it("are frozen, including the schemas rows share, so a test can't change them for the next", () => {
		expect(Object.isFrozen(arrayShape('string list').schema)).toBe(true);
		// Shares its items schema with the string list
		expect(() => Object.assign(arrayShape('one below maxItems').schema.items as object, { title: 'Channel' })).toThrow(TypeError);
		expect(Object.isFrozen(TEMPLATE_COMPONENTS[0])).toBe(true);
		expect(Object.isFrozen(OPTION_SOURCES)).toBe(true);
	});

	it('leave the components they hold as they are', () => {
		expect(Object.isFrozen(TEMPLATE_COMPONENTS.find(row => row.name === 'React.memo')!.FieldLayout)).toBe(false);
	});
});
