// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { KvSchemaForm } from './SchemaForm';
import { claimSectionBoundary, ROOT_SECTION_LAYOUT, SectionLayoutContext, sectionBodyLayout } from './contexts/SectionLayoutContext';
import { SECTION_LAYOUT_NESTED_OPTIONS, SECTION_LAYOUT_SHAPES } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

describe.each(SECTION_LAYOUT_SHAPES)('section layout ownership: $name', row => {
	it('owns each boundary once and retains named groups', async () => {
		const container = document.createElement('div');
		const root = createRoot(container);
		try {
			await act(async () => root.render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />));
			expect(
				Array.from(container.querySelectorAll('[data-schema-form-boundary]')).map(element => ({
					fieldId: element.getAttribute('data-schema-form-boundary-field'),
					kind: element.getAttribute('data-schema-form-boundary'),
					depth: Number(element.getAttribute('data-schema-form-boundary-depth'))
				}))
			).toEqual(row.boundaries);
			expect(
				Array.from(container.querySelectorAll('h2,h3,h4,h5,h6'))
					.filter(element => !element.closest('[hidden]'))
					.map(element => element.textContent)
			).toEqual(row.headings.map(heading => heading.title));
			for (const group of container.querySelectorAll('[aria-labelledby]')) {
				for (const id of group.getAttribute('aria-labelledby')!.split(' ')) expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
			}
			if (row.name === 'entries without menus') expect(container.querySelector('kv-action-menu')).toBeNull();
		} finally {
			await act(async () => root.unmount());
		}
	});
});

it.each(SECTION_LAYOUT_NESTED_OPTIONS)('counts every rendered guide in $name', row => {
	const container = document.createElement('div');
	container.innerHTML = renderToString(<KvSchemaForm schema={row.schema} formData={row.formData} />);
	expect(container.querySelectorAll('[data-schema-form-option-branch]')).toHaveLength(8);
	expect(
		Array.from(container.querySelectorAll('[data-schema-form-boundary]')).map(element => ({
			fieldId: element.getAttribute('data-schema-form-boundary-field'),
			kind: element.getAttribute('data-schema-form-boundary'),
			depth: Number(element.getAttribute('data-schema-form-boundary-depth'))
		}))
	).toEqual(row.boundaries);
});

it('reuses only the matching owner, clears it for children and leaves siblings independent', () => {
	const first = claimSectionBoundary(ROOT_SECTION_LAYOUT, 'root_0', 'item');
	expect(first.boundary).toEqual({ kind: 'item', depth: 1 });
	expect(first.state.itemLevel).toBe(1);
	const repeated = claimSectionBoundary(first.state, 'root_0', 'section');
	expect(repeated.state).toBe(first.state);
	expect(repeated.boundary).toBeNull();
	expect(claimSectionBoundary(first.state, 'root_0', 'item').boundary).toEqual({ kind: 'item', depth: 2 });
	const option = claimSectionBoundary(ROOT_SECTION_LAYOUT, 'root_auth', 'option');
	expect(claimSectionBoundary(option.state, 'root_auth', 'option').boundary).toEqual({ kind: 'option', depth: 2 });
	expect(claimSectionBoundary(option.state, 'root_auth', 'section').boundary).toBeNull();
	const child = sectionBodyLayout(first.state);
	expect(child.owner).toBeUndefined();
	expect(child.sectionLevel).toBe(1);
	expect(claimSectionBoundary(child, 'root_0_connection', 'section').boundary).toEqual({ kind: 'section', depth: 2 });
	expect(claimSectionBoundary(child, 'root_0_security', 'section').boundary).toEqual({ kind: 'section', depth: 2 });
	expect(ROOT_SECTION_LAYOUT).toEqual({ sectionLevel: 0, itemLevel: 0, boundaryDepth: 0 });
});

it('starts both same-prefix forms at zero and hydrates without changing ids or boundaries', async () => {
	const row = SECTION_LAYOUT_SHAPES.find(shape => shape.name === 'outer and inner object entries')!;
	const forms = (
		<>
			<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />
			<SectionLayoutContext.Provider value={{ sectionLevel: 8, itemLevel: 3, boundaryDepth: 8, owner: { fieldId: 'ambient', kind: 'section' } }}>
				<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />
			</SectionLayoutContext.Provider>
		</>
	);
	const container = document.createElement('div');
	container.innerHTML = renderToString(forms);
	const headingIds = Array.from(container.querySelectorAll('h2,h3,h4,h5,h6')).map(element => element.id);
	expect(new Set(headingIds).size).toBe(headingIds.length);
	const depths = Array.from(container.querySelectorAll('[data-schema-form-boundary-depth]')).map(element => element.getAttribute('data-schema-form-boundary-depth'));
	expect(depths).toEqual([...row.boundaries, ...row.boundaries].map(boundary => String(boundary.depth)));
	let root: ReturnType<typeof hydrateRoot>;
	await act(async () => {
		root = hydrateRoot(container, forms);
	});
	try {
		expect(Array.from(container.querySelectorAll('h2,h3,h4,h5,h6')).map(element => element.id)).toEqual(headingIds);
		expect(Array.from(container.querySelectorAll('[data-schema-form-boundary-depth]')).map(element => element.getAttribute('data-schema-form-boundary-depth'))).toEqual(depths);
	} finally {
		await act(async () => root.unmount());
	}
});

// The connection System tab: Privileged, an untitled health_check wrapper and Metrics. The wrapper opens no level,
// so its two checks are top-level blocks under page dividers, and only HTTP GET, under the Liveness heading, gets a rail.
it('lays out an untitled wrapper as top-level blocks and rails only what sits under a visible heading', async () => {
	const check = (title: string) => ({
		type: 'object' as const,
		title,
		properties: {
			type: { type: 'string' as const, title: 'Type' },
			http_get: { type: 'object' as const, title: 'HTTP GET', properties: { path: { type: 'string' as const, title: 'Path' } } }
		}
	});
	const container = document.createElement('div');
	const root = createRoot(container);
	try {
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={{
						type: 'object',
						properties: {
							privileged: { type: 'boolean', title: 'Privileged' },
							health_check: { type: 'object', properties: { liveness_probe: check('Liveness check'), readiness_probe: check('Readiness check') } },
							metrics: { type: 'object', title: 'Metrics', properties: { port: { type: 'integer', title: 'Port' } } }
						}
					}}
					uiSchema={{ health_check: { 'ui:title': '' } }}
					formData={{ privileged: false, health_check: { liveness_probe: { http_get: { path: '/health' } } } }}
				/>
			)
		);
		expect(Array.from(container.querySelectorAll('[data-schema-form-boundary]'), element => element.getAttribute('data-schema-form-boundary-field'))).toEqual([
			'root_health_check_liveness_probe_http_get',
			'root_health_check_readiness_probe_http_get'
		]);
		const heading = (title: string) => Array.from(container.querySelectorAll('h2,h3,h4,h5,h6')).find(element => element.textContent === title)!;
		// Both checks and Metrics are top-level headings in rows that draw page dividers; HTTP GET is nested under its check
		for (const title of ['Liveness check', 'Readiness check', 'Metrics']) {
			expect(heading(title).tagName).toBe('H2');
			expect(heading(title).closest('[data-schema-form-page-dividers]')).not.toBeNull();
		}
		expect(heading('HTTP GET').tagName).toBe('H3');
	} finally {
		await act(async () => root.unmount());
	}
});
