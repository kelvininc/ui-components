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

type MockRecord = { proxyName: string; tagName: string; key?: string; props: MockProps };

const HANDLER_PROP = /^on[A-Z]/;
// Attributes tests query by (roles, names, data hooks) keep their names
const PASS_THROUGH_PROP = /^(aria-|data-)/;
const RENAMED_PROPS: Record<string, string> = { className: 'class', tabIndex: 'tabindex', id: 'id', slot: 'slot', role: 'role' };

const recordsByKey = new Map<string, MockRecord>();
const recordsByElement = new WeakMap<Element, MockRecord>();

const keyOf = ({ id, accessibleLabel, text, label }: MockProps) => {
	const key = id ?? accessibleLabel ?? text ?? label;
	return typeof key === 'string' || typeof key === 'number' ? String(key) : undefined;
};

/**
 * Pass-through props keep their names, `className` becomes `class`, and any other primitive prop
 * becomes a data attribute (`labelTitle` is `data-label-title`). Values are strings to compare:
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

const createStencilMock = (proxyName: string) => {
	// KvTextField renders <kv-text-field>
	const tagName = kebabCase(proxyName);
	const Mock = ({ children, ref, ...props }: MockProps) => {
		const elementRef = useRef<HTMLElement | null>(null);
		const record: MockRecord = { proxyName, tagName, key: keyOf(props), props };
		// Recorded once React commits, and removed when the control unmounts or its key changes,
		// so fireStencilEvent never reaches a control that's no longer on screen
		useLayoutEffect(() => {
			const element = elementRef.current;
			if (element) recordsByElement.set(element, record);
			if (record.key !== undefined) recordsByKey.set(record.key, record);
			return () => {
				if (element && recordsByElement.get(element) === record) recordsByElement.delete(element);
				if (record.key !== undefined && recordsByKey.get(record.key) === record) recordsByKey.delete(record.key);
			};
		});
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

/** A rendered mock: its key (`id`, else `accessibleLabel`, `text` or `label`) or its element */
export type StencilMockTarget = string | Element;

const recordOf = (target: StencilMockTarget): MockRecord => {
	const record = typeof target === 'string' ? recordsByKey.get(target) : recordsByElement.get(target);
	if (!record) {
		throw new Error(
			typeof target === 'string'
				? `No Stencil mock is rendered under "${target}". Keys come from id, accessibleLabel, text or label; pass the element instead.`
				: `<${target.localName}> isn't a rendered Stencil mock`
		);
	}
	return record;
};

/** The props a mock received on its latest render, including the objects and handlers the DOM doesn't show */
export const propsOf = (target: StencilMockTarget): MockProps => recordOf(target).props;

/**
 * Calls the handler a mock received, the way the real component's event reaches React:
 * `fireStencilEvent('root_host', 'onTextChange', 'broker-1.local')` stands in for kv-text-field
 * emitting `textChange`. When two rendered mocks share a key, the later one wins; pass the element
 * to be exact. Wrap it in `act()`.
 */
export const fireStencilEvent = (target: StencilMockTarget, handlerName: `on${string}`, detail?: unknown) => {
	const { proxyName, tagName, key, props } = recordOf(target);
	const handler = props[handlerName];
	if (typeof handler !== 'function') {
		throw new Error(`<${tagName}>${key === undefined ? '' : ` "${key}"`} (${proxyName}) has no ${handlerName} handler`);
	}
	const eventName = handlerName.charAt(2).toLowerCase() + handlerName.slice(3);
	handler(new CustomEvent(eventName, { detail }));
};

/** Forgets every rendered mock. The unit project's setup file calls it after each test. */
export const resetStencilMocks = () => recordsByKey.clear();
