// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { KvSchemaForm } from './SchemaForm';
import { propsOf } from '../../test-utils';
import { COLLECTION_DESCRIPTION_SHAPES } from './test-utils/matrix';

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
});
