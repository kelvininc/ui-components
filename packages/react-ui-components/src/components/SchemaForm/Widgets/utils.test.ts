import { getDefaultRegistry } from '@rjsf/core';
import { createSchemaUtils, Registry } from '@rjsf/utils';
import { describe, expect, it } from 'vitest';
import { CHOICE_VALUE_SHAPES, OPTION_SOURCES, VALUE_CASES } from '../test-utils/matrix';
import { getSelectedOptionIndex, resolveAllowClearInputs } from './utils';
import { getDefaultValidator } from '../../../utils';

const defaults = getDefaultRegistry();
const schemaUtils = createSchemaUtils(getDefaultValidator(), defaults.rootSchema);

describe('matching a selected JSON value', () => {
	it.each(VALUE_CASES)('keeps $name distinct from the other falsy values', ({ value, isUnset }) => {
		const values = [null, false, 0, ''];
		expect(getSelectedOptionIndex(values, value)).toBe(isUnset ? -1 : values.indexOf(value as never));
	});

	it.each(CHOICE_VALUE_SHAPES)('matches cloned values for $name', row => {
		row.values.forEach((value, index) => expect(getSelectedOptionIndex(row.values, structuredClone(value))).toBe(index));
	});

	it('prefers an exact type match over numeric string compatibility', () => {
		expect(getSelectedOptionIndex([1, '1'], '1')).toBe(1);
		expect(getSelectedOptionIndex(['1', 1], 1)).toBe(1);
	});

	it('keeps existing numeric string inputs compatible with a numeric enum', () => {
		expect(getSelectedOptionIndex([0, 3], '3')).toBe(1);
		expect(getSelectedOptionIndex(['0', '3'], 3)).toBe(1);
	});

	it('does not compare objects or arrays through their string representation', () => {
		expect(getSelectedOptionIndex([{ asset: 'north' }], { asset: 'south' })).toBe(-1);
		expect(getSelectedOptionIndex([['north']], 'north')).toBe(-1);
		expect(getSelectedOptionIndex([null], 'null')).toBe(-1);
	});
});

describe.each(OPTION_SOURCES)('allowClearInputs from $name', source => {
	it.each([false, true])('preserves the explicit value %s', value => {
		const props = source.build('choice', { allowClearInputs: value });
		const registry = {
			...defaults,
			schemaUtils,
			globalUiOptions: props.uiSchema['ui:globalOptions'],
			formContext: props.formContext ?? {}
		} satisfies Registry;
		expect(resolveAllowClearInputs(props.uiSchema.choice, registry)).toBe(value);
	});
});

it('applies field, global and context clear policy in that order', () => {
	const globalPolicy = OPTION_SOURCES[1].build('choice', { allowClearInputs: false });
	const registry = { ...defaults, schemaUtils, globalUiOptions: globalPolicy.uiSchema['ui:globalOptions'], formContext: { allowClearInputs: true } } satisfies Registry;
	expect(resolveAllowClearInputs({ 'ui:options': { allowClearInputs: true } }, registry)).toBe(true);
	expect(resolveAllowClearInputs({}, registry)).toBe(false);
	expect(resolveAllowClearInputs({}, { ...registry, globalUiOptions: {} })).toBe(true);
	expect(resolveAllowClearInputs({}, { ...registry, globalUiOptions: {}, formContext: {} })).toBeUndefined();
});
