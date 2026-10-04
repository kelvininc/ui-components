// @vitest-environment jsdom

import React, { act, createRef, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireStencilEvent, propsOf, stencilMocks } from './stencil-mocks';

const { KvActionButtonIcon, KvTextField, KvTooltip } = stencilMocks;

describe('stencilMocks', () => {
	let container: HTMLDivElement;
	let root: Root;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(async () => {
		await act(async () => root.unmount());
		container.remove();
	});

	it("renders the component's tag with other primitive props as data attributes", async () => {
		await act(async () => root.render(<KvTextField id="root_host" value="broker-1.local" labelTitle="Host" disabled={false} />));

		const field = container.querySelector('kv-text-field#root_host');
		expect(field?.getAttribute('data-value')).toBe('broker-1.local');
		expect(field?.getAttribute('data-label-title')).toBe('Host');
		// Values are strings to compare, not flags: `[data-disabled]` matches an enabled field too
		expect(field?.getAttribute('data-disabled')).toBe('false');
	});

	it('keeps id, slot, role, aria-* and data-* attributes as they are, and renders className as class', async () => {
		await act(async () =>
			root.render(
				<KvActionButtonIcon id="remove-broker-2" slot="actions" role="menuitem" aria-label="Remove broker 2" data-array-action="remove" className="toolbar-button" />
			)
		);

		const button = container.querySelector('kv-action-button-icon');
		expect(button?.getAttribute('id')).toBe('remove-broker-2');
		expect(button?.getAttribute('slot')).toBe('actions');
		expect(button?.getAttribute('role')).toBe('menuitem');
		expect(button?.getAttribute('aria-label')).toBe('Remove broker 2');
		expect(button?.getAttribute('data-array-action')).toBe('remove');
		expect(button?.getAttribute('class')).toBe('toolbar-button');
	});

	it('forwards its ref to the rendered element', async () => {
		const ref = createRef<HTMLElement>();
		await act(async () => root.render(<KvTextField id="root_host" ref={ref} />));

		expect(ref.current).toBe(container.querySelector('kv-text-field#root_host'));
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

	it('sends the event from the rendered element, bubbling and composed like a Stencil event', async () => {
		// RJSF's move handler blurs the button that fired it
		const onClickButton = vi.fn((event: Event) => (event.currentTarget as HTMLElement).blur());
		await act(async () => root.render(<KvActionButtonIcon id="move-down-1" onClickButton={onClickButton} />));

		await act(async () => fireStencilEvent('move-down-1', 'onClickButton'));

		const [event] = onClickButton.mock.calls[0];
		const button = container.querySelector('#move-down-1');
		expect(event.target).toBe(button);
		expect(event.currentTarget).toBe(button);
		expect(event.bubbles).toBe(true);
		expect(event.composed).toBe(true);
	});

	it('reaches a control with no key through its element', async () => {
		const onClickButton = vi.fn();
		await act(async () => root.render(<KvActionButtonIcon icon="kv-delete" data-array-action="remove" onClickButton={onClickButton} />));
		const button = container.querySelector('[data-array-action="remove"]')!;

		expect(propsOf(button).icon).toBe('kv-delete');
		await act(async () => fireStencilEvent(button, 'onClickButton'));

		expect(onClickButton).toHaveBeenCalledOnce();
	});

	it('keys a control by its accessibleLabel before its text or label', async () => {
		const onClickButton = vi.fn();
		await act(async () => root.render(<KvActionButtonIcon accessibleLabel="Remove broker 2" label="Remove" onClickButton={onClickButton} />));

		await act(async () => fireStencilEvent('Remove broker 2', 'onClickButton'));

		expect(onClickButton).toHaveBeenCalledOnce();
	});

	it('forgets a control once it unmounts', async () => {
		await act(async () => root.render(<KvTextField id="root_brokers_1_host" onTextChange={vi.fn()} />));
		await act(async () => root.render(<></>));

		expect(() => fireStencilEvent('root_brokers_1_host', 'onTextChange', 'broker-2.local')).toThrow('No Stencil mock is rendered under "root_brokers_1_host"');
	});

	it('follows a control whose id changes', async () => {
		const onTextChange = vi.fn();
		await act(async () => root.render(<KvTextField id="root_brokers_1_host" onTextChange={onTextChange} />));
		await act(async () => root.render(<KvTextField id="root_brokers_0_host" onTextChange={onTextChange} />));

		expect(() => fireStencilEvent('root_brokers_1_host', 'onTextChange')).toThrow('No Stencil mock is rendered under "root_brokers_1_host"');
		await act(async () => fireStencilEvent('root_brokers_0_host', 'onTextChange', 'broker-1.local'));
		expect(onTextChange).toHaveBeenCalledOnce();
	});

	it('names the component when the handler is missing', async () => {
		await act(async () => root.render(<KvTooltip text="TLS" />));

		expect(() => fireStencilEvent('TLS', 'onClickCheckbox')).toThrow('<kv-tooltip> "TLS" (KvTooltip) has no onClickCheckbox handler');
	});

	it('keeps a control reachable while another with the same key unmounts', async () => {
		const first = vi.fn();
		const second = vi.fn();
		let hideSecond = () => {};
		const SecondButton = () => {
			const [isShown, setShown] = useState(true);
			hideSecond = () => setShown(false);
			return isShown ? <KvActionButtonIcon label="Remove" onClickButton={second} /> : null;
		};
		await act(async () =>
			root.render(
				<>
					<KvActionButtonIcon label="Remove" onClickButton={first} />
					<SecondButton />
				</>
			)
		);

		await act(async () => hideSecond());
		await act(async () => fireStencilEvent('Remove', 'onClickButton'));

		expect(first).toHaveBeenCalledOnce();
		expect(second).not.toHaveBeenCalled();
	});

	it('reaches the control mounted last under a shared key, even after an earlier one re-renders', async () => {
		const first = vi.fn();
		const second = vi.fn();
		let rerenderFirst = () => {};
		const FirstButton = () => {
			const [, setRenders] = useState(0);
			rerenderFirst = () => setRenders(renders => renders + 1);
			return <KvActionButtonIcon label="Remove" onClickButton={first} />;
		};
		await act(async () =>
			root.render(
				<>
					<FirstButton />
					<KvActionButtonIcon label="Remove" onClickButton={second} />
				</>
			)
		);

		await act(async () => rerenderFirst());
		await act(async () => fireStencilEvent('Remove', 'onClickButton'));

		expect(second).toHaveBeenCalledOnce();
		expect(first).not.toHaveBeenCalled();
	});

	it('says so when the query for an element matched nothing', () => {
		expect(() => fireStencilEvent(container.querySelector('kv-text-field'), 'onTextChange')).toThrow('The query for the element matched nothing');
		expect(() => propsOf(container.querySelector('kv-text-field'))).toThrow('The query for the element matched nothing');
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

// These two tests run as a pair, in order: the second checks what the first left behind
describe('stencilMocks between tests', { shuffle: false }, () => {
	let leftMounted: Element | null = null;

	it('renders a control and leaves it mounted', async () => {
		const container = document.createElement('div');
		await act(async () => createRoot(container).render(<KvTextField id="root_left_mounted" onTextChange={vi.fn()} />));
		leftMounted = container.querySelector('kv-text-field');

		expect(propsOf('root_left_mounted').id).toBe('root_left_mounted');
		expect(propsOf(leftMounted).id).toBe('root_left_mounted');
	});

	it("doesn't see the control the previous test left mounted, by key or by element", () => {
		expect(leftMounted, 'run this describe as a whole: the previous test mounts the control').not.toBeNull();
		expect(() => propsOf('root_left_mounted')).toThrow('No Stencil mock is rendered under "root_left_mounted"');
		expect(() => propsOf(leftMounted)).toThrow("<kv-text-field> isn't a rendered Stencil mock");
	});
});
