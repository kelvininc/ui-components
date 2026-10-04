import { FieldTemplateProps, RJSFSchema, UiSchema, WidgetProps } from '@rjsf/utils';
import React, { ComponentType, forwardRef, memo } from 'react';

/** Freezes plain data in place; components (functions, memo and forwardRef objects) stay as they are */
const deepFreeze = <T,>(value: T): T => {
	if (value && typeof value === 'object' && !('$$typeof' in value) && !Object.isFrozen(value)) {
		Object.freeze(value);
		Object.values(value).forEach(deepFreeze);
	}
	return value;
};

/** Values a field can hold. Only `undefined` means nothing is chosen, so only it shows "Not set" */
export const VALUE_CASES: readonly { name: string; value: unknown; isUnset: boolean }[] = [
	{ name: 'undefined', value: undefined, isUnset: true },
	{ name: 'null', value: null, isUnset: false },
	{ name: 'false', value: false, isUnset: false },
	{ name: 'zero', value: 0, isUnset: false },
	{ name: 'empty string', value: '', isUnset: false }
];

/** Single-choice schemas whose valid values include the falsy ones that reviews kept tripping on */
export const CHOICE_SCHEMAS: readonly { name: string; schema: RJSFSchema; values: unknown[] }[] = [
	{ name: 'boolean', schema: { type: 'boolean', title: 'TLS' }, values: [true, false] },
	{ name: 'string enum', schema: { type: 'string', title: 'QoS', enum: ['at-most-once', 'at-least-once'] }, values: ['at-most-once', 'at-least-once'] },
	{ name: 'enum with a null option', schema: { type: ['string', 'null'], title: 'Compression', enum: ['gzip', null] }, values: ['gzip', null] },
	{
		name: 'integer oneOf with a zero const',
		schema: {
			type: 'integer',
			title: 'Retries',
			oneOf: [
				{ const: 0, title: 'None' },
				{ const: 3, title: 'Three' }
			]
		},
		values: [0, 3]
	}
];

const NAME: RJSFSchema = { type: 'string', title: 'Name' };
const VALUE: RJSFSchema = { type: 'string', title: 'Value' };
const variables = (items: RJSFSchema): RJSFSchema => ({ type: 'array', title: 'Variables', items });

const TOPICS: RJSFSchema = { type: 'array', title: 'Topics', items: { type: 'string', title: 'Topic' } };
// The nested TLS object keeps this list in sections once L2 turns flat lists into tables
const BROKERS: RJSFSchema = {
	type: 'array',
	title: 'Brokers',
	items: {
		type: 'object',
		title: 'Broker',
		properties: {
			host: { type: 'string', title: 'Host' },
			port: { type: 'integer', title: 'Port' },
			tls: { type: 'object', title: 'TLS', properties: { enabled: { type: 'boolean', title: 'Enabled' } } }
		}
	}
};
const ENDPOINTS: RJSFSchema = {
	type: 'array',
	title: 'Endpoints',
	items: [{ type: 'string', title: 'Primary' }],
	additionalItems: { type: 'string', title: 'Backup' }
};
const GROUPS: RJSFSchema = {
	type: 'array',
	title: 'Groups',
	items: {
		type: 'object',
		title: 'Group',
		properties: { name: { type: 'string', title: 'Name' }, tags: { type: 'array', title: 'Tags', items: { type: 'string', title: 'Tag' } } }
	}
};

export const ARRAY_SHAPES: readonly { name: string; schema: RJSFSchema; uiSchema?: UiSchema; formData: unknown[] }[] = [
	{ name: 'string list', schema: TOPICS, formData: ['telemetry'] },
	{ name: 'object list', schema: BROKERS, formData: [{ host: 'broker-1.local', port: 1883, tls: { enabled: true } }] },
	// L2 renders this one as a table
	{
		name: 'flat object list',
		schema: variables({ type: 'object', title: 'Variable', properties: { name: NAME, value: VALUE } }),
		formData: [{ name: 'LOG_LEVEL', value: 'info' }]
	},
	{ name: 'tuple with additional items', schema: ENDPOINTS, formData: ['primary.local'] },
	{ name: 'tuple one below maxItems', schema: { ...ENDPOINTS, maxItems: 2 }, formData: ['primary.local'] },
	{ name: 'one below maxItems', schema: { ...TOPICS, maxItems: 2 }, formData: ['telemetry'] },
	{ name: 'at minItems', schema: { ...TOPICS, minItems: 1 }, formData: ['telemetry'] },
	{ name: 'object list with an inner list', schema: GROUPS, formData: [{ name: 'north', tags: ['line-1'] }] },
	{ name: 'readonly', schema: TOPICS, uiSchema: { 'ui:readonly': true }, formData: ['telemetry'] }
];

const nestSections = (depth: number): RJSFSchema =>
	depth === 0 ? { type: 'string', title: 'Endpoint' } : { type: 'object', title: `Level ${depth}`, properties: { child: nestSections(depth - 1) } };
const nestData = (depth: number): unknown => (depth === 0 ? 'opc.tcp://plant-1:4840' : { child: nestData(depth - 1) });

export const OBJECT_SHAPES: readonly { name: string; schema: RJSFSchema; formData: object }[] = [
	{ name: 'titled section', schema: { type: 'object', title: 'Connection', properties: { host: { type: 'string', title: 'Host' } } }, formData: { host: 'broker-1.local' } },
	{ name: 'untitled object', schema: { type: 'object', properties: { host: { type: 'string', title: 'Host' } } }, formData: { host: 'broker-1.local' } },
	{ name: 'additionalProperties true', schema: { type: 'object', title: 'Labels', additionalProperties: true }, formData: { site: 'lisbon' } },
	{ name: 'additionalProperties schema', schema: { type: 'object', title: 'Labels', additionalProperties: { type: 'string' } }, formData: { site: 'lisbon' } },
	{
		name: 'one below maxProperties',
		schema: { type: 'object', title: 'Labels', additionalProperties: { type: 'string' }, maxProperties: 2 },
		formData: { site: 'lisbon' }
	},
	{
		name: 'boolean property schemas',
		schema: { type: 'object', title: 'Connection', properties: { host: { type: 'string', title: 'Host' }, legacy: true, removed: false } },
		formData: { host: 'broker-1.local' }
	},
	{
		name: 'oneOf',
		schema: {
			type: 'object',
			title: 'Authentication',
			oneOf: [
				{ title: 'Token', required: ['token'], properties: { token: { type: 'string', title: 'Token' } } },
				{ title: 'Certificate', required: ['certificate'], properties: { certificate: { type: 'string', title: 'Certificate' } } }
			]
		},
		formData: { token: 'broker-token' }
	},
	{ name: 'seven nested sections', schema: nestSections(7), formData: nestData(7) as object }
];

/** The form `ERROR_SHAPES` apply to: two brokers, so errors can target either item */
export const BROKER_SCHEMA: RJSFSchema = {
	type: 'object',
	properties: {
		site: { type: 'string', title: 'Site' },
		port: { type: 'integer', title: 'Port', minimum: 1 },
		brokers: {
			type: 'array',
			title: 'Brokers',
			items: { type: 'object', title: 'Broker', required: ['host'], properties: { host: { type: 'string', title: 'Host' } } }
		}
	}
};
export const BROKER_FORM_DATA = { site: 'lisbon', port: 1883, brokers: [{ host: 'broker-1.local' }, { host: 'broker-2.local' }] };

/** A message the form must show, and the id of the field it must show under */
export type ExpectedError = { id: string; message: string };

/**
 * Server error schemas as hosts build them, including shapes RJSF's own helpers mishandle.
 * `messages` is what the form must show and where; an empty list means it must show nothing and
 * allow Save. The ids matter: the undefined hole targets the second broker, and an error that
 * shows under the first one has lost its index.
 */
export const ERROR_SHAPES: readonly { name: string; extraErrors: unknown; messages: ExpectedError[] }[] = [
	{ name: 'empty object', extraErrors: {}, messages: [] },
	{ name: 'empty __errors', extraErrors: { port: { __errors: [] } }, messages: [] },
	{
		name: 'index-keyed item error',
		extraErrors: { brokers: { 0: { host: { __errors: ['Broker unreachable.'] } } } },
		messages: [{ id: 'root_brokers_0_host', message: 'Broker unreachable.' }]
	},
	// What lodash `set(errors, ['brokers', 0, 'host', '__errors'], [...])` builds
	{
		name: 'array-shaped item error',
		extraErrors: { brokers: [{ host: { __errors: ['Broker unreachable.'] } }] },
		messages: [{ id: 'root_brokers_0_host', message: 'Broker unreachable.' }]
	},
	{
		name: 'undefined hole',
		extraErrors: { brokers: [undefined, { host: { __errors: ['Broker unreachable.'] } }] },
		messages: [{ id: 'root_brokers_1_host', message: 'Broker unreachable.' }]
	},
	{ name: 'undefined __errors', extraErrors: { port: { __errors: undefined } }, messages: [] },
	{
		name: 'array errors next to an empty sibling',
		extraErrors: { site: { __errors: [] }, brokers: [{ host: { __errors: ['Broker unreachable.'] } }] },
		messages: [{ id: 'root_brokers_0_host', message: 'Broker unreachable.' }]
	}
];

const FieldLayout = ({ children }: FieldTemplateProps) => <div data-field-layout="">{children}</div>;
const ForwardRefFieldLayout = forwardRef<HTMLDivElement, FieldTemplateProps>(({ children }, ref) => (
	<div ref={ref} data-field-layout="">
		{children}
	</div>
));
ForwardRefFieldLayout.displayName = 'ForwardRefFieldLayout';

/** memo and forwardRef components are plain objects, which a deep merge would copy into new component types */
export const TEMPLATE_COMPONENTS: readonly { name: string; FieldLayout: ComponentType<FieldTemplateProps> }[] = [
	{ name: 'function', FieldLayout },
	{ name: 'React.memo', FieldLayout: memo(FieldLayout) },
	{ name: 'forwardRef', FieldLayout: ForwardRefFieldLayout }
];

/** The three places a field option such as `allowClearInputs` can come from */
export const OPTION_SOURCES: readonly {
	name: string;
	build: (field: string, options: Record<string, unknown>) => { uiSchema: UiSchema; formContext?: Record<string, unknown> };
}[] = [
	{ name: 'field ui:options', build: (field, options) => ({ uiSchema: { [field]: { 'ui:options': options } } }) },
	{ name: 'ui:globalOptions', build: (_field, options) => ({ uiSchema: { 'ui:globalOptions': options } }) },
	{ name: 'form context', build: (_field, options) => ({ uiSchema: {}, formContext: options }) }
];

/** RJSF's array button settings, each turned off on its own, then all at once */
export const LIST_OPTIONS: readonly { name: string; options: { orderable?: boolean; removable?: boolean; addable?: boolean } }[] = [
	{ name: 'defaults', options: {} },
	{ name: 'not orderable', options: { orderable: false } },
	{ name: 'not removable', options: { removable: false } },
	{ name: 'not addable', options: { addable: false } },
	{ name: 'no buttons', options: { orderable: false, removable: false, addable: false } }
];

/** A custom widget: L2 can't tell how wide it renders, so a list using it stays in sections */
const SecretInput = ({ id, value, onChange }: WidgetProps) => <input id={id} type="password" value={value ?? ''} onChange={event => onChange(event.target.value)} />;

/**
 * Object lists, each marked with whether L2 makes it a table: one to four visible properties,
 * each rendering as text, number or select, and no oneOf, anyOf, dependencies or if on the item.
 * The table is automatic, so the rule errs toward sections; these rows pin each boundary.
 */
export const FLAT_OBJECT_SHAPES: readonly { name: string; schema: RJSFSchema; uiSchema?: UiSchema; formData: object[]; isFlat: boolean }[] = [
	{
		name: 'two strings',
		schema: variables({ type: 'object', properties: { name: NAME, value: VALUE } }),
		formData: [{ name: 'LOG_LEVEL', value: 'info' }],
		isFlat: true
	},
	{
		name: 'a string and an enum',
		schema: variables({ type: 'object', properties: { name: NAME, level: { type: 'string', title: 'Level', enum: ['info', 'debug'] } } }),
		formData: [{ name: 'LOG_LEVEL', level: 'info' }],
		isFlat: true
	},
	{
		name: 'a string and an integer',
		schema: variables({ type: 'object', properties: { host: { type: 'string', title: 'Host' }, port: { type: 'integer', title: 'Port' } } }),
		formData: [{ host: 'broker-1.local', port: 1883 }],
		isFlat: true
	},
	{
		name: 'a hidden property',
		schema: variables({ type: 'object', properties: { id: { type: 'string' }, name: NAME, value: VALUE } }),
		uiSchema: { items: { id: { 'ui:widget': 'hidden' } } },
		formData: [{ id: 'variable-1', name: 'LOG_LEVEL', value: 'info' }],
		isFlat: true
	},
	{
		// Kelvin's app schema puts regexes in `format`; ajv ignores them, and they don't change the widget
		name: 'a regex in format',
		schema: variables({ type: 'object', properties: { name: { type: 'string', title: 'Variable Name', format: '^[A-Za-z_][A-Za-z0-9_]*$' }, value: VALUE } }),
		formData: [{ name: 'LOG_LEVEL', value: 'info' }],
		isFlat: true
	},
	{
		name: 'four visible properties',
		schema: variables({
			type: 'object',
			properties: { name: NAME, value: VALUE, unit: { type: 'string', title: 'Unit', enum: ['ms', 's'] }, scale: { type: 'number', title: 'Scale' } }
		}),
		formData: [{ name: 'TIMEOUT', value: '30', unit: 's', scale: 1 }],
		isFlat: true
	},
	{
		name: 'a boolean',
		schema: variables({ type: 'object', properties: { name: NAME, enabled: { type: 'boolean', title: 'Enabled' } } }),
		formData: [{ name: 'DEBUG', enabled: true }],
		isFlat: false
	},
	{
		name: 'a textarea widget',
		schema: variables({ type: 'object', properties: { name: NAME, value: VALUE } }),
		uiSchema: { items: { value: { 'ui:widget': 'textarea' } } },
		formData: [{ name: 'BANNER', value: 'Line one' }],
		isFlat: false
	},
	{
		name: 'a data-url string',
		schema: variables({ type: 'object', properties: { name: NAME, certificate: { type: 'string', title: 'Certificate', format: 'data-url' } } }),
		formData: [{ name: 'CA', certificate: 'data:text/plain;name=ca.pem;base64,Y2E=' }],
		isFlat: false
	},
	{
		name: 'a custom widget',
		schema: variables({ type: 'object', properties: { name: NAME, value: VALUE } }),
		uiSchema: { items: { value: { 'ui:widget': SecretInput } } },
		formData: [{ name: 'API_TOKEN', value: 'token' }],
		isFlat: false
	},
	{
		name: 'five visible properties',
		schema: variables({
			type: 'object',
			properties: {
				name: NAME,
				value: VALUE,
				unit: { type: 'string', title: 'Unit' },
				scale: { type: 'number', title: 'Scale' },
				note: { type: 'string', title: 'Note' }
			}
		}),
		formData: [{ name: 'TIMEOUT', value: '30', unit: 's', scale: 1, note: 'Per request' }],
		isFlat: false
	},
	{
		name: 'a nested object',
		schema: variables({
			type: 'object',
			properties: { name: NAME, tls: { type: 'object', title: 'TLS', properties: { enabled: { type: 'boolean', title: 'Enabled' } } } }
		}),
		formData: [{ name: 'broker-1', tls: { enabled: true } }],
		isFlat: false
	},
	{
		name: 'an inner list',
		schema: variables({ type: 'object', properties: { name: NAME, tags: { type: 'array', title: 'Tags', items: { type: 'string', title: 'Tag' } } } }),
		formData: [{ name: 'north', tags: ['line-1'] }],
		isFlat: false
	},
	{
		name: 'a oneOf on the item',
		schema: variables({
			type: 'object',
			properties: { name: NAME },
			oneOf: [
				{ title: 'Token', required: ['token'], properties: { token: { type: 'string', title: 'Token' } } },
				{ title: 'Certificate', required: ['certificate'], properties: { certificate: { type: 'string', title: 'Certificate' } } }
			]
		}),
		formData: [{ name: 'broker-1', token: 'broker-token' }],
		isFlat: false
	}
];

// Rows share schema objects (TOPICS, ENDPOINTS, NAME), so a test that mutated one would change
// other rows, and other tests. Frozen, the mutation throws where it happens.
[
	VALUE_CASES,
	CHOICE_SCHEMAS,
	ARRAY_SHAPES,
	OBJECT_SHAPES,
	BROKER_SCHEMA,
	BROKER_FORM_DATA,
	ERROR_SHAPES,
	TEMPLATE_COMPONENTS,
	OPTION_SOURCES,
	LIST_OPTIONS,
	FLAT_OBJECT_SHAPES
].forEach(deepFreeze);
