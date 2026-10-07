import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { KvSchemaForm } from '../components/SchemaForm/SchemaForm';
import { BROKER_FORM_DATA, BROKER_SCHEMA } from '../components/SchemaForm/test-utils/matrix';
import { EIconName, EInputFieldType } from '@kelvininc/ui-components';
import { KvIcon, KvTextField } from '../stencil-generated';
import { whenAllKelvinReady, whenKelvinReady } from './browser';

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

	it('emits the right action when a password input is disabled', async () => {
		const onRightActionClick = vi.fn();
		const screen = await render(<KvTextField type={EInputFieldType.Password} inputDisabled actionIcon={EIconName.Eye} onRightActionClick={onRightActionClick} />);
		const host = await whenKelvinReady(screen.container.querySelector('kv-text-field'));

		expect(host.shadowRoot?.querySelector('input')?.disabled).toBe(true);
		await userEvent.click(host.shadowRoot!.querySelector('kv-icon')!);

		expect(onRightActionClick).toHaveBeenCalledOnce();
	});

	it('renders with the design tokens, the Night theme and a desktop viewport', () => {
		expect(getComputedStyle(document.body).getPropertyValue('--color-gray-50').trim()).not.toBe('');
		expect(document.body.getAttribute('mode')).toBe('night');
		expect(window.innerWidth).toBe(1280);
	});

	it.each([EIconName.Delete, EIconName.InfoOutline])('draws %s from the symbols file', async name => {
		const screen = await render(<KvIcon name={name} />);
		const icon = await whenKelvinReady(screen.container.querySelector<HTMLElement>('kv-icon'));

		const symbol = icon.shadowRoot?.querySelector('use');
		expect(symbol).toBeInstanceOf(SVGUseElement);
		await expect.poll(() => symbol?.getBBox().width ?? 0).toBeGreaterThan(0);
		await expect.poll(() => symbol?.getBBox().height ?? 0).toBeGreaterThan(0);
	});

	it.each([
		{ color: '#c00000', rgb: [192, 0, 0] },
		{ color: '#00c000', rgb: [0, 192, 0] }
	])('paints the outline and glyph with customColor=$color', async ({ color, rgb }) => {
		const screen = await render(<KvIcon name={EIconName.InfoOutline} customColor={color} />);
		const icon = await whenKelvinReady(screen.container.querySelector<HTMLElement>('kv-icon'));
		const svg = icon.shadowRoot!.querySelector('svg')!;
		const href = svg.querySelector('use')!.getAttribute('href')!;
		const [url, id] = href.split('#');
		const response = await fetch(url);
		expect(response.ok).toBe(true);
		const sprite = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
		const symbol = sprite.getElementById(id)!;
		const fill = getComputedStyle(svg).fill;
		const iconColor = getComputedStyle(icon).getPropertyValue('--icon-color');
		// Rasterize the production symbol with the real KvIcon's computed paint.
		const image = new Image();
		image.src = `data:image/svg+xml,${encodeURIComponent(
			`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${symbol.getAttribute('viewBox')}" style="fill:${fill};--icon-color:${iconColor}">${
				symbol.innerHTML
			}</svg>`
		)}`;
		await image.decode();
		const canvas = document.createElement('canvas');
		canvas.width = canvas.height = 24;
		const context = canvas.getContext('2d')!;
		context.drawImage(image, 0, 0);
		for (const [x, y] of [
			[12, 3],
			[12, 13]
		])
			expect(Array.from(context.getImageData(x, y, 1, 1).data)).toEqual([...rgb, 255]);
		expect(context.getImageData(12, 5, 1, 1).data[3]).toBe(0);
	});

	it('waits for every Kelvin component in a container', async () => {
		const screen = await render(<KvSchemaForm schema={BROKER_SCHEMA} formData={BROKER_FORM_DATA} />);

		await whenAllKelvinReady(screen.container);

		const hosts = Array.from(screen.container.querySelectorAll('*')).filter(element => element.localName.startsWith('kv-'));
		expect(hosts.length).toBeGreaterThan(0);
		expect(hosts.filter(host => !host.classList.contains('hydrated')).map(host => host.outerHTML)).toEqual([]);
	});

	it('waits for a child added while its parent becomes ready', async () => {
		const screen = await render(<KvTextField accessibleLabel="Broker host" />);
		const parent = screen.container.querySelector('kv-text-field')!;
		const child = document.createElement('kv-text-field');
		child.accessibleLabel = 'Client identifier';
		const original = parent.componentOnReady;
		parent.componentOnReady = async () => {
			const host = await original.call(parent);
			parent.append(child);
			return host;
		};
		try {
			await whenAllKelvinReady(screen.container);
			expect(parent.classList.contains('hydrated')).toBe(true);
			expect(child.classList.contains('hydrated')).toBe(true);
			expect(child.shadowRoot?.querySelector('input')).toBeInstanceOf(HTMLInputElement);
		} finally {
			parent.componentOnReady = original;
		}
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

	it('says so when the query for the element matched nothing', async () => {
		await expect(whenKelvinReady(document.querySelector<HTMLElement>('kv-text-field#not-rendered'))).rejects.toThrow('The query for the element matched nothing');
	});
});
