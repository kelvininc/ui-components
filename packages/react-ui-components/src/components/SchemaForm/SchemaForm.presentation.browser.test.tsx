import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	ADDITIONAL_LAYOUT_SHAPES,
	ARRAY_SHAPES,
	FIELDSET_BACKGROUND_SHAPES,
	FOCUS_EDITING_FLAGS,
	L1_FIELDSET_SHAPES,
	OBJECT_LAYOUT_SCHEMA,
	OBJECT_LAYOUT_SHAPES,
	OBJECT_SHAPES
} from './test-utils/matrix';
import styles from './SchemaForm.module.scss';
import itemStyles from './Templates/ArrayFieldItemTemplate/ArrayFieldItemTemplate.module.scss';

const focusedControl = () => {
	let active = document.activeElement;
	while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
	return active;
};

describe.each([StyleMode.Light, StyleMode.Night])('fieldset overlays in %s', theme => {
	describe.each(FIELDSET_BACKGROUND_SHAPES)('$name', backgroundRow => {
		it.each(L1_FIELDSET_SHAPES)('owns the overlay for $name', async ({ row: list, uiSchema, templates, headers, overlays, menus }) => {
			setThemeMode(theme);
			try {
				const screen = await render(
					<div
						style={
							{
								'width': '800px',
								'backgroundColor': 'var(--background-container-neutral-default)',
								'--schema-form-background': 'var(--background-container-neutral-default)'
							} as React.CSSProperties
						}
					>
						<KvSchemaForm schema={list.schema} formData={list.formData} uiSchema={uiSchema} templates={templates} />
					</div>
				);
				await whenAllKelvinReady(screen.container);
				const form = screen.container.querySelector<HTMLElement>(`.${styles.FormContainer}`)!;
				if (backgroundRow.background) form.style.setProperty('--schema-form-background', backgroundRow.background);
				const background = getComputedStyle(form).backgroundColor;
				expect(background).not.toBe('rgba(0, 0, 0, 0)');
				const fieldsets = screen.container.querySelectorAll(`.${itemStyles.FieldsetStyle}`);
				expect(fieldsets).toHaveLength(Math.max(list.formData.length, overlays));
				expect(screen.container.querySelectorAll('kv-action-menu')).toHaveLength(menus);
				const itemHeaders = screen.container.querySelectorAll('[data-schema-form-item-header]');
				expect(itemHeaders).toHaveLength(headers);
				let actualOverlays = 0;
				for (const header of itemHeaders) {
					const item = header.closest(`.${itemStyles.FieldsetStyle}`)!;
					const owner = header.closest('[data-schema-form-list-item]')!;
					const headerStyle = getComputedStyle(header);
					if (owner === item) {
						actualOverlays++;
						expect(headerStyle.transform).not.toBe('none');
						expect(headerStyle.backgroundColor).toBe(background);
						expect(header.getBoundingClientRect().top).toBeLessThan(item.getBoundingClientRect().top);
						expect(header.getBoundingClientRect().bottom).toBeGreaterThan(item.getBoundingClientRect().top);
					} else {
						expect(headerStyle.transform).toBe('none');
						expect(headerStyle.marginBottom).toBe('0px');
					}
				}
				expect(actualOverlays).toBe(overlays);
				for (const fieldset of fieldsets) {
					const ownedHeaders = Array.from(fieldset.querySelectorAll('[data-schema-form-item-header]')).filter(
						header => header.closest('[data-schema-form-list-item]') === fieldset
					);
					expect(ownedHeaders).toHaveLength(headers ? 1 : 0);
					if (ownedHeaders.length) expect(ownedHeaders[0].querySelector('h2,h3,h4,h5,h6')).not.toBeNull();
					if (templates) expect(fieldset.querySelector('[data-custom-item-wrap]')).not.toBeNull();
				}
			} finally {
				setThemeMode(StyleMode.Night);
			}
		});
	});
});

describe.each([...OBJECT_SHAPES, ...ARRAY_SHAPES.filter(row => row.name.includes('object'))])('R1 layout matrix: $name', row => {
	it('renders sections and keeps fields within their container', async () => {
		const screen = await render(
			<div style={{ width: '320px' }}>
				<KvSchemaForm schema={row.schema} formData={row.formData} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const wrapper = screen.container.querySelector('[data-schema-form-field]')!;
		expect(wrapper).not.toBeNull();
		for (const object of screen.container.querySelectorAll('[data-schema-form-object]')) {
			for (const child of Array.from(object.children).filter(
				element => element.getAttribute('data-schema-form-row') !== null && getComputedStyle(element).display !== 'none'
			)) {
				expect(child.getBoundingClientRect().width).toBeLessThanOrEqual(object.getBoundingClientRect().width + 1);
			}
		}
	});
});

describe.each(OBJECT_LAYOUT_SHAPES)('object dividers: $name', row => {
	it('skips hidden rows and excludes dividers from inline objects', async () => {
		const screen = await render(<KvSchemaForm schema={OBJECT_LAYOUT_SCHEMA} uiSchema={row.uiSchema} />);
		await whenAllKelvinReady(screen.container);
		const object = screen.container.querySelector('[data-schema-form-object]')!;
		const first = object.querySelector(':scope > [data-schema-form-first-row]');
		expect(first?.getAttribute('data-schema-form-row')).toBe(row.first);
		expect(Array.from(object.querySelectorAll(':scope > [data-schema-form-after-section]')).map(element => element.getAttribute('data-schema-form-row'))).toEqual(row.after);
		for (const child of Array.from(object.children).filter(element => element.hasAttribute('data-schema-form-row') && getComputedStyle(element).display !== 'none')) {
			const divided =
				!('ui:inline' in row.uiSchema && row.uiSchema['ui:inline']) &&
				child !== first &&
				(child.getAttribute('data-schema-form-row') === 'connection' || child.hasAttribute('data-schema-form-after-section'));
			expect(getComputedStyle(child).borderTopWidth).toBe(divided ? '1px' : '0px');
		}
	});
});

describe.each([320, 800])('configured widths in a %ipx container', width => {
	it('caps width and min-width at available space', async () => {
		const screen = await render(
			<div style={{ width }}>
				<KvSchemaForm schema={OBJECT_LAYOUT_SCHEMA} uiSchema={{ 'ui:inputWidth': 640, 'ui:inputMinWidth': '640px', 'ui:inputMaxWidth': '100%' }} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const object = screen.container.querySelector('[data-schema-form-object]')!;
		for (const row of object.querySelectorAll(':scope > [data-schema-form-row]')) expect(row.getBoundingClientRect().width).toBe(Math.min(width, 640));
	});
});

describe.each(ADDITIONAL_LAYOUT_SHAPES)('additional property layout: $name', row => {
	it('uses the additional-property UI schema to decide section dividers', async () => {
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />);
		await whenAllKelvinReady(screen.container);
		const backup = screen.container.querySelector('[data-schema-form-row="backup"]')!;
		expect(backup.querySelector('[data-schema-form-field]')!.getAttribute('data-schema-form-field')).toBe(row.section ? 'section' : 'control');
		expect(getComputedStyle(backup).borderTopWidth).toBe(row.section ? '1px' : '0px');
	});
});

describe.each(FOCUS_EDITING_FLAGS)('additional property Tab order: $name', flags => {
	it('includes enabled key, value and remove controls and respects editing flags', async () => {
		const row = OBJECT_SHAPES[3];
		const screen = await render(
			<>
				<button>Before labels</button>
				<div style={{ width: '320px' }}>
					<KvSchemaForm
						schema={row.schema}
						formData={row.formData}
						uiSchema={{ 'ui:submitButtonOptions': { norender: true } }}
						disabled={flags.disabled}
						readonly={flags.readonly}
					/>
				</div>
				<button>After labels</button>
			</>
		);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('button', { name: 'Before labels', exact: true }).click();
		if (flags.focused) {
			await userEvent.tab();
			await expect.poll(focusedControl).toBe(screen.getByRole('textbox', { name: 'site Key', exact: true }).element());
			await userEvent.tab();
			await expect.poll(focusedControl).toBe(screen.getByRole('textbox', { name: 'site', exact: true }).element());
			await userEvent.tab();
			await expect.poll(focusedControl).toBe(screen.getByRole('button', { name: 'Remove site', exact: true }).element());
		} else {
			await userEvent.tab();
			await expect.element(screen.getByRole('button', { name: 'After labels', exact: true })).toHaveFocus();
		}
	});
});

it('scrolls the owned root and updates the footer divider', async () => {
	const screen = await render(
		<div style={{ height: '180px' }}>
			<KvSchemaForm schema={OBJECT_LAYOUT_SCHEMA} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const owned = screen.container.querySelector('form > [data-schema-form-field]')! as HTMLElement;
	expect(owned.scrollHeight).toBeGreaterThan(owned.clientHeight);
	owned.scrollTop = 100;
	owned.dispatchEvent(new Event('scroll'));
	const footer = screen.container.querySelector('form')!.nextElementSibling!;
	await expect.poll(() => getComputedStyle(footer).borderTopWidth).toBe('1px');
});

it('keeps scrolling bound when a mounted control becomes a section', async () => {
	const screen = await render(
		<div style={{ height: '180px' }}>
			<KvSchemaForm schema={{ type: 'string', title: 'Host' }} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const oldRoot = screen.container.querySelector('[data-schema-form-field="control"]')!;
	await screen.rerender(
		<div style={{ height: '180px' }}>
			<KvSchemaForm schema={OBJECT_LAYOUT_SCHEMA} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const owned = screen.container.querySelector('form > [data-schema-form-field="section"]')! as HTMLElement;
	expect(owned).toBe(oldRoot);
	owned.scrollTop = 100;
	owned.dispatchEvent(new Event('scroll'));
	const footer = screen.container.querySelector('form')!.nextElementSibling!;
	await expect.poll(() => getComputedStyle(footer).borderTopWidth).toBe('1px');
});
