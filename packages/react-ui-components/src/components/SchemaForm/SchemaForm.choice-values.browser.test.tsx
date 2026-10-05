import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady, whenKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import { CHOICE_SCHEMAS, CHOICE_VALUE_SHAPES, CUSTOM_DROPDOWN_SHAPES, OPTION_SOURCES, VALUE_CASES, choiceForm } from './test-utils/matrix';

const menuOptions = async () => {
	const select = await whenKelvinReady(document.querySelector<HTMLKvSelectMultiOptionsElement>('kv-select-multi-options'));
	const list = await whenKelvinReady(select.shadowRoot!.querySelector<HTMLKvVirtualizedListElement>('kv-virtualized-list'));
	await expect.poll(() => list.shadowRoot?.querySelectorAll('kv-select-option').length ?? 0).toBeGreaterThan(0);
	const options = Array.from(list.shadowRoot!.querySelectorAll<HTMLKvSelectOptionElement>('kv-select-option'));
	await Promise.all(options.map(option => whenKelvinReady(option)));
	return options;
};

describe.each(CHOICE_VALUE_SHAPES)('real typed choice: $name', row => {
	it('renders the initial label and preserves raw JSON values through actual option clicks', async () => {
		const onChange = vi.fn();
		const initial = structuredClone(row.values[0]);
		const screen = await render(
			<KvSchemaForm schema={choiceForm(row)} uiSchema={{ choice: { 'ui:widget': 'select' } }} formData={{ choice: row.multiple ? [initial] : initial }} onChange={onChange} />
		);
		await whenAllKelvinReady(screen.container);
		const trigger = screen.getByRole('textbox', { name: row.schema.title, exact: true });
		await expect.element(trigger).toHaveValue(row.labels[0]);
		await trigger.click();
		let options = await menuOptions();
		expect(options.map(option => option.label)).toEqual(row.labels);
		expect(options.map(option => option.value)).toEqual(['choice-0', 'choice-1']);
		expect(options[0].selected || options[0].state === 'selected').toBe(true);
		onChange.mockClear();
		await userEvent.click(options[1].shadowRoot!.querySelector('[part="option-container"]')!);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual(row.multiple ? row.values : row.values[1]);
		expect(onChange).toHaveBeenCalledOnce();
		await expect.element(trigger).toHaveValue(row.multiple ? row.labels[0] : row.labels[1]);

		if (!row.multiple) await trigger.click();
		options = await menuOptions();
		onChange.mockClear();
		await userEvent.click(options[0].shadowRoot!.querySelector('[part="option-container"]')!);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual(row.multiple ? [row.values[1]] : row.values[0]);
		expect(onChange).toHaveBeenCalledOnce();
		await expect.element(trigger).toHaveValue(row.multiple ? row.labels[1] : row.labels[0]);
	});
});

describe.each([false, true])('real multiple=%s select clear', multiple => {
	it.each(VALUE_CASES)('commits ui:emptyValue $name once', async ({ value }) => {
		const schema = multiple ? { type: 'array' as const, title: 'Topics', uniqueItems: true, items: CHOICE_SCHEMAS[1].schema } : CHOICE_SCHEMAS[1].schema;
		const onChange = vi.fn();
		const screen = await render(
			<KvSchemaForm
				schema={choiceForm({ schema })}
				uiSchema={{ choice: { 'ui:widget': 'select', 'ui:emptyValue': value, 'clearSelectionLabel': 'Clear topics', 'ui:options': { allowClearInputs: true } } }}
				formData={{ choice: multiple ? ['at-most-once'] : 'at-most-once' }}
				onChange={onChange}
			/>
		);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('textbox', { name: schema.title, exact: true }).click();
		await menuOptions();
		onChange.mockClear();
		await page.getByRole('button', { name: 'Clear topics', exact: true }).click();
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual(value);
		expect(onChange).toHaveBeenCalledOnce();
	});
});

describe.each(OPTION_SOURCES)('real clear policy from $name', source => {
	it('omits the clear action when the policy is explicitly false', async () => {
		const props = source.build('choice', { allowClearInputs: false });
		const screen = await render(<KvSchemaForm schema={choiceForm(CHOICE_SCHEMAS[1])} {...props} formData={{ choice: 'at-most-once' }} />);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('textbox', { name: 'QoS', exact: true }).click();
		await menuOptions();
		expect(page.getByRole('button', { name: 'Clear all', exact: true }).query()).toBeNull();
	});
});

describe.each(CUSTOM_DROPDOWN_SHAPES)('real custom tree: $name', row => {
	it('selects the original leaf key rather than interpreting it as an enum index', async () => {
		const tree = {
			topics: {
				value: 'topics',
				label: 'Topics',
				options: { [row.key]: { value: row.key, label: 'North line' }, 'south-line': { value: 'south-line', label: 'South line' } }
			}
		};
		const schema = { type: 'array' as const, title: 'Assets', uniqueItems: true, items: { type: 'string' as const, enum: ['north-line', 'south-line'] } };
		const onChange = vi.fn();
		const screen = await render(
			<KvSchemaForm schema={choiceForm({ schema })} uiSchema={{ choice: { multiSubOptions: tree } }} formData={{ choice: [] }} onChange={onChange} />
		);
		await whenAllKelvinReady(screen.container);
		await screen.getByRole('textbox', { name: 'Assets', exact: true }).click();
		const options = await menuOptions();
		const leaf = options.find(option => option.label === 'North line')!;
		expect(leaf.value).toBe(row.key);
		await userEvent.click(leaf.shadowRoot!.querySelector('[part="option-container"]')!);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData.choice).toEqual([row.key]);
		expect(onChange).toHaveBeenCalledOnce();
	});
});
