import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { KvSchemaForm } from '../components/SchemaForm/SchemaForm';
import { BROKER_FORM_DATA, BROKER_SCHEMA } from '../components/SchemaForm/test-utils/matrix';
import { KvTextField } from '../stencil-generated';
import { whenKelvinReady } from './browser';

// The browser project renders the real Stencil components, so tests here can check what jsdom
// can't: shadow roots, real focus and real keyboard input
describe('Kelvin components in the browser project', () => {
	it('renders kv-text-field, focuses its input and receives typing', async () => {
		const onTextChange = vi.fn();
		const screen = await render(<KvTextField placeholder="Broker host" onTextChange={event => onTextChange(event.detail)} />);
		const host = await whenKelvinReady(screen.container.querySelector('kv-text-field')!);
		const input = host.shadowRoot?.querySelector('input');
		expect(input).toBeInstanceOf(HTMLInputElement);

		await host.focusInput();
		expect(host.shadowRoot?.activeElement).toBe(input);

		await userEvent.keyboard('broker-1.local');
		await expect.poll(() => onTextChange.mock.lastCall?.[0]).toBe('broker-1.local');
	});

	it('renders a SchemaForm, styles included, with the real components', async () => {
		const screen = await render(<KvSchemaForm schema={BROKER_SCHEMA} formData={BROKER_FORM_DATA} />);
		const host = await whenKelvinReady(screen.container.querySelector<HTMLKvTextFieldElement>('kv-text-field#root_brokers_1_host')!);

		expect(host.shadowRoot?.querySelector('input')?.value).toBe('broker-2.local');
	});

	it('names the element when it never becomes a rendered Kelvin component', async () => {
		const host = document.createElement('kv-not-a-component');

		await expect(whenKelvinReady(host, 50)).rejects.toThrow("<kv-not-a-component> wasn't defined and rendered within 50ms");
	});
});
