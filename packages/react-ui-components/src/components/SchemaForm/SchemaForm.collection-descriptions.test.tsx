// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KvSchemaForm } from './SchemaForm';
import { propsOf } from '../../test-utils';
import { ARRAY_WIDGET_DISPATCH_SHAPES, COLLECTION_DESCRIPTION_SHAPES } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);
let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
beforeEach(() => {
	container = document.createElement('div');
	document.body.append(container);
	root = createRoot(container);
});
afterEach(async () => {
	await act(async () => root.unmount());
	container.remove();
});

it.each(ARRAY_WIDGET_DISPATCH_SHAPES)('places guidance for the actual dispatch: $name', async row => {
	await act(async () => root.render(<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={[]} />));
	const description = container.querySelector('[id$="-description"]')!;
	const content = container.querySelector(row.contentSelector)!;
	expect(description).not.toBeNull();
	expect(content).not.toBeNull();
	expect(Boolean(description.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(row.collection);
});

describe.each(COLLECTION_DESCRIPTION_SHAPES)('description placement: $name', row => {
	it('honors placement and keeps collection guidance visible with errors', async () => {
		for (const invalid of [false, true]) {
			await act(async () =>
				root.render(
					<KvSchemaForm<unknown>
						schema={row.schema}
						uiSchema={row.uiSchema}
						formData={row.formData}
						widgets={row.widgets}
						displayErrors
						showErrorList={false}
						extraErrors={invalid ? { __errors: ['Review this connector setting.'] } : undefined}
					/>
				)
			);
			const description = container.querySelector('[id$="-description"]');
			if (row.position === 'none' || (invalid && !row.collection)) {
				expect(description).toBeNull();
			} else {
				expect(description).not.toBeNull();
				expect(description!.querySelector('kv-form-help-text')?.getAttribute('data-help-text')).toBe(row.schema.description);
				const content = container.querySelector(row.contentSelector);
				expect(content).not.toBeNull();
				expect(Boolean(description!.compareDocumentPosition(content!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(row.position === 'top');
			}
			const error = container.querySelector('[id$="-errors"] kv-form-help-text');
			if (invalid) expect(propsOf<{ helpText: string[] }>(error!).helpText).toEqual(['Review this connector setting.']);
			else expect(error).toBeNull();
		}
	});

	it('places collection defaults before entries, with or without a description', async () => {
		for (const description of [row.schema.description, undefined]) {
			await act(async () =>
				root.render(
					<KvSchemaForm<unknown>
						schema={{ ...row.schema, description, default: row.formData as typeof row.schema.default }}
						uiSchema={{ ...row.uiSchema, 'ui:showDefaultValueHelper': true }}
						formData={row.formData}
						widgets={row.widgets}
					/>
				)
			);
			if (row.formData === undefined) {
				expect(
					Array.from(container.querySelectorAll('kv-form-help-text')).filter(host => host.getAttribute('data-help-text')?.startsWith('Default value is:'))
				).toHaveLength(0);
				continue;
			}
			const helpers = Array.from(container.querySelectorAll('kv-form-help-text')).filter(host => host.getAttribute('data-help-text') === `Default value is: ${row.formData}`);
			expect(helpers).toHaveLength(1);
			const content = container.querySelector(row.contentSelector)!;
			expect(content).not.toBeNull();
			expect(Boolean(helpers[0].compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(row.collection);
		}
	});
});
