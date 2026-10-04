import { EIconName } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady, whenKelvinReady } from '../../../test-utils/browser';
import { KvSchemaForm } from '../SchemaForm';
import { ARRAY_SHAPES, OBJECT_SHAPES } from '../test-utils/matrix';

const textValues = (value: unknown, path: (string | number)[] = []): { id: string; value: string }[] => {
	if (typeof value === 'string' || typeof value === 'number') {
		return [{ id: `root${path.length ? `_${path.join('_')}` : ''}`, value: String(value) }];
	}
	if (Array.isArray(value)) {
		return value.flatMap((item, index) => textValues(item, [...path, index]));
	}
	if (value && typeof value === 'object') {
		return Object.entries(value).flatMap(([key, item]) => textValues(item, [...path, key]));
	}
	return [];
};

const clickItemButton = async (container: HTMLElement, icon: EIconName, index: number) => {
	const host = await whenKelvinReady(container.querySelectorAll<HTMLKvActionButtonIconElement>(`kv-action-button-icon[icon="${icon}"]`)[index]);
	const action = await whenKelvinReady(host.shadowRoot!.querySelector<HTMLKvActionButtonElement>('kv-action-button'));
	await userEvent.click(action.shadowRoot!.querySelector('[part="button"]')!);
};

describe.each(ARRAY_SHAPES)('RJSF 6 renders the $name fixture in Chromium', row => {
	it('shows each item value in its real Kelvin input', async () => {
		const screen = await render(<KvSchemaForm {...row} />);
		await whenAllKelvinReady(screen.container);
		const values = textValues(row.formData);
		expect(values.length).toBeGreaterThan(0);

		for (const { id, value } of values) {
			const host = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>(`kv-text-field[id="${id}"]`));
			expect(host.shadowRoot?.querySelector('input')?.value).toBe(value);
		}
		if (row.name === 'object list with a custom inner list template') {
			expect(screen.container.querySelectorAll('[data-custom-inner-list]')).toHaveLength(3);
		}
	});
});

describe('RJSF 6 events with real Kelvin components', () => {
	it.each(OBJECT_SHAPES.filter(row => row.name.startsWith('additionalProperties')))('commits $name key edits on blur and preserves the value', async row => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const key = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_site-key'));
		onChange.mockClear();

		await userEvent.fill(key.shadowRoot!.querySelector('input')!, 'plant');
		expect(onChange).not.toHaveBeenCalled();
		await userEvent.tab();

		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual({ plant: 'lisbon' });
		const renamed = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_plant-key'));
		expect(renamed.shadowRoot?.querySelector('input')?.value).toBe('plant');
	});

	it('moves and removes the middle list item', async () => {
		const row = ARRAY_SHAPES.find(row => row.name === 'string list')!;
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);

		await clickItemButton(screen.container, EIconName.AlignBottom, 0);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(['alarms', 'telemetry', 'commands']);
		await clickItemButton(screen.container, EIconName.AlignTop, 1);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(row.formData);
		await clickItemButton(screen.container, EIconName.Delete, 1);
		await expect.poll(() => onChange.mock.lastCall?.[0].formData).toEqual(['telemetry', 'commands']);
		await expect.poll(() => screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_1')?.shadowRoot?.querySelector('input')?.value).toBe('commands');
	});

	it('changes a nested boolean at its field path and keeps its siblings', async () => {
		const row = ARRAY_SHAPES.find(row => row.name === 'object list')!;
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const choices = screen.container.querySelectorAll<HTMLKvRadioListItemElement>('kv-radio-list-item');
		expect(choices).toHaveLength(6);
		expect(choices[1].checked).toBe(false);

		await userEvent.click(choices[1].shadowRoot!.querySelector('.radio-list-item-container')!);

		await expect
			.poll(() => onChange.mock.lastCall?.[0].formData)
			.toEqual([
				{ host: 'broker-1.local', port: 1883, tls: { enabled: false } },
				{ host: 'broker-2.local', port: 8883, tls: { enabled: false } },
				{ host: 'broker-3.local', port: 1883, tls: { enabled: true } }
			]);
	});

	it('renders boolean property schemas alongside the host input', async () => {
		const row = OBJECT_SHAPES.find(row => row.name === 'boolean property schemas')!;
		const screen = await render(<KvSchemaForm {...row} />);
		const host = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_host'));

		expect(host.shadowRoot?.querySelector('input')?.value).toBe('broker-1.local');
	});
});
