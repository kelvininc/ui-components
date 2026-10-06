// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { WidgetProps } from '@rjsf/utils';
import { isEqual } from 'lodash';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf } from '../../test-utils';
import { KvSchemaForm } from './SchemaForm';
import { CHOICE_SCHEMAS, CHOICE_VALUE_SHAPES, CUSTOM_DROPDOWN_SHAPES, OPTION_SOURCES, VALUE_CASES, choiceForm } from './test-utils/matrix';

vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);

type DropdownProps = {
	options: Record<string, { value: unknown; label: string; disabled?: boolean }>;
	selectedOption?: string | number;
	selectedOptions?: Record<string, boolean>;
	selectionClearable?: boolean;
	required?: boolean;
	displayValue?: string;
};
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

describe.each(CHOICE_SCHEMAS)('choice values: $name', row => {
	describe.each([false, true])('required=%s', required => {
		it.each(VALUE_CASES)('keeps $name separate from unset', async ({ value }) => {
			await act(async () =>
				root.render(<KvSchemaForm schema={choiceForm(row, { required })} uiSchema={{ choice: { 'ui:widget': 'select' } }} formData={{ choice: value }} />)
			);
			const props = propsOf<DropdownProps>('root_choice');
			const keys = Object.keys(props.options);
			const index = row.values.findIndex(option => isEqual(option, value));
			expect(keys).toHaveLength(row.values.length);
			expect(Object.values(props.options).map(option => option.value)).toEqual(keys);
			expect(props.selectedOption).toBe(index === -1 ? undefined : keys[index]);
			expect(props.required).toBe(required);
		});
	});
});

describe.each(CHOICE_VALUE_SHAPES)('typed enum: $name', row => {
	it('round trips every option and recognizes independently cloned values', async () => {
		const onChange = vi.fn();
		const initial = structuredClone(row.values[0]);
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={choiceForm(row)}
					uiSchema={{ choice: { 'ui:widget': 'select' } }}
					formData={{ choice: row.multiple ? [initial] : initial }}
					onChange={onChange}
				/>
			)
		);
		const dropdown = container.querySelector(row.multiple ? 'kv-multi-select-dropdown' : 'kv-single-select-dropdown')!;
		const props = propsOf<DropdownProps>(dropdown);
		const keys = Object.keys(props.options);
		expect(keys).toHaveLength(row.values.length);
		expect(Object.values(props.options).map(option => option.value)).toEqual(keys);
		expect(Object.values(props.options).map(option => option.label)).toEqual(row.labels);
		expect(row.multiple ? props.selectedOptions : props.selectedOption).toEqual(row.multiple ? { [keys[0]]: true } : keys[0]);
		for (const index of [1, 0]) {
			onChange.mockClear();
			await act(async () => fireStencilEvent(dropdown, row.multiple ? 'onOptionsSelected' : 'onOptionSelected', row.multiple ? { [keys[index]]: true } : keys[index]));
			expect(onChange).toHaveBeenCalledOnce();
			expect(onChange.mock.lastCall?.[0].formData.choice).toEqual(row.multiple ? [row.values[index]] : row.values[index]);
		}
	});
	it.each([
		{ name: 'disabled', disabled: true },
		{ name: 'readonly', readonly: true }
	])('refuses changes when $name', async flags => {
		const onChange = vi.fn();
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={choiceForm(row)}
					uiSchema={{ choice: { 'ui:widget': 'select' } }}
					formData={{ choice: row.multiple ? [row.values[0]] : row.values[0] }}
					onChange={onChange}
					{...flags}
				/>
			)
		);
		const dropdown = container.querySelector(row.multiple ? 'kv-multi-select-dropdown' : 'kv-single-select-dropdown')!;
		const key = Object.keys(propsOf<DropdownProps>(dropdown).options)[1];
		expect(() => fireStencilEvent(dropdown, row.multiple ? 'onOptionsSelected' : 'onOptionSelected', row.multiple ? { [key]: true } : key)).toThrow(/is disabled/);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe.each([false, true])('clearing a multiple=%s select', multiple => {
	it.each(VALUE_CASES)('honors $name as ui:emptyValue', async ({ value }) => {
		const schema = multiple ? { type: 'array' as const, title: 'Topics', uniqueItems: true, items: CHOICE_SCHEMAS[1].schema } : CHOICE_SCHEMAS[1].schema;
		const onChange = vi.fn();
		await act(async () =>
			root.render(
				<KvSchemaForm
					schema={choiceForm({ schema })}
					uiSchema={{ choice: { 'ui:widget': 'select', 'ui:emptyValue': value } }}
					formData={{ choice: multiple ? ['at-most-once'] : 'at-most-once' }}
					onChange={onChange}
				/>
			)
		);
		const dropdown = container.querySelector(multiple ? 'kv-multi-select-dropdown' : 'kv-single-select-dropdown')!;
		await act(async () => fireStencilEvent(dropdown, multiple ? 'onOptionsSelected' : 'onOptionSelected', multiple ? {} : undefined));
		expect(onChange).toHaveBeenCalledOnce();
		expect(onChange.mock.lastCall?.[0].formData.choice).toEqual(value);
	});
	it('uses the control default when emptyValue is absent', async () => {
		const schema = multiple ? { type: 'array' as const, title: 'Topics', uniqueItems: true, items: CHOICE_SCHEMAS[1].schema } : CHOICE_SCHEMAS[1].schema;
		const onChange = vi.fn();
		await act(async () =>
			root.render(<KvSchemaForm schema={choiceForm({ schema })} formData={{ choice: multiple ? ['at-most-once'] : 'at-most-once' }} onChange={onChange} />)
		);
		await act(async () => fireStencilEvent('root_choice', multiple ? 'onOptionsSelected' : 'onOptionSelected', multiple ? {} : undefined));
		expect(onChange.mock.lastCall?.[0].formData.choice).toEqual(multiple ? [] : undefined);
	});
});

describe.each(OPTION_SOURCES)('select clear policy from $name', source => {
	it('respects an explicit false', async () => {
		const options = source.build('choice', { allowClearInputs: false });
		await act(async () => root.render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[1])} {...options} formData={{ choice: 'at-most-once' }} />));
		expect(propsOf<DropdownProps>('root_choice').selectionClearable).toBe(false);
	});
});

it('lets a field-level false override global and context true', async () => {
	const globalPolicy = OPTION_SOURCES[1].build('choice', { allowClearInputs: true });
	await act(async () =>
		root.render(
			<KvSchemaForm
				schema={choiceForm(CHOICE_SCHEMAS[1])}
				uiSchema={{ ...globalPolicy.uiSchema, choice: { 'ui:options': { allowClearInputs: false } } }}
				formContext={{ allowClearInputs: true }}
			/>
		)
	);
	expect(propsOf<DropdownProps>('root_choice').selectionClearable).toBe(false);
});

describe.each(CUSTOM_DROPDOWN_SHAPES)('custom dropdown $name', row => {
	it('preserves nested keys even when enumOptions also exist', async () => {
		const tree = { topics: { value: 'topics', label: 'Topics', options: { [row.key]: { value: row.key, label: 'North line' } } } };
		const schema = { type: 'array' as const, title: 'Assets', uniqueItems: true, items: { type: 'string' as const, enum: ['north-line', 'south-line'] } };
		const onChange = vi.fn();
		await act(async () =>
			root.render(<KvSchemaForm schema={choiceForm({ schema })} uiSchema={{ choice: { multiSubOptions: tree } }} formData={{ choice: [row.key] }} onChange={onChange} />)
		);
		expect(propsOf<DropdownProps>('root_choice').options).toEqual(tree);
		expect(propsOf<DropdownProps>('root_choice').selectedOptions).toEqual({ [row.key]: true });
		await act(async () => fireStencilEvent('root_choice', 'onOptionsSelected', { [row.key]: true }));
		expect(onChange.mock.lastCall?.[0].formData.choice).toEqual([row.key]);
	});
});

it('preserves the display callback raw value and legacy option view', async () => {
	const displayValue = vi.fn((value: string, options: DropdownProps['options']) => 'Selected: ' + options[value].label);
	await act(async () => root.render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[1])} uiSchema={{ choice: { displayValue } }} formData={{ choice: 'at-most-once' }} />));
	expect(displayValue.mock.lastCall?.[0]).toBe('at-most-once');
	expect(displayValue.mock.lastCall?.[1]['at-most-once'].value).toBe('at-most-once');
	expect(propsOf<DropdownProps>('root_choice').displayValue).toBe('Selected: at-most-once');
});

describe.each([false, true])('BooleanField hideError=%s', hideError => {
	it('forwards rawErrors and hideError to a function widget', async () => {
		let observed: WidgetProps | undefined;
		const Probe = (props: WidgetProps) => {
			observed = props;
			return <span>TLS</span>;
		};
		await act(async () =>
			root.render(
				<KvSchemaForm<Record<string, unknown>>
					schema={choiceForm(CHOICE_SCHEMAS[0])}
					uiSchema={{ choice: { 'ui:widget': Probe, 'ui:hideError': hideError } }}
					formData={{ choice: false }}
					extraErrors={{ choice: { __errors: ['TLS policy unavailable.'] } }}
					displayErrors
				/>
			)
		);
		expect(observed?.rawErrors).toEqual(['TLS policy unavailable.']);
		expect(observed?.hideError).toBe(hideError);
	});
});
