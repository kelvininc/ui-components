// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../../test-utils';
import { KvSchemaForm } from '../SchemaForm';
import { MULTI_SELECT_SHAPES, OBJECT_SHAPES } from '../test-utils/matrix';

vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	container = document.createElement('div');
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
});

describe.each(OBJECT_SHAPES.filter(row => row.name.startsWith('additionalProperties')))('RJSF upgrade regression: $name', row => {
	it.each([{}, row.formData])('renders externally loaded and replaced properties from %j', async initial => {
		await act(async () => root.render(<KvSchemaForm schema={row.schema} formData={initial} />));
		await act(async () => root.render(<KvSchemaForm schema={row.schema} formData={{ site: 'lisbon', plant: 'north' }} />));
		expect(propsOf('root_site').value).toBe('lisbon');
		expect(propsOf('root_plant').value).toBe('north');

		await act(async () => root.render(<KvSchemaForm schema={row.schema} formData={{ plant: 'south' }} />));
		expect(container.querySelector('kv-text-field#root_site')).toBeNull();
		expect(propsOf('root_plant').value).toBe('south');
	});
});

describe.each(MULTI_SELECT_SHAPES)('RJSF upgrade regression: $name', row => {
	it('preserves multi-select labels and selected values', async () => {
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />));
		const dropdown = container.querySelector('kv-multi-select-dropdown')!;
		const options = propsOf(dropdown).options as Record<string, { label: string; value: string }>;
		expect(Object.values(options).map(option => option.label)).toEqual(row.labels);

		await act(async () => {
			fireStencilEvent(dropdown, 'onOptionsSelected', { 'south-line': true });
		});
		expect(onChange.mock.lastCall?.[0].formData).toEqual(['south-line']);
	});
});

describe.each(OBJECT_SHAPES.filter(row => row.name === 'nested optional fields in additional property'))('RJSF upgrade regression: $name', row => {
	it('clears an optional nested integer without changing its type', async () => {
		const onChange = vi.fn();
		await act(async () => root.render(<KvSchemaForm {...row} liveValidate onChange={onChange} />));

		await act(async () => {
			fireStencilEvent('root_plant_retries', 'onTextChange', '');
		});

		expect(onChange.mock.lastCall?.[0].formData).toEqual({ plant: { site: 'lisbon', retries: undefined } });
		expect(onChange.mock.lastCall?.[0].errors).toEqual([]);
	});
});
