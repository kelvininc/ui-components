// @vitest-environment jsdom
import type { JSX } from '@kelvininc/ui-components';
import React, { act, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
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
	L1_UNION_LIST_SHAPES,
	TEMPLATE_COMPONENTS
} from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

const mounts: { container: HTMLElement; root: ReturnType<typeof createRoot> }[] = [];
const render = (element: ReactNode) => {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);
	mounts.push({ container, root });
	act(() => root.render(element));
	return { container, rerender: (element: ReactNode) => act(() => root.render(element)) };
};
afterEach(() => {
	for (const { root, container } of mounts.splice(0)) {
		act(() => root.unmount());
		container.remove();
	}
});

describe.each(L1_EMPTY_ITEM_SCHEMAS)('L1 empty item schemas: $name', row => {
	describe.each(LIST_OPTIONS)('$name', option => {
		it.each(FOCUS_EDITING_FLAGS)('keeps available item controls when $name', flags => {
			const onChange = vi.fn();
			const screen = render(
				<KvSchemaForm
					schema={row.schema}
					formData={row.formData}
					uiSchema={{ ...row.uiSchema, 'ui:options': option.options }}
					disabled={flags.disabled}
					readonly={flags.readonly}
					onChange={onChange}
				/>
			);
			expect(screen.container.querySelectorAll('[data-schema-form-list-item]')).toHaveLength(3);
			expect(screen.container.querySelectorAll('[data-schema-form-list-item] kv-text-field,[data-schema-form-list-item] kv-info-label')).toHaveLength(0);
			const menus = screen.container.querySelectorAll('kv-action-menu');
			const remove = screen.container.querySelectorAll('kv-action-button-icon');
			expect(menus).toHaveLength(option.options.orderable === false ? 0 : 3);
			expect(remove).toHaveLength(option.options.removable === false ? 0 : 3);
			for (const control of [...menus, ...remove]) expect(propsOf(control).disabled).toBe(!flags.focused);
			if (menus.length) {
				expect(propsOf<JSX.KvActionMenu>(menus[0]).accessibleLabel).toBe('Reorder Broker 1');
				act(() => fireStencilEvent(menus[0], 'onItemSelected', 'move-down', { force: true }));
				if (flags.focused) expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0], row.formData[2]]);
				else expect(onChange).not.toHaveBeenCalled();
			}
		});
	});
});

describe.each(L1_UNION_LIST_SHAPES)('L1 union ownership: $name', row => {
	it('renders one set of item actions across the selected branch', () => {
		const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} />);
		const items = screen.container.querySelectorAll('[data-schema-form-list-item]');
		expect(items).toHaveLength(2);
		for (const item of items) {
			expect(item.querySelectorAll('kv-action-menu')).toHaveLength(1);
			expect(item.querySelectorAll('kv-action-button-icon')).toHaveLength(row.section ? 0 : 1);
		}
	});
});

describe.each(L1_ITEM_FIELD_COMPONENTS)('L1 custom array item field: $name', ({ ItemField }) => {
	it('retains actions and mounted input identity', () => {
		const row = ARRAY_SHAPES[0];
		const onChange = vi.fn();
		const form = () => <KvSchemaForm schema={row.schema} formData={row.formData} fields={{ ArraySchemaField: ItemField }} onChange={onChange} />;
		const screen = render(form());
		const input = screen.container.querySelector('[data-array-item-input]');
		expect(input).not.toBeNull();
		for (let count = 0; count < 10; count++) screen.rerender(form());
		expect(screen.container.querySelector('[data-array-item-input]')).toBe(input);
		const menus = screen.container.querySelectorAll('kv-action-menu');
		expect(menus).toHaveLength(3);
		expect(screen.container.querySelectorAll('kv-action-button-icon')).toHaveLength(3);
		act(() => fireStencilEvent(menus[0], 'onItemSelected', 'move-down'));
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0], row.formData[2]]);
	});
});

describe.each(TEMPLATE_COMPONENTS)('L1 custom field template: $name', ({ FieldLayout }) => {
	it.each(['global', 'item'] as const)('keeps controls outside a %s template and preserves input identity', placement => {
		const row = ARRAY_SHAPES[0];
		const form = () => (
			<KvSchemaForm
				schema={row.schema}
				formData={row.formData}
				templates={placement === 'global' ? { FieldTemplate: FieldLayout } : undefined}
				uiSchema={placement === 'item' ? { items: { 'ui:FieldTemplate': FieldLayout } } : {}}
			/>
		);
		const screen = render(form());
		const input = screen.container.querySelector('kv-text-field[id="root_0"]');
		expect(input).not.toBeNull();
		for (let count = 0; count < 10; count++) screen.rerender(form());
		expect(screen.container.querySelector('kv-text-field[id="root_0"]')).toBe(input);
		for (const item of screen.container.querySelectorAll('[data-schema-form-list-item]')) {
			expect(item.querySelectorAll('kv-action-menu')).toHaveLength(1);
			expect(item.querySelectorAll('kv-action-button-icon')).toHaveLength(1);
			expect(item.querySelector('[data-field-layout]')!.querySelector('kv-action-menu')).toBeNull();
		}
	});
});

it.each(L1_ALIGNMENT_SHAPES.filter(row => row.message))('L1 preserves $name when it hides scalar labels', presentation => {
	const row = L1_SCALAR_LIST_SHAPES[0];
	const schema = { ...row.schema, items: { ...(row.schema.items as object), default: presentation.defaultHelper ? row.formData[0] : undefined } };
	const screen = render(
		<KvSchemaForm<Record<number, unknown>> schema={schema} formData={row.formData} uiSchema={presentation.uiSchema} extraErrors={presentation.extraErrors} displayErrors />
	);
	const item = screen.container.querySelector('[data-schema-form-list-item="0"]')!;
	expect(item.querySelector('kv-info-label')).toBeNull();
	const help = item.querySelector('kv-toggle-tip,kv-form-help-text')!;
	expect(help).not.toBeNull();
	const message = presentation.defaultHelper ? `${presentation.message}${row.formData[0]}` : presentation.message;
	expect(propsOf(help).text ?? propsOf(help).helpText).toEqual(presentation.extraErrors ? [message] : message);
});

it.each(L1_ARRAY_TEMPLATE_SHAPES)('L1 preserves metadata for $name', ({ row, uiSchema, ArrayTemplate, menus, labels }) => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={uiSchema} templates={{ ArrayFieldTemplate: ArrayTemplate }} />);
	expect(screen.container.querySelectorAll('kv-action-menu')).toHaveLength(menus);
	for (const [index, label] of labels.entries()) {
		const item = screen.container.querySelector(`[data-schema-form-list-item="${index}"]`)!;
		expect(propsOf(item.querySelector('kv-info-label')!).labelTitle).toBe(label);
	}
	const nested = screen.container.querySelector('[data-custom-array-layout="root_0_tags"]');
	if (nested) {
		const controls = Array.from(nested.querySelectorAll('kv-action-menu'));
		expect(controls.map(control => propsOf(control).accessibleLabel)).toEqual(['Reorder Tag 1', 'Reorder Tag 2', 'Reorder Tag 3']);
	}
});

it.each(L1_HIDDEN_ITEM_HEADINGS)('L1 preserves object item $name', ({ uiSchema }) => {
	const row = ARRAY_SHAPES[1];
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={uiSchema} />);
	for (const item of screen.container.querySelectorAll('[data-schema-form-list-item]')) {
		expect(item.querySelector('[data-schema-form-item-header]')!.querySelector('h2,h3,h4,h5,h6')).toBeNull();
		expect(item.querySelector('kv-action-menu')).not.toBeNull();
	}
});

describe.each(ARRAY_SHAPES)('L1 array controls: $name', row => {
	describe.each(LIST_OPTIONS)('$name', option => {
		it.each([false, true])('keeps restrictions and data callbacks when readonly is %s', readonly => {
			const onChange = vi.fn();
			const screen = render(
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={{ ...row.uiSchema, 'ui:options': option.options }} readonly={readonly} onChange={onChange} />
			);
			const list = screen.container.querySelector('[data-schema-form-list="root"]')!;
			expect(list).not.toBeNull();
			const items = list.querySelectorAll(':scope > div > div > [data-schema-form-list-item]');
			expect(items).toHaveLength(row.formData.length);
			const add = list.querySelector(':scope > div > div > div > kv-action-button');
			if (option.options.addable !== false) {
				expect(add).not.toBeNull();
				expect(add!.textContent).toBe('Add item');
				expect(propsOf(add!).tabIndex).toBe(-1);
				expect(propsOf(add!).menuTabIndex).toBe(-1);
			} else expect(add).toBeNull();
			const rootMenus = Array.from(list.querySelectorAll('kv-action-menu')).filter(menu => menu.closest('[data-schema-form-list]') === list);
			const fixedItems = Array.isArray(row.schema.items) ? row.schema.items.length : 0;
			const movableItems = Math.max(0, row.formData.length - fixedItems);
			// RJSF 5 validates minItems after removal; only fixed tuple positions block removal.
			const removableItems = movableItems;
			const section = items[0].getAttribute('data-schema-form-item-kind') === 'section';
			expect(rootMenus).toHaveLength(option.options.orderable !== false ? movableItems : section && option.options.removable !== false ? removableItems : 0);
			const trash = Array.from(list.querySelectorAll('kv-action-button-icon')).filter(host => host.closest('[data-schema-form-list]') === list);
			expect(trash).toHaveLength(!section && option.options.removable !== false ? removableItems : 0);
			for (const button of trash) expect(propsOf(button).disabled).toBe(readonly || row.name === 'readonly');
			for (const menu of rootMenus) {
				const props = propsOf<JSX.KvActionMenu>(menu);
				expect(props.triggerTabIndex).toBe(-1);
				expect(props.accessibleLabel?.trim()).toBeTruthy();
				expect(props.disabled).toBe(readonly || row.name === 'readonly');
				if (option.options.orderable === false) expect(props.items?.some(item => item.id.startsWith('move-'))).toBe(false);
				if (option.options.removable === false) expect(props.items?.some(item => item.id === 'remove')).toBe(false);
			}
			if (readonly || row.name === 'readonly') {
				for (const menu of rootMenus) act(() => fireStencilEvent(menu, 'onItemSelected', 'move-down', { force: true }));
				expect(onChange).not.toHaveBeenCalled();
			} else if (!Array.isArray(row.schema.items) && row.formData.length > 1 && option.options.orderable !== false) {
				expect(rootMenus.length).toBeGreaterThan(0);
				act(() => fireStencilEvent(rootMenus[0], 'onItemSelected', 'move-down'));
				expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0], ...row.formData.slice(2)]);
			}
		});
	});
});

describe.each(L1_SCALAR_LIST_SHAPES)('L1 scalar names: $name', row => {
	it('names the input and item actions without displaying generated item labels', () => {
		const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} />);
		for (let index = 0; index < row.formData.length; index++) {
			const item = screen.container.querySelector(`[data-schema-form-list-item="${index}"]`)!;
			expect(item.querySelector('kv-info-label')).toBeNull();
			expect(propsOf(`root_${index}`).accessibleLabel).toBe(`${row.itemName} ${index + 1}`);
			expect(item.querySelector('kv-action-menu')).not.toBeNull();
			expect(propsOf<JSX.KvActionButtonIcon>(item.querySelector('kv-action-button-icon')!).accessibleLabel).toBe(`Remove ${row.itemName} ${index + 1}`);
		}
	});
});

describe.each(L1_PREFIX_SHAPES)('L1 prefix: $name', row => {
	it('names the inputs and action without visible prefix columns', () => {
		const screen = render(<KvSchemaForm schema={ARRAY_SHAPES[0].schema} formData={ARRAY_SHAPES[0].formData} uiSchema={row.uiSchema} />);
		expect(propsOf('root_1').accessibleLabel).toBe('Broker 2');
		expect(screen.container.querySelector('[data-schema-form-list-item]')?.textContent).not.toContain('Broker');
	});
});

describe.each(L1_TUPLE_SHAPES)('L1 tuple: $name', row => {
	it('retains position labels and numbers additional items', () => {
		const tuple = ARRAY_SHAPES[3];
		const screen = render(<KvSchemaForm schema={tuple.schema} formData={tuple.formData} uiSchema={row.uiSchema} />);
		for (const [index, label] of row.labels.entries()) {
			expect(propsOf(`root_${index}`).accessibleLabel).toBe(label);
			const item = screen.container.querySelector(`[data-schema-form-list-item="${index}"]`)!;
			expect(propsOf<JSX.KvInfoLabel>(item.querySelector('kv-info-label')!).labelTitle).toBe(label);
		}
	});
});
