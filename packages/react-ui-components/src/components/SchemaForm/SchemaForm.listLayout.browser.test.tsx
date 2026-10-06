import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	ARRAY_SHAPES,
	FOCUS_EDITING_FLAGS,
	LIST_OPTIONS,
	L1_ALIGNMENT_SHAPES,
	L1_ARRAY_TEMPLATE_SHAPES,
	L1_EMPTY_ITEM_SCHEMAS,
	L1_HIDDEN_ITEM_HEADINGS,
	L1_ITEM_FIELD_COMPONENTS,
	L1_PREFIX_SHAPES,
	L1_SCALAR_LIST_SHAPES,
	L1_TUPLE_SHAPES,
	L1_UNION_LIST_SHAPES
} from './test-utils/matrix';

const center = (element: Element) => {
	const bounds = element.getBoundingClientRect();
	return bounds.y + bounds.height / 2;
};
const rootItems = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('[data-schema-form-list="root"] > div > div > [data-schema-form-list-item]'));

describe.each(L1_EMPTY_ITEM_SCHEMAS)('L1 empty item schemas in Chromium: $name', row => {
	it.each(FOCUS_EDITING_FLAGS)('keeps named item controls when $name', async flags => {
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} disabled={flags.disabled} readonly={flags.readonly} />);
		await whenAllKelvinReady(screen.container);
		expect(rootItems(screen.container)).toHaveLength(3);
		expect(screen.container.querySelectorAll('[data-schema-form-list-item] kv-text-field,[data-schema-form-list-item] kv-info-label')).toHaveLength(0);
		for (let position = 1; position <= 3; position++) {
			for (const name of [`Reorder Broker ${position}`, `Remove Broker ${position}`]) {
				const button = screen.getByRole('button', { name, exact: true });
				await expect.element(button).toBeVisible();
				expect((button.element() as HTMLElement).tabIndex).toBe(-1);
				if (flags.focused) await expect.element(button).toBeEnabled();
				else await expect.element(button).toBeDisabled();
			}
		}
	});
	it('keeps boundary restrictions and real move/remove callbacks without an item field', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('button', { name: 'Reorder Broker 1', exact: true }).click();
		await expect.element(page.getByRole('menuitem', { name: 'Move up', exact: true })).toBeDisabled();
		await expect.element(page.getByRole('menuitem', { name: 'Move down', exact: true })).toBeEnabled();
		await userEvent.keyboard('{Escape}');
		await screen.getByRole('button', { name: 'Reorder Broker 3', exact: true }).click();
		await expect.element(page.getByRole('menuitem', { name: 'Move down', exact: true })).toBeDisabled();
		await page.getByRole('menuitem', { name: 'Move up', exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[0], row.formData[2], row.formData[1]]);
		onChange.mockClear();
		await screen.getByRole('button', { name: 'Remove Broker 2', exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[0], row.formData[1]]);
	});
});

describe.each(L1_SCALAR_LIST_SHAPES)('L1 scalar alignment: $name', row => {
	it.each(L1_ALIGNMENT_SHAPES)('centers actions on inputs with $name', async presentation => {
		const schema = { ...row.schema, items: { ...(row.schema.items as object), default: presentation.defaultHelper ? row.formData[0] : undefined } };
		const screen = await render(
			<div style={{ width: '640px' }}>
				<KvSchemaForm<Record<number, unknown>>
					schema={schema}
					formData={row.formData}
					uiSchema={presentation.uiSchema}
					extraErrors={presentation.extraErrors}
					displayErrors
				/>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const leftEdges: number[] = [];
		const items = rootItems(screen.container);
		expect(items).toHaveLength(row.formData.length);
		const message = presentation.defaultHelper ? `${presentation.message}${row.formData[0]}` : presentation.message;
		if (message) {
			if (presentation.name === 'help tip') {
				const tip = items[0].querySelector<HTMLKvToggleTipElement>('kv-toggle-tip');
				expect(tip).not.toBeNull();
				expect(tip!.text).toBe(message);
				await userEvent.click(tip!.querySelector('[slot="open-element-slot"]')!);
				await expect
					.poll(
						() =>
							page
								.getByText(message, { exact: true })
								.elements()
								.filter(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).length
					)
					.toBe(1);
				await userEvent.click(tip!.querySelector('[slot="open-element-slot"]')!);
			} else {
				await expect.element(screen.getByText(message, { exact: true }).first()).toBeVisible();
			}
		}
		for (const [index, item] of items.entries()) {
			const host = item.querySelector(`kv-text-field[id="root_${index}"],kv-single-select-dropdown[id="root_${index}"]`)!;
			expect(host).not.toBeNull();
			const input = host.localName === 'kv-text-field' ? host.shadowRoot!.querySelector('input')! : host.querySelector('kv-text-field')!.shadowRoot!.querySelector('input')!;
			const remove = screen.getByRole('button', { name: `Remove ${row.itemName} ${index + 1}`, exact: true }).element();
			const grip = screen.getByRole('button', { name: `Reorder ${row.itemName} ${index + 1}`, exact: true }).element();
			expect(Math.abs(center(input) - center(remove))).toBeLessThanOrEqual(1);
			expect(Math.abs(center(input) - center(grip))).toBeLessThanOrEqual(1);
			expect(input.getAttribute('aria-label')).toBe(`${row.itemName} ${index + 1}`);
			expect(item.querySelector('kv-info-label')).toBeNull();
			leftEdges.push(input.getBoundingClientRect().x);
		}
		expect(Math.max(...leftEdges) - Math.min(...leftEdges)).toBeLessThanOrEqual(1);
	});
});

it.each(L1_ARRAY_TEMPLATE_SHAPES)('L1 custom array metadata in Chromium: $name', async ({ row, uiSchema, ArrayTemplate, menus, labels }) => {
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={uiSchema} templates={{ ArrayFieldTemplate: ArrayTemplate }} />);
	await whenAllKelvinReady(screen.container);
	expect(screen.container.querySelectorAll('kv-action-menu')).toHaveLength(menus);
	for (const label of labels) await expect.element(screen.getByRole('textbox', { name: label, exact: true })).toBeVisible();
	const nested = screen.container.querySelector('[data-custom-array-layout="root_0_tags"]');
	if (nested) {
		expect(Array.from(nested.querySelectorAll<HTMLKvActionMenuElement>('kv-action-menu')).map(control => control.accessibleLabel)).toEqual([
			'Reorder Tag 1',
			'Reorder Tag 2',
			'Reorder Tag 3'
		]);
	}
});

it.each(L1_HIDDEN_ITEM_HEADINGS)('L1 hidden object headings in Chromium: $name', async ({ uiSchema }) => {
	const row = ARRAY_SHAPES[1];
	const screen = await render(
		<div style={{ width: '320px' }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={uiSchema} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	for (const item of rootItems(screen.container)) {
		const header = item.querySelector<HTMLElement>('[data-schema-form-item-header]')!;
		expect(header.querySelector('h2,h3,h4,h5,h6')).toBeNull();
		const menu = header.querySelector('kv-action-menu')!;
		expect(Math.abs(menu.getBoundingClientRect().right - header.getBoundingClientRect().right)).toBeLessThanOrEqual(1);
	}
});

describe.each(L1_UNION_LIST_SHAPES)('L1 union ownership in Chromium: $name', row => {
	it('renders exactly one named menu per item and removes the selected item once', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const items = rootItems(screen.container);
		expect(items).toHaveLength(2);
		for (const item of items) expect(item.querySelectorAll('kv-action-menu')).toHaveLength(1);
		onChange.mockClear();
		if (row.section) {
			await screen.getByRole('button', { name: `Actions for ${row.itemName} 2`, exact: true }).click();
			await page.getByRole('menuitem', { name: `Remove ${row.itemName} 2`, exact: true }).click();
		} else await screen.getByRole('button', { name: `Remove ${row.itemName} 2`, exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[0]]);
	});
});

describe.each(L1_ITEM_FIELD_COMPONENTS)('L1 custom item field in Chromium: $name', ({ ItemField }) => {
	it('keeps real move and remove controls available', async () => {
		const row = ARRAY_SHAPES[0];
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} fields={{ ArraySchemaField: ItemField }} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		expect(screen.container.querySelectorAll('[data-array-item-input]')).toHaveLength(3);
		await screen.getByRole('button', { name: 'Reorder Topic 2', exact: true }).click();
		await page.getByRole('menuitem', { name: 'Move up', exact: true }).click();
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0], row.formData[2]]);
		onChange.mockClear();
		await screen.getByRole('button', { name: 'Remove Topic 3', exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0]]);
	});
});

describe.each(ARRAY_SHAPES)('L1 list matrix in Chromium: $name', row => {
	describe.each(LIST_OPTIONS)('$name', option => {
		it.each([false, true])('names controls and respects readonly=%s', async readonly => {
			const screen = await render(
				<div style={{ width: '640px' }}>
					<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={{ ...row.uiSchema, 'ui:options': option.options }} readonly={readonly} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			expect(rootItems(screen.container)).toHaveLength(row.formData.length);
			const list = screen.container.querySelector('[data-schema-form-list="root"]')!;
			const menus = Array.from(list.querySelectorAll<HTMLKvActionMenuElement>('kv-action-menu')).filter(host => host.closest('[data-schema-form-list]') === list);
			const fixedItems = Array.isArray(row.schema.items) ? row.schema.items.length : 0;
			const movableItems = Math.max(0, row.formData.length - fixedItems);
			// RJSF 5 validates minItems after removal; only fixed tuple positions block removal.
			const removableItems = movableItems;
			const section = rootItems(screen.container)[0].getAttribute('data-schema-form-item-kind') === 'section';
			expect(menus).toHaveLength(option.options.orderable !== false ? movableItems : section && option.options.removable !== false ? removableItems : 0);
			const trash = Array.from(list.querySelectorAll<HTMLKvActionButtonIconElement>('kv-action-button-icon')).filter(
				host => !host.closest('kv-action-menu') && host.closest('[data-schema-form-list]') === list
			);
			expect(trash).toHaveLength(!section && option.options.removable !== false ? removableItems : 0);
			for (const host of trash) {
				const button = screen.getByRole('button', { name: host.accessibleLabel, exact: true });
				expect((button.element() as HTMLElement).tabIndex).toBe(-1);
				if (readonly || row.name === 'readonly') await expect.element(button).toBeDisabled();
				else await expect.element(button).toBeEnabled();
			}
			for (const host of menus) {
				const trigger = screen.getByRole('button', { name: host.accessibleLabel, exact: true });
				await expect.element(trigger).toBeVisible();
				expect((trigger.element() as HTMLButtonElement).tabIndex).toBe(-1);
				if (readonly || row.name === 'readonly') await expect.element(trigger).toBeDisabled();
				else await expect.element(trigger).toBeEnabled();
			}
			expect(screen.getByRole('button', { name: '', exact: true }).query()).toBeNull();
			const add = list.querySelector<HTMLKvActionButtonElement>(':scope > div > div > div > kv-action-button');
			if (option.options.addable !== false) {
				expect(add?.textContent).toBe('Add item');
				const button = screen.getByRole('button', { name: add!.accessibleLabel, exact: true }).element();
				expect((button as HTMLButtonElement).tabIndex).toBe(-1);
				expect(add!.getBoundingClientRect().x).toBeCloseTo(list.getBoundingClientRect().x, 0);
			} else expect(add).toBeNull();
		});
	});
});

describe.each(L1_PREFIX_SHAPES)('L1 prefix names in Chromium: $name', row => {
	it('names the input without a visible prefix column', async () => {
		const screen = await render(<KvSchemaForm schema={ARRAY_SHAPES[0].schema} formData={ARRAY_SHAPES[0].formData} uiSchema={row.uiSchema} />);
		await whenAllKelvinReady(screen.container);
		await expect.element(screen.getByRole('textbox', { name: 'Broker 2', exact: true })).toBeVisible();
		await expect.element(screen.getByRole('button', { name: 'Remove Broker 2', exact: true })).toBeVisible();
		expect(rootItems(screen.container)[1].querySelector('kv-info-label')).toBeNull();
	});
});

describe.each(L1_TUPLE_SHAPES)('L1 tuple labels in Chromium: $name', row => {
	it('keeps position labels and aligns their input rows', async () => {
		const tuple = ARRAY_SHAPES[3];
		const screen = await render(<KvSchemaForm schema={tuple.schema} formData={tuple.formData} uiSchema={row.uiSchema} />);
		await whenAllKelvinReady(screen.container);
		const positions = rootItems(screen.container);
		const leftEdges: number[] = [];
		for (const [index, label] of row.labels.entries()) {
			await expect.element(screen.getByRole('textbox', { name: label, exact: true })).toBeVisible();
			expect(positions[index].querySelector<HTMLKvInfoLabelElement>('kv-info-label')!.labelTitle).toBe(label);
			leftEdges.push(screen.getByRole('textbox', { name: label, exact: true }).element().getBoundingClientRect().x);
		}
		expect(Math.max(...leftEdges) - Math.min(...leftEdges)).toBeLessThanOrEqual(1);
	});
});

describe.each([ARRAY_SHAPES[0], ARRAY_SHAPES[1], ARRAY_SHAPES[7]])('L1 real menu callbacks: $name', row => {
	it('keeps boundary moves disabled and reorders data from the menu', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const menus = rootItems(screen.container).map(item => item.querySelector<HTMLKvActionMenuElement>('kv-action-menu')!);
		await screen.getByRole('button', { name: menus[0].accessibleLabel, exact: true }).click();
		await expect.element(page.getByRole('menuitem', { name: 'Move up', exact: true })).toBeDisabled();
		await expect.element(page.getByRole('menuitem', { name: 'Move down', exact: true })).toBeEnabled();
		await userEvent.keyboard('{Escape}');
		await screen.getByRole('button', { name: menus[2].accessibleLabel, exact: true }).click();
		await expect.element(page.getByRole('menuitem', { name: 'Move down', exact: true })).toBeDisabled();
		await userEvent.keyboard('{Escape}');
		onChange.mockClear();
		await screen.getByRole('button', { name: menus[1].accessibleLabel, exact: true }).click();
		await page.getByRole('menuitem', { name: 'Move up', exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0], row.formData[2]]);
	});
	it('removes an item once through its own control', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const item = rootItems(screen.container)[1];
		const object = item.getAttribute('data-schema-form-item-kind') === 'section';
		const menu = item.querySelector<HTMLKvActionMenuElement>('kv-action-menu')!;
		const label = object
			? menu.items.find(action => action.id === 'remove')!.label
			: Array.from(item.querySelectorAll<HTMLKvActionButtonIconElement>('kv-action-button-icon')).find(host => !host.closest('kv-action-menu'))!.accessibleLabel;
		onChange.mockClear();
		if (object) {
			await screen.getByRole('button', { name: menu.accessibleLabel, exact: true }).click();
			const action = page.getByRole('menuitem', { name: label, exact: true });
			await expect.element(action).toBeVisible();
			expect(menu.items.find(action => action.id === 'remove')).toMatchObject({ destructive: true, separatorBefore: true });
			await action.click();
		} else await screen.getByRole('button', { name: label, exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[0], row.formData[2]]);
	});
});

describe.each([StyleMode.Light, StyleMode.Night])('L1 object headers in %s', theme => {
	it('places one menu beside each numbered heading and preserves the rail', async () => {
		setThemeMode(theme);
		try {
			const row = ARRAY_SHAPES[1];
			const screen = await render(
				<div style={{ width: '640px' }}>
					<KvSchemaForm schema={row.schema} formData={row.formData} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			const items = rootItems(screen.container);
			expect(items).toHaveLength(row.formData.length);
			for (const [index, item] of items.entries()) {
				const header = item.querySelector('[data-schema-form-item-header]')!;
				const heading = header.querySelector('h2,h3,h4,h5,h6')!;
				expect(heading.textContent).toBe(`Broker ${index + 1}`);
				const menu = header.querySelector<HTMLKvActionMenuElement>('kv-action-menu')!;
				const button = screen.getByRole('button', { name: menu.accessibleLabel, exact: true }).element();
				expect(Math.abs(center(heading) - center(button))).toBeLessThanOrEqual(1);
				expect(getComputedStyle(item).borderLeftWidth).toBe('1px');
				expect(item.querySelectorAll(':scope > div > div > [data-schema-form-item-header] kv-action-menu')).toHaveLength(1);
			}
		} finally {
			setThemeMode(StyleMode.Night);
		}
	});
});
