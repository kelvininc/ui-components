// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import { REQUIRED_MARKER_SHAPES } from './test-utils/matrix';
import styles from './Templates/TitleFieldTemplate/TitleFieldTemplate.module.scss';

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

describe.each(REQUIRED_MARKER_SHAPES)('required markers: $name', row => {
	it('places each visible default marker between its title and help', async () => {
		await act(async () => root.render(<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />));
		const markers = Array.from(container.querySelectorAll(`.${styles.Required}`));
		expect(
			markers.map(marker => {
				const title = marker.parentElement!.querySelector('[id$="-title"]')!;
				return title.tagName === 'KV-TOOLTIP' ? propsOf<{ text: string }>(title).text : title.textContent;
			})
		).toEqual(row.expectedTitles);
		for (const marker of markers) {
			expect(marker.getAttribute('aria-hidden')).toBeNull();
			expect(marker.previousElementSibling!.matches('kv-tooltip,h2,h3,h4,h5,h6')).toBe(true);
			const help = marker.parentElement!.querySelector('kv-toggle-tip');
			expect(marker.nextElementSibling).toBe(help);
		}
		if (row.name === 'custom title') expect(container.querySelector('[data-required-custom-title]')!.textContent).toBe('* Port name');
		if (row.name === 'custom field') expect(container.querySelector('[data-required-custom-field]')).not.toBeNull();
	});
});

it('updates required suffixes without changing title ids', async () => {
	const row = REQUIRED_MARKER_SHAPES[0];
	let titleId: string | undefined;
	for (const required of [true, false, true]) {
		await act(async () =>
			root.render(<KvSchemaForm<unknown> schema={{ ...row.schema, required: required ? ['setting'] : [] }} uiSchema={row.uiSchema} formData={row.formData} />)
		);
		const title = container.querySelector('kv-tooltip[id$="-title"]')!;
		titleId ??= title.id;
		expect(title.id).toBe(titleId);
		expect(container.querySelectorAll(`.${styles.Required}`)).toHaveLength(required ? 1 : 0);
		if (required) expect(title.nextElementSibling!.className).toBe(styles.Required);
	}
});
