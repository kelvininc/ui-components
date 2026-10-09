import { isSelect, optionsList, RJSFSchema } from '@rjsf/utils';
import { describe, expect, it } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { hasConstantOptions } from './constantOptions';

const validator = getDefaultValidator();

const SCHEMAS: readonly { name: string; schema: RJSFSchema }[] = [
	{ name: 'string enum', schema: { type: 'string', enum: ['debug', 'info'] } },
	{ name: 'numeric enum', schema: { type: 'number', enum: [1, 2] } },
	{ name: 'const oneOf', schema: { type: 'string', oneOf: [{ const: 'debug', title: 'Debug' }, { const: 'info' }] } },
	{ name: 'single-value enum anyOf', schema: { type: 'string', anyOf: [{ enum: ['debug'] }, { enum: ['info'] }] } },
	{ name: 'nullable union', schema: { anyOf: [{ type: 'string' }, { type: 'null' }] } },
	{ name: 'object oneOf', schema: { type: 'object', oneOf: [{ properties: { host: { type: 'string' } } }, { properties: { port: { type: 'number' } } }] } },
	{ name: 'number and string union', schema: { anyOf: [{ type: 'number' }, { type: 'string' }] } },
	{ name: 'mixed const and type', schema: { oneOf: [{ const: 'auto' }, { type: 'number' }] } },
	{ name: 'plain string', schema: { type: 'string' } }
];

describe('constant options contract with RJSF', () => {
	it.each(SCHEMAS)('matches isSelect for $name', ({ schema }) => {
		expect(hasConstantOptions(schema)).toBe(isSelect(validator, schema, {}));
	});

	it.each(SCHEMAS)('predicts whether optionsList can list $name', ({ schema }) => {
		if (hasConstantOptions(schema)) expect(() => optionsList(schema)).not.toThrow();
		else if (schema.anyOf ?? schema.oneOf) expect(() => optionsList(schema)).toThrow();
	});

	it('checks the anyOf branches optionsList reads, where isSelect reads oneOf', () => {
		const schema: RJSFSchema = { oneOf: [{ const: 'debug' }], anyOf: [{ type: 'string' }] };

		expect(isSelect(validator, schema, {})).toBe(true);
		expect(() => optionsList(schema)).toThrow();
		expect(hasConstantOptions(schema)).toBe(false);
	});
});
