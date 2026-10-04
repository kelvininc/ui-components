// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, stencilElements, stencilMocks } from './stencil-mocks';

const { KvTextField, KvTooltip } = stencilMocks;

describe('stencilMocks', () => {
	let container: HTMLDivElement;
	let root: Root;

	beforeEach(() => {
		vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(async () => {
		await act(async () => root.unmount());
		container.remove();
		stencilElements.clear();
		vi.unstubAllGlobals();
	});

	it("renders the component's tag with primitive props as data attributes", async () => {
		await act(async () => root.render(<KvTextField id="root_host" value="broker-1.local" labelTitle="Host" disabled={false} />));

		const field = container.querySelector('kv-text-field#root_host');
		expect(field?.getAttribute('data-value')).toBe('broker-1.local');
		expect(field?.getAttribute('data-label-title')).toBe('Host');
		expect(field?.getAttribute('data-disabled')).toBe('false');
	});

	it('fires the handler a mock received, as a CustomEvent named after the event', async () => {
		const onTextChange = vi.fn();
		await act(async () => root.render(<KvTextField id="root_host" onTextChange={onTextChange} />));

		await act(async () => fireStencilEvent('root_host', 'onTextChange', 'broker-2.local'));

		expect(onTextChange).toHaveBeenCalledOnce();
		const [event] = onTextChange.mock.calls[0];
		expect(event).toBeInstanceOf(CustomEvent);
		expect(event.type).toBe('textChange');
		expect(event.detail).toBe('broker-2.local');
	});

	it('names the element when it has no such handler', () => {
		expect(() => fireStencilEvent('root_port', 'onTextChange', '1883')).toThrow('No onTextChange handler was rendered for "root_port"');
	});

	it('renders children inside wrapper components', async () => {
		await act(async () =>
			root.render(
				<KvTooltip text="Broker address">
					<span>Host</span>
				</KvTooltip>
			)
		);

		expect(container.querySelector('kv-tooltip')?.textContent).toBe('Host');
	});
});
