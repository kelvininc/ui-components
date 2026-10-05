// @vitest-environment jsdom

import React, { act } from 'react';
import { createRequire } from 'node:module';
import Form from '@rjsf/core';
import { FieldProps, RJSFSchema } from '@rjsf/utils';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { getDefaultValidator, normalizeSchema } from '../../../utils';
import { fireStencilEvent } from '../../../test-utils';
import { KvSchemaForm } from '../SchemaForm';
import { BOOLEAN_PROPERTY_VALUES, OBJECT_SHAPES } from '../test-utils/matrix';

vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);

const original = OBJECT_SHAPES.find(row => row.name === 'boolean property schemas')!.schema;
describe.each(BOOLEAN_PROPERTY_VALUES)('boolean properties: $name', row => {
	it('preserves validation semantics without crashing RJSF path traversal', async () => {
		const validator = getDefaultValidator();
		const normalized = normalizeSchema(original).schema;
		expect(validator.isValid(original, row.data, original)).toBe(row.valid);
		expect(validator.isValid(normalized, row.data, normalized)).toBe(row.valid);
		const container = document.createElement('div');
		const root = createRoot(container);
		const onChange = vi.fn();
		try {
			await act(async () => root.render(<KvSchemaForm schema={original} formData={row.data} onChange={onChange} omitExtraData={false} liveValidate />));
			await act(async () => {
				fireStencilEvent('root_host', 'onTextChange', 'broker-2.local');
			});
			const expected = { ...row.data, host: 'broker-2.local' };
			expect(onChange.mock.lastCall?.[0].formData).toEqual(expected);
			expect(onChange.mock.lastCall?.[0].errors.length === 0).toBe(row.valid);
		} finally {
			await act(async () => root.unmount());
		}
	});
});

it('keeps additionalProperties flags and boolean values in data keywords literal', () => {
	const schema = { ...original, additionalProperties: false, default: { properties: { legacy: true, removed: false } }, examples: [{ properties: { enabled: false } }] };
	const normalized = normalizeSchema(schema).schema;
	expect(normalized.properties?.legacy).toEqual({});
	expect(normalized.properties?.removed).toEqual({ not: {} });
	expect(normalized.additionalProperties).toBe(false);
	expect(normalized.default).toBe(schema.default);
	expect(normalized.examples).toBe(schema.examples);
});

const CommonJsForm = createRequire(import.meta.url)('@rjsf/core').default as typeof Form;
describe.each([
	{ name: 'import', FormComponent: Form },
	{ name: 'require', FormComponent: CommonJsForm }
])('boolean path contract through $name', ({ FormComponent }) => {
	it('matches explicit untyped object schemas when live omission is enabled', async () => {
		const data = BOOLEAN_PROPERTY_VALUES.find(row => row.name === 'object')!.data;
		const normalized = normalizeSchema(original).schema;
		const explicit: RJSFSchema = { ...original, properties: { host: { type: 'string' }, legacy: {}, removed: { not: {} } } };
		const observed: unknown[] = [];
		for (const schema of [normalized, explicit]) {
			const container = document.createElement('div');
			const root = createRoot(container);
			let changeHost: FieldProps['onChange'];
			const StringField = (props: FieldProps): null => {
				changeHost = props.onChange;
				return null;
			};
			try {
				await act(async () =>
					root.render(
						<FormComponent
							schema={schema}
							formData={data}
							fields={{ StringField }}
							validator={getDefaultValidator()}
							omitExtraData
							liveOmit
							onChange={event => observed.push(event.formData)}
						/>
					)
				);
				await act(async () => changeHost('broker-2.local'));
			} finally {
				await act(async () => root.unmount());
			}
		}
		expect(observed).toEqual([{ host: 'broker-2.local' }, { host: 'broker-2.local' }]);
	});
});
