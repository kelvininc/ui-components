import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady, whenKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { MULTI_SELECT_SHAPES, OBJECT_SHAPES } from '../test-utils/matrix';

describe.each(OBJECT_SHAPES.filter(row => row.name.startsWith('additionalProperties')))('RJSF upgrade regression in Chromium: $name', row => {
	it('renders and edits additional properties after external data updates', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} formData={{}} onChange={onChange} />);
		await screen.rerender(<KvSchemaForm schema={row.schema} formData={{ site: 'lisbon', plant: 'north' }} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const plant = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_plant'));
		expect(plant.shadowRoot?.querySelector('input')?.value).toBe('north');

		await screen.rerender(<KvSchemaForm schema={row.schema} formData={{ plant: 'south' }} onChange={onChange} />);
		expect(screen.container.querySelector('kv-text-field#root_site')).toBeNull();
		const replacement = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_plant'));
		await expect.poll(() => replacement.shadowRoot?.querySelector('input')?.value).toBe('south');
		await userEvent.fill(replacement.shadowRoot!.querySelector('input')!, 'east');
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual({ plant: 'east' });
	});
});

describe.each(MULTI_SELECT_SHAPES)('RJSF upgrade regression in Chromium: $name', row => {
	it('displays and selects multi-select labels', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
		const host = await whenKelvinReady(screen.container.querySelector<HTMLKvMultiSelectDropdownElement>('kv-multi-select-dropdown'));
		const dropdown = await whenKelvinReady(host.querySelector<HTMLKvDropdownElement>('kv-dropdown'));
		const field = await whenKelvinReady(dropdown.querySelector<HTMLKvTextFieldElement>('kv-text-field'));
		const input = field.shadowRoot!.querySelector('input')!;
		expect(input.value).toBe(row.labels[0]);
		await userEvent.click(input);

		const select = await whenKelvinReady(document.querySelector<HTMLKvSelectMultiOptionsElement>('kv-select-multi-options'));
		const list = await whenKelvinReady(select.shadowRoot!.querySelector<HTMLKvVirtualizedListElement>('kv-virtualized-list'));
		await expect.poll(() => list.shadowRoot?.querySelectorAll('kv-select-option').length).toBe(row.labels.length);
		const options = [...list.shadowRoot!.querySelectorAll<HTMLKvSelectOptionElement>('kv-select-option')];
		await Promise.all(options.map(option => whenKelvinReady(option)));
		expect(options.map(option => option.shadowRoot!.querySelector('[part="label"]')?.textContent)).toEqual(row.labels);
		for (const option of options) {
			await expect.element(option.shadowRoot!.querySelector<HTMLElement>('[part="label"]')!).toBeVisible();
		}
		await userEvent.click(options[1].shadowRoot!.querySelector('[part="option-container"]')!);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(['north-line', 'south-line']);
	});
});

describe.each(OBJECT_SHAPES.filter(row => row.name === 'nested optional fields in additional property'))('RJSF upgrade regression in Chromium: $name', row => {
	it('clears an optional nested integer without creating a validation error', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} liveValidate onChange={onChange} />);
		const field = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_plant_retries'));
		expect(field.shadowRoot?.querySelector('input')?.value).toBe('3');
		onChange.mockClear();
		await userEvent.fill(field.shadowRoot!.querySelector('input')!, '');

		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual({ plant: { site: 'lisbon', retries: undefined } });
		expect(onChange.mock.lastCall?.[0].errors).toEqual([]);
	});
});
