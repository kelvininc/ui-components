import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { COLLECTION_DESCRIPTION_FIELDS, COLLECTION_DESCRIPTION_SHAPES, COLLECTION_ENTRY_ERROR_SHAPES } from './test-utils/matrix';
import fileStyles from './Widgets/FileWidget/FileWidget.module.scss';

afterEach(() => setThemeMode(StyleMode.Night));

describe.each([StyleMode.Light, StyleMode.Night])('collection guidance in %s', theme => {
	describe.each([320, 800])('at %ipx', width => {
		it.each(COLLECTION_DESCRIPTION_SHAPES.filter(row => row.collection))('places and aligns $name', async row => {
			setThemeMode(theme);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown>
						schema={{ ...row.schema, default: row.formData as typeof row.schema.default }}
						uiSchema={{ ...row.uiSchema, 'ui:showDefaultValueHelper': true }}
						formData={row.formData}
						widgets={row.widgets}
					/>
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const description = screen.container.querySelector('[id$="-description"]');
			if (row.position === 'none') {
				expect(description).toBeNull();
				return;
			}
			expect(description).not.toBeNull();
			const host = description!.querySelector('kv-form-help-text')!;
			await expect.poll(() => host.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(row.schema.description);
			const text = host.shadowRoot!.querySelector('.help-text')!;
			const content = screen.container.querySelector(row.kind === 'file' ? `.${fileStyles.FileWidgetContainer}` : row.contentSelector)!;
			const title = screen.container.querySelector('[id$="-title"]')!;
			expect(content).not.toBeNull();
			if (row.position === 'top') {
				expect(text.getBoundingClientRect().left - title.getBoundingClientRect().left).toBeCloseTo(4, 0);
				expect(text.getBoundingClientRect().top).toBeGreaterThanOrEqual(title.getBoundingClientRect().bottom);
				expect(content.getBoundingClientRect().top - text.getBoundingClientRect().bottom).toBeCloseTo(12, 0);
			} else {
				expect(text.getBoundingClientRect().top).toBeGreaterThanOrEqual(content.getBoundingClientRect().bottom);
			}
			const field = host.closest('[data-schema-form-field]')!;
			expect(text.getBoundingClientRect().left - field.getBoundingClientRect().left).toBeCloseTo(4, 0);
			expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(field.getBoundingClientRect().right);
			if (row.formData !== undefined) {
				const message = `Default value is: ${row.formData}`;
				const helper = Array.from(field.querySelectorAll('kv-form-help-text')).find(host => host.helpText === message)!;
				expect(helper).toBeDefined();
				await expect.poll(() => helper.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(message.trim());
				expect(helper.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect().left - field.getBoundingClientRect().left).toBeCloseTo(4, 0);
			}
		});

		it.each(COLLECTION_ENTRY_ERROR_SHAPES)('keeps the error beneath its entry: $name', async row => {
			setThemeMode(theme);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} extraErrors={row.extraErrors} displayErrors showErrorList={false} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const description = screen.container.querySelector('[id$="-description"]')!;
			await expect.element(description.querySelector('kv-form-help-text')!).toBeVisible();
			const entry = screen.container.querySelector(row.entrySelector)!;
			const help = Array.from(entry.querySelectorAll('kv-form-help-text')).find(host => Array.isArray(host.helpText) && host.helpText.includes(row.message))!;
			expect(help).toBeDefined();
			await expect.element(help).toBeVisible();
			const control = entry.querySelector(row.kind === 'file' ? `.${fileStyles.FileInfo}` : 'kv-text-field')!;
			expect(help.getBoundingClientRect().top).toBeGreaterThanOrEqual(control.getBoundingClientRect().bottom);
			await expect.poll(() => help.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(row.message);
			expect(help.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect().left - control.getBoundingClientRect().left).toBeCloseTo(4, 0);
			if (row.name.startsWith('scalar list;')) {
				const helper = Array.from(entry.querySelectorAll('kv-form-help-text')).find(host => host.helpText === 'Default value is: telemetry')!;
				expect(helper).toBeDefined();
				await expect.poll(() => helper.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe('Default value is: telemetry');
				const text = helper.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect();
				expect(text.left - control.getBoundingClientRect().left).toBeCloseTo(4, 0);
				expect(text.right).toBeLessThanOrEqual(control.getBoundingClientRect().right);
				const nextEntry = screen.container.querySelector('[data-schema-form-list-item="1"]')!;
				const nextControl = nextEntry.querySelector('kv-text-field')!;
				const nextDescription = nextEntry.querySelector('[id$="-description"] kv-form-help-text')!;
				expect(nextDescription.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect().left - nextControl.getBoundingClientRect().left).toBeCloseTo(4, 0);
			}
		});
	});
});

it.each(COLLECTION_DESCRIPTION_FIELDS.filter(row => !row.collection))('keeps control guidance below $name', async row => {
	const screen = await render(<KvSchemaForm<unknown> schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} widgets={row.widgets} />);
	await whenAllKelvinReady(screen.container);
	const description = screen.container.querySelector('[id$="-description"]')!;
	const content = screen.container.querySelector(row.contentSelector)!;
	expect(description.getBoundingClientRect().top).toBeGreaterThanOrEqual(content.getBoundingClientRect().bottom);
});
