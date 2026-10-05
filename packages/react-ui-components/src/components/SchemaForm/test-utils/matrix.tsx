import { ArrayFieldTemplateProps, FieldTemplateProps, RJSFSchema, UIOptionsType, UiSchema, WidgetProps } from '@rjsf/utils';
import React, { ComponentType, forwardRef, memo } from 'react';
import type { SchemaFormContext } from '../types';

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

/** Names must reach the real control inside its shadow root, including visible overrides. */
export const CONTROL_NAME_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: boolean | string;
	role: 'checkbox' | 'radio';
	labels: string[];
	nextValue: boolean | string;
}[] = [
	{ name: 'checkbox field title', schema: CHOICE_SCHEMAS[0].schema, uiSchema: { 'ui:widget': 'checkbox' }, formData: false, role: 'checkbox', labels: ['TLS'], nextValue: true },
	{
		name: 'checkbox visible label',
		schema: CHOICE_SCHEMAS[0].schema,
		uiSchema: { 'ui:widget': 'checkbox', 'ui:options': { checkboxLabel: 'Enable TLS' } },
		formData: false,
		role: 'checkbox',
		labels: ['Enable TLS'],
		nextValue: true
	},
	{
		name: 'checkbox empty visible label',
		schema: CHOICE_SCHEMAS[0].schema,
		uiSchema: { 'ui:widget': 'checkbox', 'ui:options': { checkboxLabel: '' } },
		formData: false,
		role: 'checkbox',
		labels: ['TLS'],
		nextValue: true
	},
	{
		name: 'checkbox UI field title',
		schema: CHOICE_SCHEMAS[0].schema,
		uiSchema: { 'ui:widget': 'checkbox', 'ui:title': 'Connection security' },
		formData: false,
		role: 'checkbox',
		labels: ['Connection security'],
		nextValue: true
	},
	{ name: 'default boolean radios', schema: CHOICE_SCHEMAS[0].schema, uiSchema: {}, formData: false, role: 'radio', labels: ['True', 'False'], nextValue: true },
	{
		name: 'custom boolean radio labels',
		schema: CHOICE_SCHEMAS[0].schema,
		uiSchema: { 'ui:options': { booleanLabels: { true: 'Enabled', false: 'Disabled' } } },
		formData: false,
		role: 'radio',
		labels: ['Enabled', 'Disabled'],
		nextValue: true
	},
	{
		name: 'enum radio labels',
		schema: CHOICE_SCHEMAS[1].schema,
		uiSchema: { 'ui:widget': 'radio' },
		formData: 'at-least-once',
		role: 'radio',
		labels: ['at-most-once', 'at-least-once'],
		nextValue: 'at-most-once'
	}
];

const ASSET_SELECTION: RJSFSchema = {
	type: 'array',
	title: 'Assets',
	uniqueItems: true,
	items: {
		type: 'string',
		oneOf: [
			{ const: 'north-line', title: 'North line' },
			{ const: 'south-line', title: 'South line' }
		]
	}
};

/** Toggle groups let users toggle off a selected asset, even when maxItems is one. */
export const TOGGLE_BUTTON_GROUP_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: string[];
	nextValue: string;
	nextSelection?: string[];
}[] = [
	{
		name: 'multiple assets',
		schema: ASSET_SELECTION,
		uiSchema: { 'ui:widget': 'toggleButtonGroup', 'ui:options': { withRadio: true } },
		formData: ['north-line'],
		nextValue: 'south-line',
		nextSelection: ['north-line', 'south-line']
	},
	{
		name: 'one asset',
		schema: { ...ASSET_SELECTION, maxItems: 1 },
		uiSchema: { 'ui:widget': 'toggleButtonGroup', 'ui:options': { withRadio: true } },
		formData: ['north-line'],
		nextValue: 'south-line',
		nextSelection: ['south-line']
	},
	{
		name: 'one asset with disabled alternatives',
		schema: { ...ASSET_SELECTION, maxItems: 1 },
		uiSchema: { 'ui:widget': 'toggleButtonGroup', 'ui:options': { withRadio: true, enumDisabled: ['south-line'] } },
		formData: ['north-line'],
		nextValue: 'north-line'
	}
];

/** Multi-select labels come from normalized schema titles or array UI, including when item UI exists */
export const MULTI_SELECT_SHAPES: readonly { name: string; schema: RJSFSchema; uiSchema: UiSchema; formData: string[]; labels: string[] }[] = [
	{ name: 'schema titles', schema: ASSET_SELECTION, uiSchema: {}, formData: ['north-line'], labels: ['North line', 'South line'] },
	{
		name: 'unrelated item UI',
		schema: ASSET_SELECTION,
		uiSchema: { items: { 'ui:placeholder': 'Choose an asset' } },
		formData: ['north-line'],
		labels: ['North line', 'South line']
	},
	{
		name: 'array label override with item UI',
		schema: ASSET_SELECTION,
		uiSchema: { 'ui:enumNames': ['North production', 'South production'], 'items': {} },
		formData: ['north-line'],
		labels: ['North production', 'South production']
	},
	{
		name: 'nested array label override with item UI',
		schema: ASSET_SELECTION,
		uiSchema: { 'ui:options': { enumNames: ['North production', 'South production'] }, 'items': { 'ui:placeholder': 'Choose an asset' } },
		formData: ['north-line'],
		labels: ['North production', 'South production']
	},
	{
		name: 'empty array label override with item UI',
		schema: ASSET_SELECTION,
		uiSchema: { 'ui:enumNames': [], 'items': {} },
		formData: ['north-line'],
		labels: ['north-line', 'south-line']
	}
];

/** C4 names the real input while preserving RJSF's resolved title and value contracts. */
export const INPUT_FOCUS_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: string | number;
	label: string;
	nextText: string;
	nextValue: string | number;
}[] = [
	{
		name: 'text title',
		schema: { type: 'string', title: 'Broker' },
		uiSchema: {},
		formData: 'broker-1.local',
		label: 'Broker',
		nextText: 'broker-2.local',
		nextValue: 'broker-2.local'
	},
	{
		name: 'UI title',
		schema: { type: 'string', title: 'Broker' },
		uiSchema: { 'ui:title': 'Plant broker' },
		formData: 'broker-1.local',
		label: 'Plant broker',
		nextText: 'broker-2.local',
		nextValue: 'broker-2.local'
	},
	{ name: 'zero integer', schema: { type: 'integer', title: 'Retries' }, uiSchema: {}, formData: 0, label: 'Retries', nextText: '3', nextValue: 3 },
	{
		name: 'password',
		schema: { type: 'string', title: 'Access token' },
		uiSchema: { 'ui:widget': 'password' },
		formData: 'plant-token',
		label: 'Access token',
		nextText: 'rotated-token',
		nextValue: 'rotated-token'
	}
];

export const SELECT_FOCUS_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: string | string[];
	label: string;
	tag: 'kv-single-select-dropdown' | 'kv-multi-select-dropdown';
	nextValue: string | string[];
}[] = [
	{
		name: 'single title',
		schema: { type: 'string', title: 'Assets', oneOf: (ASSET_SELECTION.items as RJSFSchema).oneOf },
		uiSchema: {},
		formData: 'north-line',
		label: 'Assets',
		tag: 'kv-single-select-dropdown',
		nextValue: 'south-line'
	},
	{
		name: 'single UI title',
		schema: { type: 'string', title: 'Assets', oneOf: (ASSET_SELECTION.items as RJSFSchema).oneOf },
		uiSchema: { 'ui:title': 'Plant assets' },
		formData: 'north-line',
		label: 'Plant assets',
		tag: 'kv-single-select-dropdown',
		nextValue: 'south-line'
	},
	{
		name: 'multiple title',
		schema: ASSET_SELECTION,
		uiSchema: {},
		formData: ['north-line'],
		label: 'Assets',
		tag: 'kv-multi-select-dropdown',
		nextValue: ['north-line', 'south-line']
	},
	{
		name: 'multiple UI title',
		schema: ASSET_SELECTION,
		uiSchema: { 'ui:title': 'Plant assets' },
		formData: ['north-line'],
		label: 'Plant assets',
		tag: 'kv-multi-select-dropdown',
		nextValue: ['north-line', 'south-line']
	}
];

export const FOCUS_EDITING_FLAGS = [
	{ name: 'enabled', disabled: false, readonly: false, focused: true },
	{ name: 'disabled', disabled: true, readonly: false, focused: false },
	{ name: 'readonly', disabled: false, readonly: true, focused: false }
];

export const TOGGLE_FOCUS_MODES = [
	{ name: 'checkbox', withRadio: true, role: 'checkbox' as const },
	{ name: 'plain button', withRadio: false, role: 'button' as const }
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
	{ name: 'string list', schema: TOPICS, formData: ['telemetry', 'alarms', 'commands'] },
	{
		name: 'object list',
		schema: BROKERS,
		formData: [
			{ host: 'broker-1.local', port: 1883, tls: { enabled: true } },
			{ host: 'broker-2.local', port: 8883, tls: { enabled: false } },
			{ host: 'broker-3.local', port: 1883, tls: { enabled: true } }
		]
	},
	// L2 renders this one as a table
	{
		name: 'flat object list',
		schema: variables({ type: 'object', title: 'Variable', properties: { name: NAME, value: VALUE } }),
		formData: [
			{ name: 'LOG_LEVEL', value: 'info' },
			{ name: 'BROKER_HOST', value: 'broker-1.local' },
			{ name: 'POLL_INTERVAL', value: '30' }
		]
	},
	{ name: 'tuple with additional items', schema: ENDPOINTS, formData: ['primary.local', 'backup.local'] },
	{ name: 'tuple one below maxItems', schema: { ...ENDPOINTS, maxItems: 2 }, formData: ['primary.local'] },
	{ name: 'one below maxItems', schema: { ...TOPICS, maxItems: 2 }, formData: ['telemetry'] },
	{ name: 'at minItems', schema: { ...TOPICS, minItems: 1 }, formData: ['telemetry'] },
	{
		name: 'object list with an inner list',
		schema: GROUPS,
		formData: [
			{ name: 'north', tags: ['line-1', 'line-2', 'line-3'] },
			{ name: 'south', tags: ['line-4', 'line-5', 'line-6'] },
			{ name: 'east', tags: ['line-7', 'line-8', 'line-9'] }
		]
	},
	{ name: 'readonly', schema: TOPICS, uiSchema: { 'ui:readonly': true }, formData: ['telemetry', 'alarms', 'commands'] }
];

export const FIELDSET_BACKGROUND_SHAPES: readonly { name: string; background?: string }[] = [
	{ name: 'inherited surface' },
	{ name: 'custom form background', background: 'rgb(17, 29, 41)' }
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
		name: 'nested optional fields in additional property',
		schema: {
			type: 'object',
			title: 'Plants',
			additionalProperties: {
				type: 'object',
				title: 'Plant',
				properties: { site: { type: 'string', title: 'Site' }, retries: { type: 'integer', title: 'Retries' } }
			}
		},
		formData: { plant: { site: 'lisbon', retries: 3 } }
	},
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

const CERTIFICATE = 'data:text/plain;name=ca.pem;base64,Y2E=';
const CLIENT_CERTIFICATE = 'data:text/plain;name=client.pem;base64,Y2xpZW50';
const LABELS: RJSFSchema = { type: 'object', title: 'Labels', additionalProperties: { type: 'string', default: 'production' } };

/** Existing SchemaForm actions need names as soon as the core exposes button roles. */
export const ACTION_NAME_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema?: UiSchema;
	formData: unknown;
	labels: string[];
	action: { label: string; nextData: unknown };
	download?: string;
}[] = [
	{
		name: 'list moves',
		schema: TOPICS,
		formData: ARRAY_SHAPES[0].formData,
		labels: [
			'Move Topic 1 down',
			'Move Topic 1 up',
			'Remove Topic 1',
			'Move Topic 2 down',
			'Move Topic 2 up',
			'Remove Topic 2',
			'Move Topic 3 down',
			'Move Topic 3 up',
			'Remove Topic 3',
			'Add item to Topics'
		],
		action: { label: 'Move Topic 2 up', nextData: ['alarms', 'telemetry', 'commands'] }
	},
	{
		name: 'list prefix',
		schema: TOPICS,
		uiSchema: { 'ui:itemPrefix': 'Channel', 'items': { 'ui:itemPrefix': 'Channel' } },
		formData: ARRAY_SHAPES[0].formData,
		labels: [
			'Move Channel 1 down',
			'Move Channel 1 up',
			'Remove Channel 1',
			'Move Channel 2 down',
			'Move Channel 2 up',
			'Remove Channel 2',
			'Move Channel 3 down',
			'Move Channel 3 up',
			'Remove Channel 3',
			'Add Channel'
		],
		action: { label: 'Remove Channel 2', nextData: ['telemetry', 'commands'] }
	},
	{
		name: 'untitled list',
		schema: { type: 'array', items: { type: 'string', default: 'new-topic' } },
		formData: ARRAY_SHAPES[0].formData,
		labels: [
			'Move Item 1 down',
			'Move Item 1 up',
			'Remove Item 1',
			'Move Item 2 down',
			'Move Item 2 up',
			'Remove Item 2',
			'Move Item 3 down',
			'Move Item 3 up',
			'Remove Item 3',
			'Add item'
		],
		action: { label: 'Add item', nextData: ['telemetry', 'alarms', 'commands', 'new-topic'] }
	},
	{
		name: 'additional property removal',
		schema: LABELS,
		formData: { site: 'lisbon' },
		labels: ['Remove site', 'Add property to Labels'],
		action: { label: 'Remove site', nextData: {} }
	},
	{
		name: 'section UI title',
		schema: LABELS,
		uiSchema: { 'ui:title': 'Connection labels' },
		formData: { site: 'lisbon' },
		labels: ['Remove site', 'Add property to Connection labels'],
		action: { label: 'Add property to Connection labels', nextData: { site: 'lisbon', newKey: 'production' } }
	},
	{
		name: 'untitled section',
		schema: { ...LABELS, title: undefined },
		formData: { site: 'lisbon' },
		labels: ['Remove site', 'Add property'],
		action: { label: 'Add property', nextData: { site: 'lisbon', newKey: 'production' } }
	},
	{
		name: 'single file',
		schema: { type: 'string', title: 'Certificate', format: 'data-url' },
		uiSchema: { 'ui:options': { filePreview: true } },
		formData: CERTIFICATE,
		labels: ['Download ca.pem', 'Remove ca.pem', 'Browse File'],
		action: { label: 'Remove ca.pem', nextData: undefined },
		download: 'Download ca.pem'
	},
	{
		name: 'multiple files',
		schema: { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' } },
		uiSchema: { 'ui:options': { filePreview: true } },
		formData: [CERTIFICATE, CLIENT_CERTIFICATE],
		labels: ['Download ca.pem', 'Remove ca.pem', 'Download client.pem', 'Remove client.pem', 'Browse File'],
		action: { label: 'Remove ca.pem', nextData: [CLIENT_CERTIFICATE] },
		download: 'Download ca.pem'
	}
];

/** CustomForm uses the native submit wrapper that KvSchemaForm's external footer bypasses. */
export const SUBMIT_BUTTON_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema?: UiSchema;
	formData: string;
	label: string;
	disabled: boolean;
}[] = [
	{ name: 'default submit label', schema: NAME, formData: 'plant-broker', label: 'Submit', disabled: false },
	{
		name: 'custom submit label',
		schema: NAME,
		uiSchema: { 'ui:submitButtonOptions': { submitText: 'Deploy connector' } },
		formData: 'plant-broker',
		label: 'Deploy connector',
		disabled: false
	},
	{
		name: 'disabled submit',
		schema: NAME,
		uiSchema: { 'ui:submitButtonOptions': { props: { disabled: true } } },
		formData: 'plant-broker',
		label: 'Submit',
		disabled: true
	}
];

/** C3 preserves the textarea value/callback and forwards RJSF's resolved name. */
export const TEXTAREA_CONSUMER_SHAPES: readonly {
	name: string;
	label: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: string;
	nextText: string;
}[] = [
	{
		name: 'unlimited notes',
		label: 'Connection notes',
		schema: { type: 'string', title: 'Connection notes' },
		uiSchema: { 'ui:widget': 'textarea' },
		formData: 'Plant broker',
		nextText: 'Updated broker notes'
	},
	{
		name: 'limited notes',
		label: 'Connection notes',
		schema: { type: 'string', title: 'Connection notes' },
		uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': 60 },
		formData: 'Plant broker',
		nextText: 'Updated broker notes'
	},
	{
		name: 'overridden field title',
		label: 'Operator notes',
		schema: { type: 'string', title: 'Connection notes' },
		uiSchema: { 'ui:widget': 'textarea', 'ui:title': 'Operator notes' },
		formData: 'Plant broker',
		nextText: 'Updated broker notes'
	}
];

export const TEXTAREA_EDITABILITY_SHAPES: readonly {
	name: string;
	disabled: boolean;
	readonly: boolean;
	editable: boolean;
}[] = [
	{ name: 'enabled form', disabled: false, readonly: false, editable: true },
	{ name: 'disabled form', disabled: true, readonly: false, editable: false },
	{ name: 'read only form', disabled: false, readonly: true, editable: false },
	{ name: 'disabled and read only form', disabled: true, readonly: true, editable: false }
];

const TEXTAREA_VALIDATION_FORM = {
	schema: { type: 'object', properties: { notes: { type: 'string', title: 'Connection notes' } } } satisfies RJSFSchema,
	uiSchema: { notes: { 'ui:widget': 'textarea' } } satisfies UiSchema<Record<string, unknown>, RJSFSchema, SchemaFormContext>,
	formData: { notes: 'Plant broker' }
};

/** A field shows errors after touch or when the form displays all errors. */
export const TEXTAREA_VALIDATION_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema<Record<string, unknown>, RJSFSchema, SchemaFormContext>;
	formData: { notes: string };
	extraErrors: { notes?: { __errors: string[] } };
	displayErrors: boolean;
	initialInvalid: boolean;
	touchedInvalid: boolean;
}[] = [
	{ ...TEXTAREA_VALIDATION_FORM, name: 'clean untouched field', extraErrors: {}, displayErrors: false, initialInvalid: false, touchedInvalid: false },
	{
		...TEXTAREA_VALIDATION_FORM,
		name: 'hidden errors become visible on focus',
		extraErrors: { notes: { __errors: ['Explain why this connection is needed'] } },
		displayErrors: false,
		initialInvalid: false,
		touchedInvalid: true
	},
	{
		...TEXTAREA_VALIDATION_FORM,
		name: 'globally displayed errors',
		extraErrors: { notes: { __errors: ['Explain why this connection is needed'] } },
		displayErrors: true,
		initialInvalid: true,
		touchedInvalid: true
	},
	{ ...TEXTAREA_VALIDATION_FORM, name: 'display all with no errors', extraErrors: {}, displayErrors: true, initialInvalid: false, touchedInvalid: false }
];

/** Field errors, the error list, descriptions and helper text share the core help component. */
export const HELP_TEXT_CONSUMER_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema<Record<string, unknown>, RJSFSchema, SchemaFormContext>;
	formData: { broker: string; notes: string };
	extraErrors: { broker: { __errors: string[] } };
	regularMessages: string[];
}[] = [
	{
		name: 'field and summary errors with ordinary help',
		schema: {
			type: 'object',
			properties: {
				broker: { type: 'string', title: 'Broker', default: 'mqtts://broker-1:8883' },
				notes: { type: 'string', title: 'Notes', description: 'Describe this connection' }
			}
		},
		uiSchema: { broker: { 'ui:showDefaultValueHelper': true, 'ui:defaultValueHelperPrefix': 'Default broker: ' } },
		formData: { broker: 'mqtts://broker-1:8883', notes: 'Plant broker' },
		extraErrors: { broker: { __errors: ['Broker unavailable'] } },
		regularMessages: ['ERRORS LIST:', 'Default broker: mqtts://broker-1:8883', 'Describe this connection']
	}
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
		formData: [
			{ name: 'LOG_LEVEL', value: 'info' },
			{ name: 'BROKER_HOST', value: 'broker-1.local' },
			{ name: 'POLL_INTERVAL', value: '30' }
		],
		isFlat: true
	},
	{
		name: 'a string and an enum',
		schema: variables({ type: 'object', properties: { name: NAME, level: { type: 'string', title: 'Level', enum: ['info', 'debug'] } } }),
		formData: [
			{ name: 'LOG_LEVEL', level: 'info' },
			{ name: 'IMPORTER_LOG_LEVEL', level: 'debug' },
			{ name: 'APP_LOG_LEVEL', level: 'info' }
		],
		isFlat: true
	},
	{
		name: 'a string and an integer',
		schema: variables({ type: 'object', properties: { host: { type: 'string', title: 'Host' }, port: { type: 'integer', title: 'Port' } } }),
		formData: [
			{ host: 'broker-1.local', port: 1883 },
			{ host: 'broker-2.local', port: 8883 },
			{ host: 'broker-3.local', port: 1883 }
		],
		isFlat: true
	},
	{
		name: 'a hidden property',
		schema: variables({ type: 'object', properties: { id: { type: 'string' }, name: NAME, value: VALUE } }),
		uiSchema: { items: { id: { 'ui:widget': 'hidden' } } },
		formData: [
			{ id: 'variable-1', name: 'LOG_LEVEL', value: 'info' },
			{ id: 'variable-2', name: 'BROKER_HOST', value: 'broker-1.local' },
			{ id: 'variable-3', name: 'POLL_INTERVAL', value: '30' }
		],
		isFlat: true
	},
	{
		// Kelvin's app schema puts regexes in `format`; ajv ignores them, and they don't change the widget
		name: 'a regex in format',
		schema: variables({ type: 'object', properties: { name: { type: 'string', title: 'Variable Name', format: '^[A-Za-z_][A-Za-z0-9_]*$' }, value: VALUE } }),
		formData: [
			{ name: 'LOG_LEVEL', value: 'info' },
			{ name: 'BROKER_HOST', value: 'broker-1.local' },
			{ name: 'POLL_INTERVAL', value: '30' }
		],
		isFlat: true
	},
	{
		name: 'four visible properties',
		schema: variables({
			type: 'object',
			properties: { name: NAME, value: VALUE, unit: { type: 'string', title: 'Unit', enum: ['ms', 's'] }, scale: { type: 'number', title: 'Scale' } }
		}),
		formData: [
			{ name: 'TIMEOUT', value: '30', unit: 's', scale: 1 },
			{ name: 'POLL_INTERVAL', value: '500', unit: 'ms', scale: 1 },
			{ name: 'RETRY_DELAY', value: '5', unit: 's', scale: 2 }
		],
		isFlat: true
	},
	{
		name: 'a boolean',
		schema: variables({ type: 'object', properties: { name: NAME, enabled: { type: 'boolean', title: 'Enabled' } } }),
		formData: [
			{ name: 'DEBUG', enabled: true },
			{ name: 'TRACE', enabled: false },
			{ name: 'TLS', enabled: true }
		],
		isFlat: false
	},
	{
		name: 'a textarea widget',
		schema: variables({ type: 'object', properties: { name: NAME, value: VALUE } }),
		uiSchema: { items: { value: { 'ui:widget': 'textarea' } } },
		formData: [
			{ name: 'BANNER', value: 'Line one' },
			{ name: 'DESCRIPTION', value: 'Telemetry importer' },
			{ name: 'NOTES', value: 'Read only connection' }
		],
		isFlat: false
	},
	{
		name: 'a data-url string',
		schema: variables({ type: 'object', properties: { name: NAME, certificate: { type: 'string', title: 'Certificate', format: 'data-url' } } }),
		formData: [
			{ name: 'CA', certificate: 'data:text/plain;name=ca.pem;base64,Y2E=' },
			{ name: 'CLIENT_CERT', certificate: 'data:text/plain;name=client.pem;base64,Y2xpZW50' },
			{ name: 'BROKER_CERT', certificate: 'data:text/plain;name=broker.pem;base64,YnJva2Vy' }
		],
		isFlat: false
	},
	{
		name: 'a custom widget',
		schema: variables({ type: 'object', properties: { name: NAME, value: VALUE } }),
		uiSchema: { items: { value: { 'ui:widget': SecretInput } } },
		formData: [
			{ name: 'API_TOKEN', value: 'token' },
			{ name: 'BROKER_TOKEN', value: 'broker-token' },
			{ name: 'OPC_TOKEN', value: 'opc-token' }
		],
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
		formData: [
			{ name: 'TIMEOUT', value: '30', unit: 's', scale: 1, note: 'Per request' },
			{ name: 'POLL_INTERVAL', value: '500', unit: 'ms', scale: 1, note: 'Between reads' },
			{ name: 'RETRY_DELAY', value: '5', unit: 's', scale: 2, note: 'After a failure' }
		],
		isFlat: false
	},
	{
		name: 'a nested object',
		schema: variables({
			type: 'object',
			properties: { name: NAME, tls: { type: 'object', title: 'TLS', properties: { enabled: { type: 'boolean', title: 'Enabled' } } } }
		}),
		formData: [
			{ name: 'broker-1', tls: { enabled: true } },
			{ name: 'broker-2', tls: { enabled: false } },
			{ name: 'broker-3', tls: { enabled: true } }
		],
		isFlat: false
	},
	{
		name: 'an inner list',
		schema: variables({ type: 'object', properties: { name: NAME, tags: { type: 'array', title: 'Tags', items: { type: 'string', title: 'Tag' } } } }),
		formData: [
			{ name: 'north', tags: ['line-1', 'line-2', 'line-3'] },
			{ name: 'south', tags: ['line-4', 'line-5', 'line-6'] },
			{ name: 'east', tags: ['line-7', 'line-8', 'line-9'] }
		],
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
		formData: [
			{ name: 'broker-1', token: 'broker-token' },
			{ name: 'broker-2', certificate: 'broker-2-cert' },
			{ name: 'broker-3', token: 'broker-3-token' }
		],
		isFlat: false
	}
];

const CustomConnection = () => <span data-custom-field="connection">Custom connection</span>;
const MemoConnection = memo(CustomConnection);
export const CUSTOM_FIELD_SHAPES = [
	{ name: 'function', uiSchema: { 'ui:field': CustomConnection }, custom: true },
	{ name: 'registered name', uiSchema: { 'ui:field': 'Connection' }, custom: true },
	{ name: 'unknown name', uiSchema: { 'ui:field': 'MissingConnection' }, custom: false },
	{ name: 'memo object', uiSchema: { 'ui:field': MemoConnection }, custom: false },
	{ name: 'global function', uiSchema: {}, globalUiOptions: { label: true, field: CustomConnection }, custom: true }
] as const;
export const CUSTOM_FIELDS = { Connection: CustomConnection };

export const FIELD_WIDTH_SHAPES: readonly { name: string; value: unknown; fitted: string | undefined }[] = [
	{ name: 'absent', value: undefined, fitted: undefined },
	{ name: 'number', value: 640, fitted: 'min(640px, 100%)' },
	{ name: 'numeric string', value: ' 640 ', fitted: 'min(640px, 100%)' },
	{ name: 'pixels', value: '640px', fitted: 'min(640px, 100%)' },
	{ name: 'percentage', value: '80%', fitted: 'min(80%, 100%)' },
	{ name: 'expression', value: 'calc(100% - 20px)', fitted: 'min(calc(100% - 20px), 100%)' },
	{ name: 'keyword', value: 'unset', fitted: 'unset' },
	{ name: 'empty', value: '', fitted: '' },
	{ name: 'invalid object', value: { width: 640 }, fitted: undefined },
	{ name: 'boolean', value: true, fitted: undefined }
] as const;

const CONNECTION: RJSFSchema = { type: 'object', title: 'Connection', description: 'Configure the broker connection.', properties: { host: { type: 'string', title: 'Host' } } };
const CustomTitle = ({ title }: { title: string }) => <strong>{title}</strong>;
export const SECTION_HEADING_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema?: UiSchema;
	formData?: unknown;
	headings: { title: string; level: number }[];
}[] = [
	{ name: 'titled root', schema: CONNECTION, formData: { host: 'broker-1.local' }, headings: [{ title: 'Connection', level: 2 }] },
	{ name: 'UI title', schema: CONNECTION, uiSchema: { 'ui:title': 'Broker settings' }, headings: [{ title: 'Broker settings', level: 2 }] },
	{ name: 'option title', schema: CONNECTION, uiSchema: { 'ui:options': { title: 'Broker settings' } }, headings: [{ title: 'Broker settings', level: 2 }] },
	{ name: 'blank title', schema: CONNECTION, uiSchema: { 'ui:title': '' }, headings: [] },
	{ name: 'suppressed label', schema: CONNECTION, uiSchema: { 'ui:options': { label: false } }, headings: [] },
	{ name: 'untitled root', schema: { type: 'object', properties: { connection: CONNECTION } }, headings: [{ title: 'Connection', level: 2 }] },
	{
		name: 'untitled middle',
		schema: { type: 'object', title: 'Plant', properties: { settings: { type: 'object', properties: { connection: CONNECTION } } } },
		uiSchema: { settings: { 'ui:title': '' } },
		headings: [
			{ title: 'Plant', level: 2 },
			{ title: 'Connection', level: 3 }
		]
	},
	{
		name: 'deep sections',
		schema: OBJECT_SHAPES[8].schema,
		formData: OBJECT_SHAPES[8].formData,
		headings: Array.from({ length: 7 }, (_, i) => ({ title: `Level ${7 - i}`, level: Math.min(2 + i, 6) }))
	},
	{ name: 'object list', schema: { type: 'array', title: 'Connections', items: CONNECTION }, formData: [], headings: [{ title: 'Connections', level: 2 }] },
	{
		name: 'referenced object list',
		schema: { type: 'array', title: 'Connections', definitions: { connection: CONNECTION }, items: { $ref: '#/definitions/connection' } },
		formData: [],
		headings: [{ title: 'Connections', level: 2 }]
	},
	{ name: 'tuple', schema: { type: 'array', title: 'Endpoint', items: [{ type: 'string' }, { type: 'integer' }] }, formData: ['broker-1.local', 1883], headings: [] },
	{ name: 'custom object field', schema: CONNECTION, uiSchema: { 'ui:field': CustomConnection }, headings: [] },
	{
		name: 'hidden primitive',
		schema: { type: 'string', title: 'Secret', description: 'Hidden description.' },
		uiSchema: { 'ui:widget': 'hidden' },
		formData: 'token',
		headings: []
	},
	{ name: 'hidden custom object', schema: CONNECTION, uiSchema: { 'ui:widget': 'hidden', 'ui:field': CustomConnection }, headings: [] },
	{ name: 'global label suppressed', schema: CONNECTION, uiSchema: { 'ui:globalOptions': { label: false } }, headings: [] },
	{ name: 'registered schema id', schema: { ...CONNECTION, $id: 'Connection' }, headings: [] },
	{
		name: 'object multi-select',
		schema: { type: 'array', title: 'Sites', uniqueItems: true, items: { type: 'object', enum: [{ region: 'lisbon' }, { region: 'berlin' }] } },
		formData: [],
		headings: []
	}
];

export const SECTION_DESCRIPTION_SHAPES: readonly { name: string; uiSchema: UiSchema; position: string; description: string | undefined }[] = [
	{ name: 'default top', uiSchema: {}, position: 'top', description: CONNECTION.description },
	{ name: 'bottom', uiSchema: { 'ui:options': { descriptionPosition: 'bottom' } }, position: 'bottom', description: CONNECTION.description },
	{ name: 'blank override', uiSchema: { 'ui:description': '' }, position: 'top', description: undefined },
	{ name: 'none', uiSchema: { 'ui:options': { descriptionPosition: 'none' } }, position: 'none', description: undefined },
	{ name: 'custom title', uiSchema: { 'ui:TitleFieldTemplate': CustomTitle }, position: 'top', description: CONNECTION.description }
] as const;
const ArrayDescription = () => <p>Custom connections description.</p>;
const NoArrayDescription = (): null => null;
const CustomFieldLayout = ({ children }: FieldTemplateProps) => <div data-field-layout>{children}</div>;
const CustomArrayLayout = ({ items }: ArrayFieldTemplateProps) => (
	<div>
		{items.map(item => (
			<div key={item.key}>{item.children}</div>
		))}
	</div>
);
const globalArrayDescriptionOptions: UIOptionsType = { ArrayFieldTemplate: CustomArrayLayout, ArrayFieldDescriptionTemplate: ArrayDescription };
const globalNullArrayDescriptionOptions: UIOptionsType = { ArrayFieldTemplate: CustomArrayLayout, ArrayFieldDescriptionTemplate: NoArrayDescription };
export const ARRAY_DESCRIPTION_SHAPES: readonly { name: string; schema?: RJSFSchema; uiSchema: UiSchema; description: string | undefined }[] = [
	{ name: 'default', uiSchema: {}, description: 'Configure connection endpoints.' },
	{ name: 'custom description', uiSchema: { 'ui:ArrayFieldDescriptionTemplate': ArrayDescription }, description: 'Custom connections description.' },
	{ name: 'null description', uiSchema: { 'ui:ArrayFieldDescriptionTemplate': NoArrayDescription }, description: undefined },
	{
		name: 'global description with ignored global array layout',
		uiSchema: { 'ui:globalOptions': globalArrayDescriptionOptions },
		description: 'Custom connections description.'
	},
	{
		name: 'global null description with ignored global array layout',
		uiSchema: { 'ui:globalOptions': globalNullArrayDescriptionOptions },
		description: undefined
	},
	{ name: 'blank description', uiSchema: { 'ui:description': '' }, description: undefined },
	{ name: 'custom field layout', uiSchema: { 'ui:FieldTemplate': CustomFieldLayout }, description: 'Configure connection endpoints.' },
	{
		name: 'custom array layout',
		uiSchema: { 'ui:ArrayFieldTemplate': CustomArrayLayout, 'ui:ArrayFieldDescriptionTemplate': ArrayDescription },
		description: 'Configure connection endpoints.'
	},
	{
		name: 'nullable custom description',
		schema: { type: ['array', 'null'], title: 'Connections', description: 'Configure connection endpoints.', items: CONNECTION },
		uiSchema: { 'ui:ArrayFieldDescriptionTemplate': ArrayDescription },
		description: 'Custom connections description.'
	},
	{
		name: 'nullable null description',
		schema: { type: ['array', 'null'], title: 'Connections', description: 'Configure connection endpoints.', items: CONNECTION },
		uiSchema: { 'ui:ArrayFieldDescriptionTemplate': NoArrayDescription },
		description: undefined
	}
] as const;
export const DESCRIBED_CONNECTION_ARRAY: RJSFSchema = {
	type: 'array',
	title: 'Connections',
	description: 'Configure connection endpoints.',
	items: { ...CONNECTION, description: undefined }
};

export const ARRAY_ID_SHAPES = [
	{ name: 'object items', schema: DESCRIBED_CONNECTION_ARRAY },
	{ name: 'referenced items', schema: SECTION_HEADING_SHAPES[9].schema },
	{ name: 'tuple', schema: SECTION_HEADING_SHAPES[10].schema },
	{ name: 'nested arrays', schema: { type: 'array', title: 'Connections', items: DESCRIBED_CONNECTION_ARRAY } as RJSFSchema }
] as const;
export const ADDITIONAL_NAME_SHAPES = [
	{
		name: 'named connections',
		schema: { type: 'object', additionalProperties: CONNECTION } as RJSFSchema,
		formData: { backup: { host: 'broker-2.local' }, failover: { host: 'broker-3.local' } },
		names: ['backup', 'failover'],
		renamed: 'secondary'
	}
] as const;

export const ARRAY_TEMPLATE_SHAPES: readonly { name: string; schema: RJSFSchema; uiSchema: UiSchema; rendered: boolean }[] = [
	{ name: 'normal list', schema: DESCRIBED_CONNECTION_ARRAY, uiSchema: {}, rendered: true },
	{ name: 'tuple', schema: SECTION_HEADING_SHAPES[10].schema, uiSchema: {}, rendered: true },
	{ name: 'multi-select', schema: ASSET_SELECTION, uiSchema: {}, rendered: false },
	{ name: 'custom widget', schema: DESCRIBED_CONNECTION_ARRAY, uiSchema: { 'ui:widget': () => <span>Connection widget</span> }, rendered: false },
	{ name: 'files', schema: { type: 'array', items: { type: 'string', format: 'data-url' } }, uiSchema: {}, rendered: false },
	{ name: 'custom field', schema: DESCRIBED_CONNECTION_ARRAY, uiSchema: { 'ui:field': CustomConnection }, rendered: false },
	{ name: 'no items', schema: { type: 'array' }, uiSchema: {}, rendered: false }
];

export const ARRAY_TEMPLATE_OPTION_SHAPES = [
	{ name: 'registry template', global: false, local: false },
	{ name: 'global template', global: true, local: false },
	{ name: 'local template', global: false, local: true },
	{ name: 'local and global templates', global: true, local: true }
] as const;

export const OBJECT_LAYOUT_SHAPES: readonly { name: string; uiSchema: UiSchema; first: string | undefined; after: string[] }[] = [
	{ name: 'normal sections', uiSchema: {}, first: 'host', after: ['timeout'] },
	{ name: 'leading hidden', uiSchema: { host: { 'ui:widget': 'hidden' } }, first: 'connection', after: ['timeout'] },
	{ name: 'hidden between sections', uiSchema: { timeout: { 'ui:widget': 'hidden' } }, first: 'host', after: ['region'] },
	{ name: 'inline', uiSchema: { 'ui:inline': true }, first: undefined, after: ['timeout'] }
] as const;
export const OBJECT_LAYOUT_SCHEMA: RJSFSchema = {
	type: 'object',
	properties: { host: { type: 'string', title: 'Host' }, connection: CONNECTION, timeout: { type: 'integer', title: 'Timeout' }, region: { type: 'string', title: 'Region' } }
};
export const ADDITIONAL_LAYOUT_SHAPES: readonly { name: string; schema: RJSFSchema; uiSchema: UiSchema; formData: object; section: boolean }[] = [
	{
		name: 'default object',
		schema: { type: 'object', properties: { host: { type: 'string' } }, additionalProperties: CONNECTION },
		uiSchema: {},
		formData: { host: 'broker-1.local', backup: { host: 'broker-2.local' } },
		section: true
	},
	{
		name: 'custom object field',
		schema: { type: 'object', properties: { host: { type: 'string' } }, additionalProperties: CONNECTION },
		uiSchema: { additionalProperties: { 'ui:field': CustomConnection } },
		formData: { host: 'broker-1.local', backup: { host: 'broker-2.local' } },
		section: false
	},
	{
		name: 'custom array widget',
		schema: { type: 'object', properties: { host: { type: 'string' } }, additionalProperties: DESCRIBED_CONNECTION_ARRAY },
		uiSchema: { additionalProperties: { 'ui:widget': () => <span>Connection widget</span> } },
		formData: { host: 'broker-1.local', backup: [] },
		section: false
	}
];
export const BOOLEAN_PROPERTY_VALUES: readonly { name: string; data: { host: string; legacy?: unknown; removed?: string }; valid: boolean }[] = [
	{ name: 'absent', data: { host: 'broker-1.local' }, valid: true },
	{ name: 'string', data: { host: 'broker-1.local', legacy: 'broker-token' }, valid: true },
	{ name: 'zero', data: { host: 'broker-1.local', legacy: 0 }, valid: true },
	{ name: 'false', data: { host: 'broker-1.local', legacy: false }, valid: true },
	{ name: 'null', data: { host: 'broker-1.local', legacy: null }, valid: true },
	{ name: 'object', data: { host: 'broker-1.local', legacy: { region: 'lisbon' } }, valid: true },
	{ name: 'forbidden', data: { host: 'broker-1.local', removed: 'old-value' }, valid: false }
] as const;

export const OPTION_BRANCH_SHAPES = ['oneOf', 'anyOf'].map(keyword => ({
	name: keyword,
	schema: {
		type: 'object',
		title: 'Authentication',
		[keyword]: [
			{ type: 'object', title: 'Token', properties: { token: { type: 'string', title: 'Token value' } } },
			{ type: 'object', title: 'Certificate', properties: { certificate: { type: 'string', title: 'Certificate value' } } }
		]
	} as RJSFSchema,
	values: [{ token: 'broker-token' }, { certificate: 'broker-certificate' }]
}));

// Rows share schema objects (TOPICS, ENDPOINTS, NAME), so a test that mutated one would change
// other rows, and other tests. Frozen, the mutation throws where it happens.
[
	VALUE_CASES,
	CHOICE_SCHEMAS,
	CONTROL_NAME_SHAPES,
	MULTI_SELECT_SHAPES,
	INPUT_FOCUS_SHAPES,
	SELECT_FOCUS_SHAPES,
	FOCUS_EDITING_FLAGS,
	TOGGLE_FOCUS_MODES,
	TOGGLE_BUTTON_GROUP_SHAPES,
	ARRAY_SHAPES,
	FIELDSET_BACKGROUND_SHAPES,
	OBJECT_SHAPES,
	ACTION_NAME_SHAPES,
	SUBMIT_BUTTON_SHAPES,
	TEXTAREA_CONSUMER_SHAPES,
	TEXTAREA_EDITABILITY_SHAPES,
	TEXTAREA_VALIDATION_SHAPES,
	HELP_TEXT_CONSUMER_SHAPES,
	BROKER_SCHEMA,
	BROKER_FORM_DATA,
	ERROR_SHAPES,
	TEMPLATE_COMPONENTS,
	OPTION_SOURCES,
	LIST_OPTIONS,
	FLAT_OBJECT_SHAPES,
	CUSTOM_FIELD_SHAPES,
	CUSTOM_FIELDS,
	FIELD_WIDTH_SHAPES,
	SECTION_HEADING_SHAPES,
	SECTION_DESCRIPTION_SHAPES,
	ARRAY_DESCRIPTION_SHAPES,
	DESCRIBED_CONNECTION_ARRAY,
	ARRAY_TEMPLATE_SHAPES,
	ARRAY_TEMPLATE_OPTION_SHAPES,
	OBJECT_LAYOUT_SHAPES,
	OBJECT_LAYOUT_SCHEMA,
	BOOLEAN_PROPERTY_VALUES,
	OPTION_BRANCH_SHAPES,
	ADDITIONAL_LAYOUT_SHAPES,
	ARRAY_ID_SHAPES,
	ADDITIONAL_NAME_SHAPES
].forEach(deepFreeze);
