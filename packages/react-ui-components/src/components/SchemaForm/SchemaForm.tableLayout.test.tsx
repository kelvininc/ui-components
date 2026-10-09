// @vitest-environment jsdom
import React, { act, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { KvSchemaForm } from './SchemaForm';
import {
	FLAT_OBJECT_SHAPES,
	L2_ELIGIBILITY_SHAPES,
	L2_PRESENTATION_SHAPES,
	REQUIRED_MARKER_TABLE_SHAPE,
	L2_LABEL_SHAPES,
	L2_DESCRIPTION_SHAPES,
	L2_ITEM_GUIDANCE_SHAPES,
	L2_REGISTRY_OVERRIDES,
	L2_NUMERIC_DISPATCH_SHAPES,
	LIST_OPTIONS,
	ERROR_SHAPES,
	BROKER_SCHEMA,
	BROKER_FORM_DATA
} from './test-utils/matrix';
import { fireStencilEvent, propsOf } from '../../test-utils';
import tableStyles from './Templates/ArrayFieldTemplate/TableLayout.module.scss';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

const mounts: { container: HTMLElement; root: ReturnType<typeof createRoot> }[] = [];
const render = (element: ReactNode) => {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);
	mounts.push({ container, root });
	act(() => root.render(element));
	return { container };
};
afterEach(() => {
	for (const { root, container } of mounts.splice(0)) {
		act(() => root.unmount());
		container.remove();
	}
});

describe.each(FLAT_OBJECT_SHAPES)('L2 table eligibility: $name', row => {
	describe.each(LIST_OPTIONS)('$name', option => {
		it.each([false, true])('respects sections opt-out=%s', optedOut => {
			const screen = render(
				<KvSchemaForm
					schema={row.schema}
					formData={row.formData}
					uiSchema={{ ...row.uiSchema, 'ui:options': { ...option.options, layout: optedOut ? 'sections' : undefined } }}
				/>
			);
			expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat && !optedOut);
		});
	});
});

it.each(L2_ELIGIBILITY_SHAPES)('L2 schema dispatch: $name', row => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={'uiSchema' in row ? row.uiSchema : undefined} />);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
});

it.each(L2_REGISTRY_OVERRIDES)('L2 registered override: $name', ({ name: _name, ...overrides }) => {
	const row = FLAT_OBJECT_SHAPES[0];
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} {...overrides} />);
	expect(screen.container.querySelector('[role="table"]')).toBeNull();
});

it.each(L2_NUMERIC_DISPATCH_SHAPES)('L2 numeric widget dispatch: $name', row => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} widgets={row.widgets} />);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
	expect(screen.container.querySelector('#root_0_retries')!.tagName).toBe(row.custom ? 'INPUT' : 'KV-TEXT-FIELD');
});

it.each(L2_PRESENTATION_SHAPES)('L2 shared headers: $name', row => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />);
	const headers = screen.container.querySelectorAll('[role="columnheader"]');
	expect(headers[1].textContent).toBe('Value');
	expect(headers[2].textContent).toBe(row.name === 'required' ? 'Name*' : 'Name');
	expect(screen.container.querySelectorAll('[data-table-cell] kv-info-label')).toHaveLength(0);
	expect(screen.container.querySelectorAll('[data-table-cell] kv-form-help-text')).toHaveLength(0);
	expect(screen.container.querySelectorAll('[data-table-cell] kv-toggle-tip')).toHaveLength(row.name === 'description' || row.name === 'help' ? row.formData.length : 0);
	if (row.name === 'description' || row.name === 'help') expect(propsOf(headers[2].querySelector('kv-toggle-tip')!).text).toBe('Starts with a letter or underscore.');
	if (row.name === 'required') expect(headers[2].getAttribute('aria-label')).toBe('Name, required');
});

it('keeps table and narrow cell markers between the title and help', () => {
	const row = REQUIRED_MARKER_TABLE_SHAPE;
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />);
	const header = screen.container.querySelector('[role="columnheader"][aria-label="Name, required"]')!;
	const labels = [header, ...screen.container.querySelectorAll(`[data-table-cell="name"] .${tableStyles.CellLabel}`)];
	expect(labels).toHaveLength(1 + row.formData.length);
	for (const label of labels) {
		const marker = label.querySelector(`.${tableStyles.Required}`)!;
		expect(marker.getAttribute('aria-hidden')).toBe('true');
		expect(marker.previousElementSibling!.textContent).toBe('Name');
		expect(marker.nextElementSibling!.tagName).toBe('KV-TOGGLE-TIP');
		expect(propsOf(marker.nextElementSibling!).text).toBe(row.uiSchema.items.name['ui:help']);
	}
});

it.each(L2_ITEM_GUIDANCE_SHAPES)('L2 item guidance: $name', row => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} formContext={row.formContext} />);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
	if (row.message) {
		const guidance = screen.container.querySelectorAll('kv-form-help-text,kv-toggle-tip');
		expect(Array.from(guidance, host => propsOf(host).helpText ?? propsOf(host).text)).toContain(row.message);
	}
	if (row.helper)
		expect(Array.from(screen.container.querySelectorAll('kv-form-help-text'), host => propsOf(host).helpText).some(text => String(text).startsWith('Default value is: '))).toBe(
			true
		);
});

it.each(L2_LABEL_SHAPES)('L2 configured labels: $name', row => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
	if (row.isFlat) expect(screen.container.querySelector('[role="columnheader"][aria-colindex="2"]')!.textContent).toBe('Name');
	else expect(screen.container.querySelector('#root_0_name')!.closest('[data-schema-form-field]')!.querySelector('kv-info-label')).toBeNull();
});

it('enables the field default helper in sections before suppressing it in cells', () => {
	const row = L2_PRESENTATION_SHAPES.find(row => row.name === 'default helper')!;
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={{ ...row.uiSchema, 'ui:options': { layout: 'sections' } }} />);
	expect(Array.from(screen.container.querySelectorAll('kv-form-help-text'), host => propsOf(host).helpText)).toContain('Default value is: LOG_LEVEL');
});

it.each(L2_DESCRIPTION_SHAPES)('L2 header description visibility: $name', row => {
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />);
	const header = screen.container.querySelectorAll('[role="columnheader"]')[1];
	const tip = header.querySelector('kv-toggle-tip');
	if (row.expectedTip) expect(propsOf(tip!).text).toBe(row.expectedTip);
	else expect(tip).toBeNull();
});

it.each(ERROR_SHAPES)('L2 cell server errors: $name', row => {
	const screen = render(<KvSchemaForm schema={BROKER_SCHEMA} formData={BROKER_FORM_DATA} extraErrors={row.extraErrors as never} displayErrors />);
	for (const message of row.messages.filter(message => message.id.includes('_brokers_'))) {
		const cell = screen.container.querySelector(`#${message.id}`)!.closest('[role="cell"]')!;
		expect(cell).not.toBeNull();
		expect(propsOf(cell.querySelector('kv-form-help-text')!).helpText).toContain(message.message);
	}
});

it('names each cell and action with its row, preserving header order and hidden values', () => {
	const row = FLAT_OBJECT_SHAPES[3];
	const screen = render(
		<KvSchemaForm
			schema={row.schema}
			formData={row.formData}
			uiSchema={{ ...row.uiSchema, 'ui:itemPrefix': 'Variable', 'items': { ...row.uiSchema?.items, 'ui:order': ['value', 'name', '*'] } }}
		/>
	);
	expect(screen.container.querySelector('[role="table"][aria-label="Variables"]')).not.toBeNull();
	expect(Array.from(screen.container.querySelectorAll('[role="columnheader"]'), node => node.textContent)).toEqual(['row', 'Value', 'Name', 'Actions']);
	expect(Array.from(screen.container.querySelectorAll('[role="rowheader"]'), node => node.textContent)).toEqual(['Variable 1', 'Variable 2', 'Variable 3']);
	expect(propsOf(screen.container.querySelector('#root_1_name')!).accessibleLabel).toBe('Name, Variable 2');
	expect(propsOf(screen.container.querySelector('#root_1_value')!).accessibleLabel).toBe('Value, Variable 2');
	expect(screen.container.querySelector('[data-schema-form-list-item="1"] [role="cell"] [id="root_1_id"]')).toBeNull();
	expect(screen.container.querySelectorAll('kv-action-menu[accessible-label]')).toHaveLength(0);
	const menu = screen.container.querySelectorAll('kv-action-menu')[1];
	expect(propsOf(menu)).toMatchObject({ accessibleLabel: 'Reorder Variable 2', triggerTabIndex: 0 });
	expect(propsOf(menu).items).toHaveLength(2);
});

it('preserves hidden values after a visible cell changes', () => {
	const row = FLAT_OBJECT_SHAPES[3];
	const onChange = vi.fn();
	const screen = render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} onChange={onChange} />);
	onChange.mockClear();
	act(() => fireStencilEvent(screen.container.querySelector('#root_1_value')!, 'onTextChange', 'broker-2.local'));
	expect(onChange.mock.lastCall?.[0].formData[1]).toEqual({ id: 'variable-2', name: 'BROKER_HOST', value: 'broker-2.local' });
});
