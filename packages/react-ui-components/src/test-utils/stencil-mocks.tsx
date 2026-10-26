import { kebabCase } from 'lodash';
import React, { MutableRefObject, ReactNode, Ref, useCallback, useLayoutEffect, useRef } from 'react';

// `id`, `accessibleLabel`, `text` and `label` are named so the lint rule for props sees the keys mocks are stored under
export type MockProps = {
	[prop: string]: unknown;
	id?: unknown;
	accessibleLabel?: unknown;
	text?: unknown;
	label?: unknown;
	children?: ReactNode;
	ref?: Ref<HTMLElement>;
};

/** One mounted mock. The object lives as long as the mock does; each render refreshes its key and props */
type MockInstance = { proxyName: StencilProxyName; tagName: string; key?: string; props: MockProps; element?: HTMLElement };

const HANDLER_PROP = /^on[A-Z]/;
// Attributes tests query by (roles, names, data hooks) keep their names
const PASS_THROUGH_PROP = /^(aria-|data-)/;
const RENAMED_PROPS: Record<string, string> = { className: 'class', tabIndex: 'tabindex', id: 'id', slot: 'slot', role: 'role' };

// Every mounted mock under each key, in mount order; a lookup takes the last one mounted
const instancesByKey = new Map<string, MockInstance[]>();
let instancesByElement = new WeakMap<Element, MockInstance>();

// Adds a mock under a key once; registering it again keeps its place in the mount order
const register = (key: string, instance: MockInstance) => {
	const registered = instancesByKey.get(key) ?? [];
	if (!registered.includes(instance)) {
		instancesByKey.set(key, [...registered, instance]);
	}
};
const unregister = (key: string, instance: MockInstance) => {
	const remaining = (instancesByKey.get(key) ?? []).filter(registered => registered !== instance);
	if (remaining.length > 0) {
		instancesByKey.set(key, remaining);
	} else {
		instancesByKey.delete(key);
	}
};

const keyOf = ({ id, accessibleLabel, text, label }: MockProps) => {
	const key = id ?? accessibleLabel ?? text ?? label;
	return typeof key === 'string' || typeof key === 'number' ? String(key) : undefined;
};

/**
 * `id`, `slot`, `role`, `aria-*` and `data-*` keep their names, `className` becomes `class`,
 * `tabIndex` becomes `tabindex`, and any other primitive prop becomes a data attribute
 * (`labelTitle` is `data-label-title`). Values are strings to compare:
 * `data-disabled="false"` still matches `[data-disabled]`. Objects and handlers stay out of the
 * DOM; `propsOf` returns them.
 */
const toAttributes = (props: MockProps) =>
	Object.entries(props).reduce<Record<string, string>>((attributes, [prop, value]) => {
		if (HANDLER_PROP.test(prop) || !['string', 'number', 'boolean'].includes(typeof value)) {
			return attributes;
		}
		const name = RENAMED_PROPS[prop] ?? (PASS_THROUGH_PROP.test(prop) ? prop : `data-${kebabCase(prop)}`);
		return { ...attributes, [name]: String(value) };
	}, {});

const assignRef = (ref: Ref<HTMLElement> | undefined, element: HTMLElement | null) => {
	if (typeof ref === 'function') {
		ref(element);
	} else if (ref) {
		(ref as MutableRefObject<HTMLElement | null>).current = element;
	}
};

const createStencilMock = (proxyName: StencilProxyName) => {
	// KvTextField renders <kv-text-field>
	const tagName = kebabCase(proxyName);
	const Mock = ({ children, ref, ...props }: MockProps) => {
		const elementRef = useRef<HTMLElement | null>(null);
		const key = keyOf(props);
		const instance = useRef<MockInstance>({ proxyName, tagName, key, props }).current;
		// Lookups read the props of the latest committed render
		useLayoutEffect(() => {
			instance.key = key;
			instance.props = props;
			// The reset between tests forgets every mock, including ones a beforeAll rendered and a later
			// test re-renders: registering again on each commit brings them back
			if (key !== undefined) register(key, instance);
			if (instance.element) instancesByElement.set(instance.element, instance);
		});
		// Registered while mounted, and moved when the key changes. Re-renders keep the mount order,
		// so a re-render never makes this mock the one a shared key reaches.
		useLayoutEffect(() => {
			if (key === undefined) return undefined;
			register(key, instance);
			return () => unregister(key, instance);
		}, [key]);
		useLayoutEffect(() => {
			const element = elementRef.current;
			if (!element) return undefined;
			instance.element = element;
			instancesByElement.set(element, instance);
			return () => {
				instance.element = undefined;
				if (instancesByElement.get(element) === instance) instancesByElement.delete(element);
			};
		}, []);
		const setRef = useCallback(
			(element: HTMLElement | null) => {
				elementRef.current = element;
				assignRef(ref, element);
			},
			[ref]
		);
		return React.createElement(tagName, { ...toAttributes(props), ref: setRef }, children);
	};
	Mock.displayName = `${proxyName}Mock`;
	return Mock;
};

const STENCIL_PROXY_NAMES = [
	'KvActionButton',
	'KvActionButtonIcon',
	'KvActionMenu',
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

// KvTextField's action icon remains clickable when its input is disabled, including Show password.
const EVENTS_WHEN_DISABLED: Partial<Record<StencilProxyName, readonly `on${string}`[]>> = {
	KvTextField: ['onRightActionClick']
};

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
 * A rendered mock: its key (`id`, else `accessibleLabel`, `text` or `label`) or its element. `null`
 * is accepted so a `querySelector` result can go straight in; it fails with a clear message.
 */
export type StencilMockTarget = string | Element | null;

const lastOf = <T,>(items: T[] | undefined) => (items ? items[items.length - 1] : undefined);

const instanceOf = (target: StencilMockTarget): MockInstance => {
	if (target === null) {
		throw new Error('The query for the element matched nothing');
	}
	const instance = typeof target === 'string' ? lastOf(instancesByKey.get(target)) : instancesByElement.get(target);
	if (!instance) {
		throw new Error(
			typeof target === 'string'
				? `No Stencil mock is rendered under "${target}". Keys come from id, accessibleLabel, text or label; pass the element instead.`
				: `<${target.localName}> isn't a rendered Stencil mock`
		);
	}
	return instance;
};

/**
 * The props a mock received on its latest render, including the objects and handlers the DOM
 * doesn't show. Pass the component's props type to read them typed: `propsOf<JSX.KvTextField>('root_host')`.
 */
export const propsOf = <P extends object = MockProps>(target: StencilMockTarget): P => instanceOf(target).props as P;

/**
 * Calls the handler a mock received, the way the real component's event reaches React:
 * `fireStencilEvent('root_host', 'onTextChange', 'broker-1.local')` stands in for kv-text-field
 * emitting `textChange`. When rendered mocks share a key, the one mounted last wins; pass the element
 * to be exact. A disabled mock refuses unless the event is in `EVENTS_WHEN_DISABLED` or `force`
 * is set. It returns what the handler returns, so an async handler can be awaited. Wrap it in `act()`.
 */
export const fireStencilEvent = (target: StencilMockTarget, handlerName: `on${string}`, detail?: unknown, { force = false }: { force?: boolean } = {}) => {
	const { proxyName, tagName, key, props, element } = instanceOf(target);
	const name = `<${tagName}>${key === undefined ? '' : ` "${key}"`} (${proxyName})`;
	if (!force && (props.disabled === true || props.inputDisabled === true) && !EVENTS_WHEN_DISABLED[proxyName]?.includes(handlerName)) {
		throw new Error(`${name} is disabled, so the real component wouldn't emit its event; pass { force: true } to fire it anyway`);
	}
	const handler = props[handlerName];
	if (typeof handler !== 'function') {
		throw new Error(`${name} has no ${handlerName} handler`);
	}
	const eventName = handlerName.charAt(2).toLowerCase() + handlerName.slice(3);
	// Stencil events bubble and cross shadow roots. The handler is called directly, so its errors reach
	// the test; the event still names the element, since handlers such as RJSF's move buttons read it.
	const event = new CustomEvent(eventName, { detail, bubbles: true, cancelable: true, composed: true });
	if (element) {
		Object.defineProperties(event, { target: { value: element }, currentTarget: { value: element } });
	}
	return handler(event);
};

/** Forgets every rendered mock, by key and by element. The unit project's setup file calls it after each test. */
export const resetStencilMocks = () => {
	instancesByKey.clear();
	instancesByElement = new WeakMap();
};
