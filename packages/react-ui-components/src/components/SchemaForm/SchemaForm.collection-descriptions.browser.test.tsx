import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	COLLECTION_ADD_ALIGNMENT_SHAPES,
	COLLECTION_DESCRIPTION_FIELDS,
	COLLECTION_DESCRIPTION_SHAPES,
	COLLECTION_ENTRY_ERROR_SHAPES,
	COLLECTION_METADATA_TRANSITIONS,
	COLLECTION_TITLE_OVERRIDE_SHAPES,
	FILE_FIELD_OVERRIDE_SHAPES
} from './test-utils/matrix';
import fileStyles from './Widgets/FileWidget/FileWidget.module.scss';

afterEach(() => setThemeMode(StyleMode.Night));

describe.each([StyleMode.Light, StyleMode.Night])('collection guidance in %s', theme => {
	describe.each([320, 800])('at %ipx', width => {
		it.each(COLLECTION_METADATA_TRANSITIONS)('preserves the collection action menu when $name', async row => {
			setThemeMode(theme);
			const form = (descriptionPosition: 'top' | 'none') => (
				<div style={{ width }}>
					<KvSchemaForm<unknown>
						schema={row.schema}
						formData={row.formData}
						uiSchema={{ items: { 'ui:descriptionPosition': descriptionPosition, 'ui:options': { layout: 'sections' } } }}
					/>
				</div>
			);
			const screen = await render(form(row.from));
			await whenAllKelvinReady(screen.container);
			const header = screen.container.querySelector('[data-schema-form-item-header]')!;
			const menu = header.querySelector('kv-action-menu')!;
			expect(menu).not.toBeNull();
			await screen.getByRole('button', { name: menu.accessibleLabel, exact: true }).click();
			const action = page.getByRole('menuitem', { name: 'Move down', exact: true });
			await expect.element(action).toBeVisible();
			await expect.element(action).toHaveFocus();
			await screen.rerender(form(row.to));
			await whenAllKelvinReady(screen.container);
			expect(screen.container.querySelector('[data-schema-form-item-header] kv-action-menu')).toBe(menu);
			await expect.element(action).toBeVisible();
			await expect.element(action).toHaveFocus();
		});

		it.each(COLLECTION_TITLE_OVERRIDE_SHAPES)('keeps collection metadata within the field with a $name', async row => {
			setThemeMode(theme);
			const collection = COLLECTION_DESCRIPTION_FIELDS.find(shape => shape.name === 'object sections')!;
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown>
						schema={collection.schema}
						uiSchema={collection.uiSchema}
						formData={collection.formData}
						templates={{ TitleFieldTemplate: row.TitleFieldTemplate }}
					/>
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const field = screen.container.querySelector('[data-schema-form-field="section"] > div')!;
			const metadata = field.querySelector('[data-schema-form-collection-metadata]')!;
			await expect.element(metadata).toBeVisible();
			expect(metadata.getBoundingClientRect().top).toBeGreaterThanOrEqual(field.getBoundingClientRect().top);
			const list = field.querySelector(collection.contentSelector)!;
			expect(list).not.toBeNull();
			expect(list.getBoundingClientRect().top).toBeGreaterThanOrEqual(metadata.getBoundingClientRect().bottom);
		});

		it.each(FILE_FIELD_OVERRIDE_SHAPES)('shows inline errors for a custom $name on a file schema', async row => {
			setThemeMode(theme);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown>
						schema={row.schema}
						formData={row.formData}
						fields={row.fields}
						extraErrors={{ __errors: ['CA certificate has expired.'] }}
						displayErrors
						showErrorList={false}
					/>
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const content = screen.container.querySelector('[data-certificate-reference]')!;
			expect(content).not.toBeNull();
			const error = screen.container.querySelector('[id$="-errors"] kv-form-help-text')!;
			expect(error).not.toBeNull();
			await expect.element(error).toBeVisible();
			await expect.poll(() => error.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe('CA certificate has expired.');
			expect(error.getBoundingClientRect().top).toBeGreaterThanOrEqual(content.getBoundingClientRect().bottom);
		});

		it.each(COLLECTION_ADD_ALIGNMENT_SHAPES)('aligns Add with the resolved item layout: $name', async row => {
			setThemeMode(theme);
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm<unknown> schema={row.schema} formData={row.formData} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const list = screen.container.querySelector('[data-schema-form-list="root"]')!;
			const add = list.querySelector('kv-action-button')!;
			expect(add.querySelector('kv-icon')).not.toBeNull();
			await screen.getByRole('button', { name: /^Add/ }).click();
			await whenAllKelvinReady(screen.container);
			const entries = list.querySelectorAll('[data-schema-form-list-item]');
			expect(entries).toHaveLength(row.formData.length + 1);
			const entry = entries[entries.length - 1];
			expect(entry.getAttribute('data-schema-form-item-kind')).toBe(row.grip ? 'control' : 'section');
			const target = row.grip ? entry.querySelector('kv-text-field')! : entry;
			const addStart = row.grip ? add.querySelector('span')! : add;
			expect(addStart.getBoundingClientRect().left).toBeCloseTo(target.getBoundingClientRect().left, 0);
		});

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
			const content = screen.container.querySelector(row.kind === 'file' ? `.${fileStyles.FileWidgetContainer}` : row.contentSelector)!;
			expect(content).not.toBeNull();
			let lastMetadataText: Element | undefined;
			if (row.position === 'none') {
				expect(description).toBeNull();
			} else {
				expect(description).not.toBeNull();
				const host = description!.querySelector('kv-form-help-text')!;
				await expect.poll(() => host.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(row.schema.description);
				const text = host.shadowRoot!.querySelector('.help-text')!;
				const title = screen.container.querySelector('[id$="-title"]')!;
				if (row.position === 'top') {
					expect(text.getBoundingClientRect().left - title.getBoundingClientRect().left).toBeCloseTo(0, 0);
					expect(text.getBoundingClientRect().top).toBeGreaterThanOrEqual(title.getBoundingClientRect().bottom);
					lastMetadataText = text;
				} else {
					expect(text.getBoundingClientRect().top).toBeGreaterThanOrEqual(content.getBoundingClientRect().bottom);
				}
				const field = host.closest('[data-schema-form-field]')!;
				expect(text.getBoundingClientRect().left - field.getBoundingClientRect().left).toBeCloseTo(0, 0);
				expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(field.getBoundingClientRect().right);
			}
			if (row.formData !== undefined) {
				const message = `Default: ${row.formData}`;
				const helper = Array.from(screen.container.querySelectorAll('kv-form-help-text')).find(host => host.helpText === message)!;
				expect(helper).toBeDefined();
				await expect.poll(() => helper.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe(message.trim());
				const text = helper.shadowRoot!.querySelector('.help-text')!;
				const field = helper.closest('[data-schema-form-field]')!;
				expect(text.getBoundingClientRect().left - field.getBoundingClientRect().left).toBeCloseTo(0, 0);
				expect(text.getBoundingClientRect().bottom).toBeLessThanOrEqual(content.getBoundingClientRect().top);
				if (lastMetadataText) expect(text.getBoundingClientRect().top - lastMetadataText.getBoundingClientRect().bottom).toBeCloseTo(4, 0);
				lastMetadataText = text;
			}
			if (lastMetadataText) expect(content.getBoundingClientRect().top - lastMetadataText.getBoundingClientRect().bottom).toBeCloseTo(12, 0);
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
			expect(help.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect().left - control.getBoundingClientRect().left).toBeCloseTo(0, 0);
			if (row.name.startsWith('scalar list;')) {
				const add = screen.container.querySelector('[data-schema-form-list="root"] kv-action-button')!;
				const addStart = row.uiSchema?.['ui:options']?.orderable ? add.querySelector('span')! : add;
				expect(addStart.getBoundingClientRect().left).toBeCloseTo(control.getBoundingClientRect().left, 0);
				const icon = add.querySelector('kv-icon');
				if (row.uiSchema?.['ui:options']?.orderable) {
					expect(icon).not.toBeNull();
					const drawnIcon = icon!.shadowRoot!.querySelector('.icon')!.getBoundingClientRect();
					const grip = entry.querySelector('kv-action-menu')!.getBoundingClientRect();
					expect(drawnIcon.left + drawnIcon.width / 2).toBeCloseTo(grip.left + grip.width / 2, 0);
				} else expect(icon).not.toBeNull();
				const helper = Array.from(entry.querySelectorAll('kv-form-help-text')).find(host => host.helpText === 'Default: telemetry')!;
				expect(helper).toBeDefined();
				await expect.poll(() => helper.shadowRoot?.querySelector('.help-text')?.textContent?.trim()).toBe('Default: telemetry');
				const text = helper.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect();
				const controlBox = control.getBoundingClientRect();
				if (controlBox.width > 460) expect(controlBox.right - text.right).toBeLessThanOrEqual(4);
				else expect(text.left - controlBox.left).toBeCloseTo(0, 0);
				expect(text.right).toBeLessThanOrEqual(control.getBoundingClientRect().right);
				const nextEntry = screen.container.querySelector('[data-schema-form-list-item="1"]')!;
				const nextControl = nextEntry.querySelector('kv-text-field')!;
				const nextDescription = nextEntry.querySelector('[id$="-description"] kv-form-help-text')!;
				expect(nextDescription.shadowRoot!.querySelector('.help-text')!.getBoundingClientRect().left - nextControl.getBoundingClientRect().left).toBeCloseTo(0, 0);
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
