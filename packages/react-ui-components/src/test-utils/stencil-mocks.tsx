import { kebabCase, pickBy } from 'lodash';
import React, { ReactNode } from 'react';

// `id`, `text` and `label` are named so the lint rule for props sees the keys mocks are stored under
export type MockProps = { [prop: string]: unknown; id?: unknown; text?: unknown; label?: unknown; children?: ReactNode };

const HANDLER_PROP = /^on[A-Z]/;
const isAttributeValue = (value: unknown, prop: string) => !HANDLER_PROP.test(prop) && ['string', 'number', 'boolean'].includes(typeof value);

/**
 * The props each mock received on its latest render, keyed by `id`, else `text`, else `label`.
 * When two rendered elements share a key, the later one wins, so give elements distinct ids.
 */
export const stencilElements = new Map<string, MockProps>();

const createStencilMock = (proxyName: string) => {
	// KvTextField renders <kv-text-field>
	const tagName = kebabCase(proxyName);
	const Mock = ({ children, ...props }: MockProps) => {
		const key = props.id ?? props.text ?? props.label;
		if (typeof key === 'string' || typeof key === 'number') {
			stencilElements.set(String(key), props);
		}
		// Primitive props become data attributes (`labelTitle` is `data-label-title`) so tests can see
		// what a field passed; objects and handlers stay in `stencilElements`
		const attributes = Object.entries(pickBy(props, isAttributeValue)).reduce<Record<string, string>>(
			(result, [prop, value]) => ({ ...result, [prop === 'id' ? 'id' : `data-${kebabCase(prop)}`]: String(value) }),
			{}
		);
		return React.createElement(tagName, attributes, children);
	};
	Mock.displayName = `${proxyName}Mock`;
	return Mock;
};

const STENCIL_PROXY_NAMES = [
	'KvActionButton',
	'KvActionButtonIcon',
	'KvActionButtonSplit',
	'KvActionButtonText',
	'KvCheckbox',
	'KvFormHelpText',
	'KvIcon',
	'KvInfoLabel',
	'KvMultiSelectDropdown',
	'KvRadio',
	'KvRadioList',
	'KvRadioListItem',
	'KvSingleSelectDropdown',
	'KvSwitchButton',
	'KvTextArea',
	'KvTextField',
	'KvToggleButtonGroup',
	'KvToggleTip',
	'KvTooltip'
] as const;

export type StencilProxyName = (typeof STENCIL_PROXY_NAMES)[number];

/**
 * Stand-ins for the Stencil React proxies, for jsdom unit tests. Each renders a bare element with
 * the component's tag. Tests that need the real component's rendering, focus or keyboard behavior
 * belong in a `*.browser.test.tsx` file instead.
 *
 *     vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks);
 */
export const stencilMocks = STENCIL_PROXY_NAMES.reduce(
	(mocks, name) => ({ ...mocks, [name]: createStencilMock(name) }),
	{} as Record<StencilProxyName, ReturnType<typeof createStencilMock>>
);

/**
 * Calls the handler a mock received, the way the real component's event reaches React:
 * `fireStencilEvent('root_host', 'onTextChange', 'broker-1.local')` stands in for kv-text-field
 * emitting `textChange`. Wrap it in `act()`.
 */
export const fireStencilEvent = (key: string, handlerName: `on${string}`, detail?: unknown) => {
	const handler = stencilElements.get(key)?.[handlerName];
	if (typeof handler !== 'function') {
		throw new Error(`No ${handlerName} handler was rendered for "${key}"`);
	}
	const eventName = handlerName.charAt(2).toLowerCase() + handlerName.slice(3);
	handler(new CustomEvent(eventName, { detail }));
};
