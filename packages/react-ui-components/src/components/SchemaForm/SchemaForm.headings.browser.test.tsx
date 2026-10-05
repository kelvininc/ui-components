import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	ADDITIONAL_NAME_SHAPES,
	ARRAY_DESCRIPTION_SHAPES,
	CUSTOM_FIELDS,
	DESCRIBED_CONNECTION_ARRAY,
	SECTION_DESCRIPTION_SHAPES,
	SECTION_HEADING_SHAPES
} from './test-utils/matrix';

describe.each(SECTION_HEADING_SHAPES)('section accessibility: $name', row => {
	it('exposes the rendered headings and named groups', async () => {
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} fields={CUSTOM_FIELDS} />);
		await whenAllKelvinReady(screen.container);
		for (const heading of row.headings) {
			await expect.element(screen.getByRole('heading', { name: heading.title, level: heading.level, exact: true })).toBeVisible();
			await expect.element(screen.getByRole('group', { name: heading.title, exact: true })).toBeVisible();
		}
		expect(screen.container.querySelectorAll('h2,h3,h4,h5,h6')).toHaveLength(row.headings.length);
		if (row.name.startsWith('hidden')) await expect.element(screen.container.querySelector<HTMLElement>('[hidden]')!).not.toBeVisible();
	});
});

describe.each(SECTION_DESCRIPTION_SHAPES)('section descriptions: $name', row => {
	it('links only mounted descriptions and updates error references', async () => {
		const schema = SECTION_HEADING_SHAPES[0].schema;
		const screen = await render(<KvSchemaForm<{ host: string }> schema={schema} uiSchema={row.uiSchema} extraErrors={{ __errors: ['Broker connection is unavailable.'] }} />);
		await whenAllKelvinReady(screen.container);
		const group = screen.getByRole('group', { name: 'Connection', exact: true });
		await expect.element(group).toHaveAccessibleDescription(row.description ?? '');
		const heading = screen.container.querySelector('h2,strong')!;
		const description = screen.container.querySelector('[id$="-description"]');
		if (description) {
			const object = screen.container.querySelector('[data-schema-form-object]')!;
			expect(Boolean(description.compareDocumentPosition(object) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(row.position === 'top');
			if (row.name === 'custom title') expect(group.element().getAttribute('aria-label')).toBe(heading.textContent);
		}
		await screen.rerender(
			<KvSchemaForm<{ host: string }> schema={schema} uiSchema={row.uiSchema} extraErrors={{ __errors: ['Broker connection is unavailable.'] }} displayErrors />
		);
		await whenAllKelvinReady(screen.container);
		await expect.element(group).toHaveAccessibleDescription([row.description, 'Broker connection is unavailable.'].filter(Boolean).join(' '));
		const error = screen.container.querySelector('[id$="-errors"]')!;
		expect(Boolean(error.compareDocumentPosition(screen.container.querySelector('[data-schema-form-object]')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
		await screen.rerender(<KvSchemaForm schema={schema} uiSchema={row.uiSchema} displayErrors />);
		await whenAllKelvinReady(screen.container);
		await expect.element(group).toHaveAccessibleDescription(row.description ?? '');
		expect(screen.container.querySelector('[id$="-errors"]')).toBeNull();
	});
});

describe.each(ARRAY_DESCRIPTION_SHAPES)('real array description: $name', row => {
	it('renders the selected description exactly once', async () => {
		const screen = await render(<KvSchemaForm schema={row.schema ?? DESCRIBED_CONNECTION_ARRAY} uiSchema={row.uiSchema} formData={[]} />);
		await whenAllKelvinReady(screen.container);
		const texts = Array.from(screen.container.querySelectorAll('kv-form-help-text,kv-info-label,p'))
			.map(element => element.shadowRoot?.textContent ?? element.textContent)
			.join('\n');
		for (const description of ['Configure connection endpoints.', 'Custom connections description.']) {
			expect(texts.split(description).length - 1).toBe(row.description === description ? 1 : 0);
		}
		if (row.name !== 'custom field layout')
			await expect.element(screen.getByRole('group', { name: 'Connections', exact: true })).toHaveAccessibleDescription(row.description ?? '');
	});
});

describe.each(ADDITIONAL_NAME_SHAPES)('additional property headings: $name', row => {
	it('distinguishes user-named sections and updates a renamed key', async () => {
		const screen = await render(
			<>
				<KvSchemaForm schema={row.schema} formData={row.formData} />
				<button>Outside settings</button>
			</>
		);
		await whenAllKelvinReady(screen.container);
		for (const name of row.names) await expect.element(screen.getByRole('heading', { name, exact: true })).toBeVisible();
		await screen.getByRole('textbox', { name: 'backup Key', exact: true }).fill(row.renamed);
		await screen.getByRole('button', { name: 'Outside settings', exact: true }).click();
		await expect.element(screen.getByRole('heading', { name: row.renamed, exact: true })).toBeVisible();
		await expect.element(screen.getByRole('group', { name: row.renamed, exact: true })).toBeVisible();
		await expect.element(screen.getByRole('heading', { name: 'failover', exact: true })).toBeVisible();
	});
});

describe.each([StyleMode.Light, StyleMode.Night])('section typography in %s', theme => {
	it('uses Kelvin heading tokens and a 20px field gap', async () => {
		setThemeMode(theme);
		try {
			const screen = await render(<KvSchemaForm schema={SECTION_HEADING_SHAPES[0].schema} />);
			await whenAllKelvinReady(screen.container);
			await document.fonts.load('600 14px "Proxima Nova"');
			const heading = screen.getByRole('heading', { name: 'Connection' }).element();
			const style = getComputedStyle(heading);
			expect([style.fontSize, style.fontWeight, style.lineHeight, style.letterSpacing, style.textTransform]).toEqual(['14px', '600', '20px', '1.5px', 'uppercase']);
			expect(getComputedStyle(screen.container.querySelector('[data-schema-form-object]')!).rowGap).toBe('20px');
		} finally {
			setThemeMode(StyleMode.Night);
		}
	});
});
