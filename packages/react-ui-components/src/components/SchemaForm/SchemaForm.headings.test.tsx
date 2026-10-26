// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { KvSchemaForm } from './SchemaForm';
import { ARRAY_DESCRIPTION_SHAPES, CUSTOM_FIELDS, DESCRIBED_CONNECTION_ARRAY, OPTION_BRANCH_SHAPES, SECTION_HEADING_SHAPES } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

describe.each(SECTION_HEADING_SHAPES)('section markup: $name', row => {
	it('renders the resolved heading depth and preserves hidden children', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		try {
			await act(async () => root.render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} fields={CUSTOM_FIELDS} />));
			expect(Array.from(container.querySelectorAll('h2,h3,h4,h5,h6')).map(heading => ({ title: heading.textContent, level: Number(heading.tagName.slice(1)) }))).toEqual(
				row.headings
			);
			if (row.name.startsWith('hidden')) {
				expect(container.querySelector('[hidden]')).not.toBeNull();
				expect(container.querySelector('kv-form-help-text')).toBeNull();
				if (row.name.includes('custom')) expect(container.querySelector('[data-custom-field]')).not.toBeNull();
			}
		} finally {
			await act(async () => root.unmount());
		}
	});
});

describe.each(ARRAY_DESCRIPTION_SHAPES)('array description: $name', row => {
	it('gives default and overridden descriptions one owner', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		try {
			await act(async () => root.render(<KvSchemaForm schema={row.schema ?? DESCRIBED_CONNECTION_ARRAY} uiSchema={row.uiSchema} formData={[]} />));
			const texts = Array.from(container.querySelectorAll('[data-help-text],[data-description],p')).map(
				element => element.getAttribute('data-help-text') ?? element.getAttribute('data-description') ?? element.textContent
			);
			expect(texts.filter(text => text === row.description)).toHaveLength(row.description ? 1 : 0);
			expect(texts).not.toContain(row.description === 'Configure connection endpoints.' ? 'Custom connections description.' : 'Configure connection endpoints.');
		} finally {
			await act(async () => root.unmount());
		}
	});
});

it('keeps ids distinct between same-prefix forms and stable during hydration', async () => {
	const row = SECTION_HEADING_SHAPES[0];
	const forms = (
		<>
			<KvSchemaForm schema={row.schema} />
			<KvSchemaForm schema={row.schema} />
		</>
	);
	const container = document.createElement('div');
	container.innerHTML = renderToString(forms);
	const headingIds = Array.from(container.querySelectorAll('h2')).map(element => element.id);
	expect(new Set(headingIds).size).toBe(2);
	const references = Array.from(container.querySelectorAll('[aria-labelledby],[aria-describedby]')).flatMap(element =>
		[element.getAttribute('aria-labelledby'), element.getAttribute('aria-describedby')].filter(Boolean).flatMap(value => value!.split(' '))
	);
	for (const id of references) expect(Array.from(container.querySelectorAll('[id]')).filter(element => element.id === id)).toHaveLength(1);
	let root: ReturnType<typeof hydrateRoot>;
	await act(async () => {
		root = hydrateRoot(container, forms);
	});
	try {
		expect(Array.from(container.querySelectorAll('h2')).map(element => element.id)).toEqual(headingIds);
	} finally {
		await act(async () => root.unmount());
	}
});

describe.each(OPTION_BRANCH_SHAPES)('$name branch ids', row => {
	it('keeps every mounted title reference unique when RJSF reuses field ids', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		try {
			for (const formData of row.values) {
				await act(async () => root.render(<KvSchemaForm schema={row.schema} formData={formData} />));
				const titles = Array.from(container.querySelectorAll('[id$="-title"]')).map(element => element.id);
				expect(titles.length).toBeGreaterThan(1);
				expect(new Set(titles).size).toBe(titles.length);
				for (const group of container.querySelectorAll('[aria-labelledby]'))
					expect(Array.from(container.querySelectorAll('[id]')).filter(element => element.id === group.getAttribute('aria-labelledby'))).toHaveLength(1);
			}
		} finally {
			await act(async () => root.unmount());
		}
	});
});
