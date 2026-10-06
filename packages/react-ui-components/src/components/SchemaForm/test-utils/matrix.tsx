import {
	ArrayFieldTemplateProps,
	CustomValidator,
	ErrorSchema,
	ErrorTransformer,
	FieldProps,
	FieldTemplateProps,
	RJSFSchema,
	TemplatesType,
	UIOptionsType,
	UiSchema,
	WrapIfAdditionalTemplateProps,
	WidgetProps
} from '@rjsf/utils';
import React, { ComponentType, forwardRef, memo } from 'react';
import { StyleMode } from '@kelvininc/ui-components';
import { EApplyDefaults, SchemaFormContext } from '../types';

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

export const choiceForm = (row: { schema: RJSFSchema }, { required = false } = {}): RJSFSchema => ({
	type: 'object',
	title: 'Connection',
	properties: { choice: row.schema },
	required: required ? ['choice'] : []
});

/** Enum values keep their JSON types through the dropdown's string keys. */
export const CHOICE_VALUE_SHAPES: readonly { name: string; schema: RJSFSchema; values: unknown[]; labels: string[]; multiple?: boolean }[] = [
	{
		name: 'numeric and string keys',
		schema: { type: ['string', 'integer'], title: 'QoS', enum: [1, '1'], enumNames: ['Numeric QoS', 'Text QoS'] },
		values: [1, '1'],
		labels: ['Numeric QoS', 'Text QoS']
	},
	{
		name: 'null option',
		schema: { type: ['string', 'null'], title: 'Compression', enum: [null, 'gzip'], enumNames: ['None', 'Gzip'] },
		values: [null, 'gzip'],
		labels: ['None', 'Gzip']
	},
	{ name: 'boolean options', schema: { type: 'boolean', title: 'TLS', enum: [false, true] }, values: [false, true], labels: ['No', 'Yes'] },
	{ name: 'zero option', schema: { type: 'integer', title: 'Retries', enum: [0, 3], enumNames: ['None', 'Three'] }, values: [0, 3], labels: ['None', 'Three'] },
	{ name: 'empty string option', schema: { type: 'string', title: 'Security', enum: ['', 'tls'], enumNames: ['None', 'TLS'] }, values: ['', 'tls'], labels: ['None', 'TLS'] },
	{
		name: 'cloned object selections',
		schema: {
			type: 'array',
			title: 'Assets',
			uniqueItems: true,
			items: {
				type: 'object',
				properties: { asset: { type: 'string' } },
				enum: [{ asset: 'north' }, { asset: 'south' }],
				enumNames: ['North line', 'South line']
			} as RJSFSchema
		},
		values: [{ asset: 'north' }, { asset: 'south' }],
		labels: ['North line', 'South line'],
		multiple: true
	},
	{
		name: 'cloned array selections',
		schema: {
			type: 'array',
			title: 'Asset groups',
			uniqueItems: true,
			items: { type: 'array', enum: [['north'], ['south']], enumNames: ['North group', 'South group'] } as RJSFSchema
		},
		values: [['north'], ['south']],
		labels: ['North group', 'South group'],
		multiple: true
	}
];

export const DEFAULT_FIELD_SHAPES: readonly { name: string; schema: RJSFSchema; field: string }[] = [
	{ name: 'boolean', schema: { type: 'boolean', title: 'TLS' }, field: 'BooleanField' },
	{ name: 'string', schema: { type: 'string', title: 'Host' }, field: 'StringField' },
	{ name: 'number', schema: { type: 'number', title: 'Temperature' }, field: 'NumberField' },
	{ name: 'integer', schema: { type: 'integer', title: 'Retries' }, field: 'NumberField' },
	{ name: 'object', schema: { type: 'object', title: 'Connection' }, field: 'ObjectField' },
	{ name: 'array', schema: { type: 'array', title: 'Topics', items: { type: 'string' } }, field: 'ArrayField' },
	{ name: 'null', schema: { type: 'null', title: 'Compression' }, field: 'NullField' },
	{ name: 'nullable string', schema: { type: ['string', 'null'], title: 'Compression' }, field: 'StringField' },
	{ name: 'nullable boolean', schema: { type: ['null', 'boolean'], title: 'TLS' }, field: 'BooleanField' },
	{ name: 'inferred object', schema: { title: 'Connection', properties: { host: { type: 'string' } } }, field: 'ObjectField' },
	{ name: 'inferred enum', schema: { title: 'QoS', enum: ['at-most-once', 'at-least-once'] }, field: 'StringField' }
];

export const CUSTOM_DROPDOWN_SHAPES = [
	{ name: 'plain key', key: 'north-line' },
	{ name: 'key resembling an enum index', key: 'choice-0' }
] as const;

export const CHOICE_WIDGET_SHAPES: readonly { name: string; widget?: string; kind: 'default' | 'radio' | 'select' | 'checkbox' }[] = [
	{ name: 'default widget', widget: undefined, kind: 'default' },
	{ name: 'radio', widget: 'radio', kind: 'radio' },
	{ name: 'radio list', widget: 'RadioListWidget', kind: 'radio' },
	{ name: 'select', widget: 'select', kind: 'select' },
	{ name: 'checkbox', widget: 'checkbox', kind: 'checkbox' }
];

export const CHOICE_DISPATCH_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema & { 'ui:globalOptions'?: { widget?: string } };
	formatWidget?: 'radio' | 'custom';
	expected: 'radio' | 'select' | 'text' | 'email' | 'checkbox' | 'custom';
}[] = [
	{ name: 'default string enum', schema: CHOICE_SCHEMAS[1].schema, uiSchema: {}, expected: 'select' },
	{ name: 'default integer enum', schema: CHOICE_SCHEMAS[3].schema, uiSchema: {}, expected: 'select' },
	{ name: 'global radio ignored for a string enum', schema: CHOICE_SCHEMAS[1].schema, uiSchema: { 'ui:globalOptions': { widget: 'radio' } }, expected: 'select' },
	{
		name: 'global custom widget ignored for an integer enum',
		schema: CHOICE_SCHEMAS[3].schema,
		uiSchema: { 'ui:globalOptions': { widget: 'connectionChoice' } },
		expected: 'select'
	},
	{ name: 'supported email format', schema: { ...CHOICE_SCHEMAS[1].schema, format: 'email' }, uiSchema: {}, expected: 'email' },
	{ name: 'email format registered as a radio', schema: { ...CHOICE_SCHEMAS[1].schema, format: 'email' }, uiSchema: {}, formatWidget: 'radio', expected: 'radio' },
	{ name: 'email format registered as custom', schema: { ...CHOICE_SCHEMAS[1].schema, format: 'email' }, uiSchema: {}, formatWidget: 'custom', expected: 'custom' },
	{ name: 'integer radio format', schema: { ...CHOICE_SCHEMAS[3].schema, format: 'radio' }, uiSchema: {}, expected: 'radio' },
	{
		name: 'local widget overrides format',
		schema: { ...CHOICE_SCHEMAS[1].schema, format: 'email' },
		uiSchema: { 'ui:widget': 'select' },
		formatWidget: 'radio',
		expected: 'select'
	},
	{
		name: 'local options widget overrides global',
		schema: CHOICE_SCHEMAS[1].schema,
		uiSchema: { 'ui:options': { widget: 'radio' }, 'ui:globalOptions': { widget: 'select' } },
		expected: 'radio'
	},
	{ name: 'unknown format falls back to select', schema: { ...CHOICE_SCHEMAS[1].schema, format: 'kelvin-connection' }, uiSchema: {}, expected: 'select' },
	{ name: 'default text field', schema: { type: 'string', title: 'Broker' }, uiSchema: {}, expected: 'text' },
	{ name: 'default boolean ignores global widget', schema: CHOICE_SCHEMAS[0].schema, uiSchema: { 'ui:globalOptions': { widget: 'select' } }, expected: 'radio' },
	{ name: 'boolean uses local checkbox', schema: CHOICE_SCHEMAS[0].schema, uiSchema: { 'ui:widget': 'checkbox' }, expected: 'checkbox' }
];

export const CHOICE_INTERACTION_SHAPES = [
	{ name: 'editable', disabled: false, readonly: false },
	{ name: 'disabled', disabled: true, readonly: false },
	{ name: 'readonly', disabled: false, readonly: true }
] as const;

export const DEFAULTED_CHOICE_SHAPES: readonly { name: string; schema: RJSFSchema; value: boolean | string }[] = [
	{ name: 'defaulted boolean', schema: { type: 'boolean', title: 'TLS', default: true }, value: true },
	{ name: 'defaulted enum', schema: { type: 'string', title: 'QoS', enum: ['at-most-once', 'at-least-once'], default: 'at-least-once' }, value: 'at-least-once' }
];

export const RADIO_KEYBOARD_SHAPES = [
	{ name: 'compact radio', widget: 'radio' },
	{ name: 'described radio list', widget: 'RadioListWidget' }
] as const;

export const RADIO_STYLE_THEMES = [
	{ name: 'Light', mode: StyleMode.Light },
	{ name: 'Night', mode: StyleMode.Night }
] as const;

export const RADIO_INLINE_STYLE_SHAPES: readonly { name: string; schema: RJSFSchema; descriptions: string[]; value?: string; enumDisabled?: string[] }[] = [
	{
		name: 'unequal security labels and descriptions',
		schema: { type: 'string', title: 'Security', enum: ['tls', 'plaintext'], enumNames: ['TLS', 'Plaintext connection'] },
		descriptions: ['Encrypt the connection.', 'Send telemetry without encryption. Use this option only on the isolated test network while checking broker connectivity.']
	},
	{
		name: 'selected retry strategy with a disabled option',
		schema: { type: 'string', title: 'Retry strategy', enum: ['backoff', 'fixed'], enumNames: ['Exponential backoff', 'Fixed interval'] },
		descriptions: ['Increase the delay after each failed connection.', 'Reconnect every 30 seconds.'],
		value: 'backoff',
		enumDisabled: ['fixed']
	}
];

export const CHOICE_CLEAR_NAME_SHAPES = [
	{ name: 'field title', uiSchema: {}, expected: 'Clear selection for TLS' },
	{ name: 'ui title override', uiSchema: { 'ui:title': 'Transport security' }, expected: 'Clear selection for Transport security' },
	{ name: 'blank title fallback', uiSchema: { 'ui:title': ' ' }, expected: 'Clear selection for root_choice' }
] as const;

export const CHOICE_GROUP_NAME_SHAPES: readonly { name: string; uiSchema: UiSchema; expected: string }[] = [
	{ name: 'UI title override', uiSchema: { 'ui:title': 'Connection choices' }, expected: 'Connection choices' },
	{ name: 'empty UI title', uiSchema: { 'ui:title': '' }, expected: 'root_choice' },
	{ name: 'whitespace UI title', uiSchema: { 'ui:title': ' \t ' }, expected: 'root_choice' },
	{ name: 'padded UI title', uiSchema: { 'ui:title': ' Connection choices ' }, expected: 'Connection choices' }
];

export const RADIO_FOCUS_SHAPES: readonly { name: string; disabledValues: readonly string[]; expected?: string }[] = [
	{ name: 'enabled options', disabledValues: [], expected: 'at-most-once' },
	{ name: 'first option disabled', disabledValues: ['at-most-once'], expected: 'at-least-once' },
	{ name: 'all options disabled', disabledValues: ['at-most-once', 'at-least-once'], expected: undefined }
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
	{ name: 'default boolean radios', schema: CHOICE_SCHEMAS[0].schema, uiSchema: {}, formData: false, role: 'radio', labels: ['Yes', 'No'], nextValue: true },
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
	action: { label: string; nextData: unknown; menu?: string; menuAction?: string };
	download?: string;
}[] = [
	{
		name: 'list moves',
		schema: TOPICS,
		formData: ARRAY_SHAPES[0].formData,
		labels: ['Reorder Topic 1', 'Remove Topic 1', 'Reorder Topic 2', 'Remove Topic 2', 'Reorder Topic 3', 'Remove Topic 3', 'Add item to Topics'],
		action: { label: 'Move up', menu: 'Reorder Topic 2', menuAction: 'move-up', nextData: ['alarms', 'telemetry', 'commands'] }
	},
	{
		name: 'list prefix',
		schema: TOPICS,
		uiSchema: { 'ui:itemPrefix': 'Channel', 'items': { 'ui:itemPrefix': 'Channel' } },
		formData: ARRAY_SHAPES[0].formData,
		labels: ['Reorder Channel 1', 'Remove Channel 1', 'Reorder Channel 2', 'Remove Channel 2', 'Reorder Channel 3', 'Remove Channel 3', 'Add Channel'],
		action: { label: 'Remove Channel 2', nextData: ['telemetry', 'commands'] }
	},
	{
		name: 'untitled list',
		schema: { type: 'array', items: { type: 'string', default: 'new-topic' } },
		formData: ARRAY_SHAPES[0].formData,
		labels: ['Reorder Item 1', 'Remove Item 1', 'Reorder Item 2', 'Remove Item 2', 'Reorder Item 3', 'Remove Item 3', 'Add item'],
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
	{ name: 'undefined tree', extraErrors: undefined, messages: [] },
	{ name: 'null tree', extraErrors: null, messages: [] },
	{ name: 'primitive tree', extraErrors: 'Broker unreachable.', messages: [] },
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
	{
		name: 'sparse array hole',
		extraErrors: { brokers: [, { host: { __errors: ['Broker unreachable.'] } }] },
		messages: [{ id: 'root_brokers_1_host', message: 'Broker unreachable.' }]
	},
	{ name: 'undefined __errors', extraErrors: { port: { __errors: undefined } }, messages: [] },
	{ name: 'null __errors', extraErrors: { port: { __errors: null } }, messages: [] },
	{ name: 'string __errors', extraErrors: { port: { __errors: 'Port unavailable.' } }, messages: [] },
	{ name: 'mixed __errors', extraErrors: { port: { __errors: ['Port unavailable.', 1883] } }, messages: [] },
	{
		name: 'invalid branches next to a valid error',
		extraErrors: { site: undefined, port: null, obsolete: 1883, brokers: { 1: { host: { __errors: ['Broker unreachable.'] } } } },
		messages: [{ id: 'root_brokers_1_host', message: 'Broker unreachable.' }]
	},
	{
		name: 'array errors next to an empty sibling',
		extraErrors: { site: { __errors: [] }, brokers: [{ host: { __errors: ['Broker unreachable.'] } }] },
		messages: [{ id: 'root_brokers_0_host', message: 'Broker unreachable.' }]
	},
	{
		name: 'root and nested server errors',
		extraErrors: { __errors: ['Connection rejected.'], brokers: { 0: { host: { __errors: ['Broker unreachable.'] } } } },
		messages: [
			{ id: 'root', message: 'Connection rejected.' },
			{ id: 'root_brokers_0_host', message: 'Broker unreachable.' }
		]
	},
	{
		name: 'duplicate server messages',
		extraErrors: { port: { __errors: ['Port unavailable.', 'Port unavailable.'] } },
		messages: [
			{ id: 'root_port', message: 'Port unavailable.' },
			{ id: 'root_port', message: 'Port unavailable.' }
		]
	}
];

export const R2_SUBMIT_SCHEMA: RJSFSchema = {
	type: 'object',
	required: ['host'],
	properties: { host: { type: 'string', title: 'Host', minLength: 3 } }
};

type R2SubmitData = { host: string; legacy?: string };
type R2ExtraErrors = ErrorSchema<unknown> & Record<string, unknown>;
export type R2SubmitCase = {
	name: string;
	schema: RJSFSchema;
	formData: R2SubmitData;
	nextHost: string;
	omitExtraData: boolean;
	liveOmit: boolean;
	noValidate: boolean;
	extraErrorsBlockSubmit: boolean;
	extraErrors?: R2ExtraErrors;
	customValidate?: CustomValidator<R2SubmitData>;
	transformErrors?: ErrorTransformer<R2SubmitData>;
	submitted: boolean;
	wrapperSubmitted?: boolean;
	validatorMessages: string[];
	serverMessages: string[];
	changedData: R2SubmitData;
	submittedData: R2SubmitData;
};

const SUBMIT_FORM_DATA = { host: 'broker-1.local', legacy: 'obsolete connection setting' };
const SUBMIT_EXTRA_ERRORS = { host: { __errors: ['Broker unavailable.'] } };

/** Real RJSF submit contracts, including the raw empty-tree behavior our boundary sanitizes. */
export const R2_SUBMIT_CASES: readonly R2SubmitCase[] = [
	...[false, true].flatMap(omitExtraData =>
		[false, true].flatMap(liveOmit =>
			[false, true].flatMap(noValidate =>
				[false, true].flatMap(extraErrorsBlockSubmit =>
					[
						{ name: 'valid', nextHost: 'broker-2.local', valid: true },
						{ name: 'invalid', nextHost: 'x', valid: false }
					].map(({ name, nextHost, valid }) => ({
						name: `${name}; omit=${omitExtraData}; liveOmit=${liveOmit}; noValidate=${noValidate}; block=${extraErrorsBlockSubmit}`,
						schema: R2_SUBMIT_SCHEMA,
						formData: SUBMIT_FORM_DATA,
						nextHost,
						omitExtraData,
						liveOmit,
						noValidate,
						extraErrorsBlockSubmit,
						extraErrors: SUBMIT_EXTRA_ERRORS,
						submitted: noValidate || (valid && !extraErrorsBlockSubmit),
						validatorMessages: valid ? [] : ['must NOT have fewer than 3 characters'],
						serverMessages: ['Broker unavailable.'],
						changedData: omitExtraData && liveOmit ? { host: nextHost } : { ...SUBMIT_FORM_DATA, host: nextHost },
						submittedData: omitExtraData ? { host: nextHost } : { ...SUBMIT_FORM_DATA, host: nextHost }
					}))
				)
			)
		)
	),
	...[
		{ name: 'valid without server errors', nextHost: 'broker-2.local', submitted: true },
		{ name: 'invalid without server errors', nextHost: 'x', submitted: false }
	].map(({ name, nextHost, submitted }) => ({
		name,
		schema: R2_SUBMIT_SCHEMA,
		formData: SUBMIT_FORM_DATA,
		nextHost,
		omitExtraData: false,
		liveOmit: false,
		noValidate: false,
		extraErrorsBlockSubmit: true,
		submitted,
		validatorMessages: submitted ? [] : ['must NOT have fewer than 3 characters'],
		serverMessages: [] as string[],
		changedData: { ...SUBMIT_FORM_DATA, host: nextHost },
		submittedData: { ...SUBMIT_FORM_DATA, host: nextHost }
	})),
	...[false, true].map(noValidate => ({
		name: `empty blocking server tree; noValidate=${noValidate}`,
		schema: R2_SUBMIT_SCHEMA,
		formData: SUBMIT_FORM_DATA,
		nextHost: 'broker-2.local',
		omitExtraData: false,
		liveOmit: false,
		noValidate,
		extraErrorsBlockSubmit: true,
		extraErrors: {},
		submitted: noValidate,
		wrapperSubmitted: true,
		validatorMessages: [] as string[],
		serverMessages: [] as string[],
		changedData: { ...SUBMIT_FORM_DATA, host: 'broker-2.local' },
		submittedData: { ...SUBMIT_FORM_DATA, host: 'broker-2.local' }
	})),
	...[false, true].map(transform => ({
		name: transform ? 'transformErrors precedes customValidate' : 'customValidate rejects schema-valid data',
		schema: R2_SUBMIT_SCHEMA,
		formData: SUBMIT_FORM_DATA,
		nextHost: transform ? 'x' : 'broker-2.local',
		omitExtraData: false,
		liveOmit: false,
		noValidate: false,
		extraErrorsBlockSubmit: false,
		customValidate: ((_data, errors) => {
			errors.host.addError('Broker rejected by connection policy.');
			return errors;
		}) as CustomValidator<R2SubmitData>,
		transformErrors: transform
			? ((errors =>
					errors.map(error => ({
						...error,
						message: 'Use at least three host characters.',
						stack: 'Host: use at least three host characters.'
					}))) as ErrorTransformer<R2SubmitData>)
			: undefined,
		submitted: false,
		validatorMessages: transform ? ['Use at least three host characters.', 'Broker rejected by connection policy.'] : ['Broker rejected by connection policy.'],
		serverMessages: [] as string[],
		changedData: { ...SUBMIT_FORM_DATA, host: transform ? 'x' : 'broker-2.local' },
		submittedData: { ...SUBMIT_FORM_DATA, host: transform ? 'x' : 'broker-2.local' }
	}))
];

/** Initial Save gating and saved-data comparison; applied defaults keep counting as changes. */
export const R2_VALIDATION_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: unknown;
	submittedData: unknown;
	expectedFormData: unknown;
	valid: boolean;
	hasChanges: boolean;
}[] = [
	{
		name: 'valid dirty object',
		schema: R2_SUBMIT_SCHEMA,
		formData: { host: 'broker-2.local' },
		submittedData: { host: 'broker-1.local' },
		expectedFormData: { host: 'broker-2.local' },
		valid: true,
		hasChanges: true
	},
	{
		name: 'valid saved object',
		schema: R2_SUBMIT_SCHEMA,
		formData: { host: 'broker-1.local' },
		submittedData: { host: 'broker-1.local' },
		expectedFormData: { host: 'broker-1.local' },
		valid: true,
		hasChanges: false
	},
	{
		name: 'invalid dirty object',
		schema: R2_SUBMIT_SCHEMA,
		formData: { host: 'x' },
		submittedData: { host: 'broker-1.local' },
		expectedFormData: { host: 'x' },
		valid: false,
		hasChanges: true
	},
	{ name: 'missing saved data', schema: { type: 'object', properties: {} }, formData: {}, submittedData: undefined, expectedFormData: {}, valid: true, hasChanges: false },
	...[
		{ name: 'false', schema: { type: 'boolean', title: 'TLS' }, value: false, previous: true },
		{ name: 'zero', schema: { type: 'integer', title: 'Retries' }, value: 0, previous: 3 },
		{ name: 'empty string', schema: { type: 'string', title: 'Connection notes' }, value: '', previous: 'Plant broker' },
		{ name: 'null', schema: { type: ['string', 'null'], title: 'Compression', enum: ['gzip', null] }, value: null, previous: 'gzip' }
	].flatMap(({ name, schema, value, previous }) =>
		[false, true].map(hasChanges => ({
			name: `${name}; ${hasChanges ? 'dirty' : 'saved'}`,
			schema: schema as RJSFSchema,
			formData: value,
			submittedData: hasChanges ? previous : value,
			expectedFormData: value,
			valid: true,
			hasChanges
		}))
	),
	{
		name: 'inserted default differs from raw saved data',
		schema: { ...R2_SUBMIT_SCHEMA, properties: { ...R2_SUBMIT_SCHEMA.properties, port: { type: 'integer', title: 'Port', default: 1883 } } },
		formData: { host: 'broker-1.local' },
		submittedData: { host: 'broker-1.local' },
		expectedFormData: { host: 'broker-1.local', port: 1883 },
		valid: true,
		hasChanges: true
	}
];

/** Error help must describe its own control, including groups and repeated array-item fields. */
export const R2_ERROR_DESCRIPTION_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: unknown;
	extraErrors: R2ExtraErrors;
	fields: { id: string; label: string; tag: string; message: string }[];
}[] = [
	...[
		{ name: 'text', schema: { type: 'string', title: 'Broker' }, uiSchema: {}, formData: 'broker-1.local', tag: 'kv-text-field' },
		{ name: 'integer', schema: { type: 'integer', title: 'Port' }, uiSchema: {}, formData: 1883, tag: 'kv-text-field' },
		{ name: 'password', schema: { type: 'string', title: 'Access token' }, uiSchema: { 'ui:widget': 'password' }, formData: 'plant-token', tag: 'kv-text-field' },
		{ name: 'textarea', schema: { type: 'string', title: 'Connection notes' }, uiSchema: { 'ui:widget': 'textarea' }, formData: 'Plant broker', tag: 'kv-text-area' },
		{ name: 'single select', schema: { type: 'string', title: 'Compression', enum: ['gzip', 'none'] }, uiSchema: {}, formData: 'gzip', tag: 'kv-single-select-dropdown' },
		{
			name: 'multi select',
			schema: { type: 'array', title: 'Assets', uniqueItems: true, items: { type: 'string', enum: ['north-line', 'south-line'] } },
			uiSchema: {},
			formData: ['north-line'],
			tag: 'kv-multi-select-dropdown'
		},
		{ name: 'checkbox', schema: { type: 'boolean', title: 'TLS' }, uiSchema: { 'ui:widget': 'checkbox' }, formData: false, tag: 'kv-checkbox' },
		{ name: 'boolean radios', schema: { type: 'boolean', title: 'TLS' }, uiSchema: {}, formData: false, tag: 'kv-radio-list' },
		{
			name: 'enum radios',
			schema: { type: 'string', title: 'QoS', enum: ['at-most-once', 'at-least-once'] },
			uiSchema: { 'ui:widget': 'radio' },
			formData: 'at-most-once',
			tag: 'kv-radio-list'
		},
		{
			name: 'toggle choices',
			schema: { type: 'array', title: 'Assets', uniqueItems: true, items: { type: 'string', enum: ['north-line', 'south-line'] } },
			uiSchema: { 'ui:widget': 'toggleButtonGroup', 'ui:options': { withRadio: true } },
			formData: ['north-line'],
			tag: 'kv-toggle-button-group'
		}
	].map(({ name, schema, uiSchema, formData, tag }) => ({
		name,
		schema: schema as RJSFSchema,
		uiSchema: uiSchema as UiSchema,
		formData,
		extraErrors: { __errors: ['Review this connection setting.'] },
		fields: [{ id: 'root', label: schema.title!, tag, message: 'Review this connection setting.' }]
	})),
	{
		name: 'errors stay with their array item',
		schema: BROKER_SCHEMA,
		uiSchema: {},
		formData: BROKER_FORM_DATA,
		extraErrors: { brokers: { 0: { host: { __errors: ['Primary broker unavailable.'] } }, 1: { host: { __errors: ['Backup broker unavailable.'] } } } },
		fields: [
			{ id: 'root_brokers_0_host', label: 'Host', tag: 'kv-text-field', message: 'Primary broker unavailable.' },
			{ id: 'root_brokers_1_host', label: 'Host', tag: 'kv-text-field', message: 'Backup broker unavailable.' }
		]
	}
];

const MIXED_ERROR_SCHEMA: RJSFSchema = {
	...BROKER_SCHEMA,
	properties: {
		...BROKER_SCHEMA.properties,
		brokers: { ...(BROKER_SCHEMA.properties!.brokers as RJSFSchema), items: { type: 'object', properties: { host: { type: 'string', title: 'Host', minLength: 3 } } } }
	}
};

/** Server and validator errors remain separate even on the same field with the same message. */
export const R2_MIXED_ERROR_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: typeof BROKER_FORM_DATA;
	extraErrors: R2ExtraErrors;
	validatorMessage: string;
	serverMessage: string;
	fieldId: string;
	property: string;
}[] = [
	{ name: 'distinct messages on one array item', serverMessage: 'Backup broker unavailable.' },
	{ name: 'identical messages on one array item', serverMessage: 'must NOT have fewer than 3 characters' }
].map(({ name, serverMessage }) => ({
	name,
	schema: MIXED_ERROR_SCHEMA,
	formData: { ...BROKER_FORM_DATA, brokers: [{ host: 'broker-1.local' }, { host: 'x' }] },
	extraErrors: { brokers: { 1: { host: { __errors: [serverMessage] } } } },
	validatorMessage: 'must NOT have fewer than 3 characters',
	serverMessage,
	fieldId: 'root_brokers_1_host',
	property: '.brokers.1.host'
}));

/** An underscore in a sibling's name must not make it a descendant of the TLS section. */
export const R2_SECTION_ERROR_SHAPE = {
	schema: {
		type: 'object',
		title: 'Connection',
		properties: {
			tls: { type: 'object', title: 'TLS', properties: { host: { type: 'string', title: 'Host' } } },
			tls_version: { type: 'string', title: 'TLS version' }
		}
	} satisfies RJSFSchema,
	formData: { tls: { host: 'broker-1.local' }, tls_version: '1.3' },
	extraErrors: { __errors: ['Connection failed'], tls: { __errors: ['TLS failed'] }, tls_version: { __errors: ['Version failed'] } }
};

export const R2_RESET_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: { host: string };
	submittedData: Record<string, never>;
	expectedFormData: { host: string };
	expectedValid: boolean;
}[] = [false, true].map(expectedValid => ({
	name: expectedValid ? 'valid default replaces invalid data' : 'invalid default replaces valid data',
	schema: { type: 'object', properties: { host: { type: 'string', title: 'Host', minLength: 5, default: expectedValid ? 'broker-1.local' : 'a' } } },
	formData: { host: expectedValid ? 'a' : 'broker-2.local' },
	submittedData: {},
	expectedFormData: { host: expectedValid ? 'broker-1.local' : 'a' },
	expectedValid
}));

export const R2_BOUNDARY_TRANSITIONS = [
	{
		name: 'default policy changes',
		schema: { type: 'object', properties: { port: { type: 'integer', default: 1883 } } } as RJSFSchema,
		nextSchema: { type: 'object', properties: { port: { type: 'integer', default: 1883 } } } as RJSFSchema,
		nextApplyDefaults: EApplyDefaults.Never,
		expectedData: {}
	},
	{
		name: 'schema default changes',
		schema: { type: 'object', properties: { port: { type: 'integer', default: 1883 } } } as RJSFSchema,
		nextSchema: { type: 'object', properties: { port: { type: 'integer', default: 8883 } } } as RJSFSchema,
		nextApplyDefaults: EApplyDefaults.All,
		expectedData: { port: 8883 }
	}
];

const BROKER_WIDGET_ERROR = 'Broker unreachable.';
const BrokerErrorInput = ({ id, label, value, onChange }: WidgetProps<unknown>) => (
	<input id={id} aria-label={label} value={value ?? ''} onChange={event => onChange(event.target.value, { __errors: [BROKER_WIDGET_ERROR] })} />
);

/** Widget errors belong to the edited field until an external validation setting refreshes it. */
export const R2_WIDGET_ERROR_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: { host: string };
	nextHost: string;
	message: string;
	externalData: { host: string };
	externalMessage: string;
}[] = [
	{
		name: 'native broker widget rejects an otherwise valid host',
		schema: R2_SUBMIT_SCHEMA,
		uiSchema: { host: { 'ui:widget': BrokerErrorInput } },
		formData: { host: 'broker-1.local' },
		nextHost: 'broker-2.local',
		message: BROKER_WIDGET_ERROR,
		externalData: { host: 'x' },
		externalMessage: 'Must be at least 3 characters.'
	}
];

export const R2_WIDGET_ERROR_POLICIES: readonly { name: string; liveValidate: boolean }[] = [
	{ name: 'live validation', liveValidate: true },
	{ name: 'submit validation', liveValidate: false }
];

/** Controlled echoes and presentation callbacks leave widget errors attached to the edit. */
export const R2_WIDGET_ERROR_TRANSITIONS: readonly {
	name: string;
	controlled: boolean;
	change: 'none' | 'className' | 'submitCallback';
}[] = [false, true].flatMap(controlled =>
	(['none', 'className', 'submitCallback'] as const).map(change => ({
		name: `${controlled ? 'controlled' : 'uncontrolled'} ${change === 'none' ? 'edit' : change === 'className' ? 'form class change' : 'submit callback replacement'}`,
		controlled,
		change
	}))
);

/** A suspended external update must not replace edits in the render that stays committed. */
export const R2_ABANDONED_RENDER_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: { host: string };
	editedData: { host: string };
	pendingData: { host: string };
}[] = [
	{
		name: 'broker configuration update is abandoned after the form renders',
		schema: R2_SUBMIT_SCHEMA,
		formData: { host: 'broker-1.local' },
		editedData: { host: 'broker-2.local' },
		pendingData: { host: 'broker-3.local' }
	}
];

/** Instances with private policy state can compare equal while validating the same data differently. */
export const R2_VALIDATOR_IDENTITY_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: { host: string };
	editedData: { host: string };
	firstRejects: boolean;
	nextRejects: boolean;
	message: string;
}[] = [false, true].map(firstRejects => ({
	name: firstRejects ? 'replacement private policy accepts the broker' : 'replacement private policy rejects the broker',
	schema: R2_SUBMIT_SCHEMA,
	formData: { host: 'broker-1.local' },
	editedData: { host: 'broker-2.local' },
	firstRejects,
	nextRejects: !firstRejects,
	message: 'Broker rejected by connection policy.'
}));

/** The base schema and selected oneOf branch can mount the same field id at the same time. */
export const R2_SHARED_FIELD_ID_SHAPES = [
	{
		name: 'switching authentication removes the duplicate branch host',
		schema: {
			type: 'object',
			title: 'Connection',
			properties: {
				authentication: {
					type: 'object',
					title: 'Authentication',
					properties: { host: { type: 'string', title: 'Host' } },
					oneOf: [
						{
							type: 'object',
							title: 'Password',
							required: ['method'],
							properties: {
								method: { type: 'string', const: 'password' },
								host: { type: 'string', title: 'Host' },
								password: { type: 'string', title: 'Password' }
							}
						},
						{
							type: 'object',
							title: 'Certificate',
							required: ['method'],
							properties: { method: { type: 'string', const: 'certificate' }, certificate: { type: 'string', title: 'Certificate' } }
						}
					]
				}
			}
		} satisfies RJSFSchema,
		formData: { authentication: { host: 'broker-1.local', method: 'password', password: 'plant-token' } },
		extraErrors: { __errors: ['Connection failed'] },
		fieldId: 'root_authentication_host',
		parentId: 'root_authentication',
		selectorId: 'root_authentication__oneof_select',
		nextOption: '1',
		message: 'Connection failed'
	}
];

/** RJSF 5 keeps the selector suffix fixed while the owner's separator changes. */
export const R2_SELECTOR_OWNER_SHAPES = (['oneOf', 'anyOf'] as const).flatMap(keyword =>
	['_', '__', '/'].map(idSeparator => {
		const base = R2_SHARED_FIELD_ID_SHAPES[0];
		const { oneOf, ...authentication } = base.schema.properties.authentication;
		return {
			name: `${keyword} selector with separator ${idSeparator}`,
			idSeparator,
			schema: {
				...base.schema,
				properties: { authentication: { ...authentication, [keyword]: oneOf }, audit_mode: { type: 'string', title: 'Audit mode' } }
			} satisfies RJSFSchema,
			formData: base.formData,
			extraErrors: {
				__errors: ['Connection failed'],
				authentication: { __errors: ['Authentication failed'] },
				audit_mode: { __errors: ['Audit mode failed'] }
			},
			selectorId: `${['root', 'authentication'].join(idSeparator)}__${keyword.toLowerCase()}_select`
		};
	})
);

const FieldLayout = ({ children }: FieldTemplateProps) => <div data-field-layout="">{children}</div>;
const renderForwardLayout = ({ children }: FieldTemplateProps, ref: React.ForwardedRef<HTMLDivElement>) => (
	<div ref={ref} data-field-layout="">
		{children}
	</div>
);
const ForwardRefFieldLayout = forwardRef<HTMLDivElement, FieldTemplateProps>(renderForwardLayout);
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

export const L1_SCALAR_LIST_SHAPES = [
	{ name: 'strings', schema: TOPICS, formData: ['telemetry', 'alarms', 'commands'], itemName: 'Topic' },
	{ name: 'numbers', schema: { type: 'array', title: 'Intervals', items: { type: 'number', title: 'Interval' } } as RJSFSchema, formData: [0.5, 1.5, 2.5], itemName: 'Interval' },
	{ name: 'integers', schema: { type: 'array', title: 'Retries', items: { type: 'integer', title: 'Retry' } } as RJSFSchema, formData: [0, 1, 2], itemName: 'Retry' },
	{
		name: 'enums',
		schema: { type: 'array', title: 'Regions', items: { type: 'string', title: 'Region', enum: ['lisbon', 'berlin', 'austin'] } } as RJSFSchema,
		formData: ['lisbon', 'berlin', 'austin'],
		itemName: 'Region'
	}
];

export const L1_PREFIX_SHAPES = [
	{ name: 'item prefix', uiSchema: { items: { 'ui:itemPrefix': 'Broker' } } },
	{ name: 'array prefix', uiSchema: { 'ui:itemPrefix': 'Broker' } },
	{ name: 'options prefix', uiSchema: { 'ui:options': { itemPrefix: 'Broker' } } },
	{ name: 'item options prefix', uiSchema: { items: { 'ui:options': { itemPrefix: 'Broker' } } } }
];

export const L1_TUPLE_SHAPES = [
	{ name: 'schema titles', uiSchema: {}, labels: ['Primary', 'Backup 2'] },
	{
		name: 'position prefixes',
		uiSchema: { items: [{ 'ui:itemPrefix': 'Primary broker' }], additionalItems: { 'ui:itemPrefix': 'Backup broker' } },
		labels: ['Primary broker', 'Backup broker 2']
	},
	{
		name: 'options prefixes',
		uiSchema: { items: [{ 'ui:options': { itemPrefix: 'Primary broker' } }], additionalItems: { 'ui:options': { itemPrefix: 'Backup broker' } } },
		labels: ['Primary broker', 'Backup broker 2']
	},
	{ name: 'array prefix preserves fixed title', uiSchema: { 'ui:itemPrefix': 'Broker' }, labels: ['Primary', 'Broker 2'] }
] satisfies { name: string; uiSchema: UiSchema; labels: string[] }[];

export const L1_ALIGNMENT_SHAPES: {
	name: string;
	uiSchema: UiSchema<Record<number, unknown>, RJSFSchema, SchemaFormContext>;
	extraErrors?: ErrorSchema<Record<number, unknown>>;
	message?: string;
	defaultHelper?: boolean;
}[] = [
	{ name: 'plain', uiSchema: {}, extraErrors: undefined },
	{ name: 'bottom description', uiSchema: { items: { 'ui:description': 'The plant topic to receive.' } }, message: 'The plant topic to receive.' },
	{ name: 'top description', uiSchema: { items: { 'ui:description': 'The plant topic to receive.', 'ui:descriptionPosition': 'top' } }, message: 'The plant topic to receive.' },
	{ name: 'visible errors', uiSchema: {}, extraErrors: { 0: { __errors: ['Topic is unavailable.'] } }, message: 'Topic is unavailable.' },
	{ name: 'help tip', uiSchema: { items: { 'ui:help': 'Use the plant topic name.' } }, message: 'Use the plant topic name.' },
	{ name: 'default helper', uiSchema: { items: { 'ui:showDefaultValueHelper': true } }, defaultHelper: true, message: 'Default value is: ' }
];

export const L1_HIDDEN_ITEM_HEADINGS = [
	{ name: 'blank title', uiSchema: { items: { 'ui:title': '' } } },
	{ name: 'blank options title', uiSchema: { items: { 'ui:options': { title: '' } } } },
	{ name: 'hidden label', uiSchema: { items: { 'ui:label': false } } }
];

const WrappedItem = ({ children }: WrapIfAdditionalTemplateProps) => <div data-custom-item-wrap>{children}</div>;
const nestedBrokers = {
	schema: {
		type: 'array',
		title: 'Groups',
		items: {
			type: 'object',
			title: 'Group',
			properties: {
				name: NAME,
				brokers: { type: 'array', title: 'Brokers', items: { type: 'object', title: 'Broker', properties: { host: { type: 'string', title: 'Host' } } } }
			}
		}
	} as RJSFSchema,
	formData: ['north', 'south', 'east'].map((name, index) => ({ name, brokers: [{ host: `broker-${index * 2 + 1}.local` }, { host: `broker-${index * 2 + 2}.local` }] }))
};
export const L1_FIELDSET_SHAPES: {
	name: string;
	row: { schema: RJSFSchema; formData: unknown[] };
	uiSchema: UiSchema;
	templates?: Partial<TemplatesType>;
	headers: number;
	overlays: number;
	menus: number;
}[] = [
	{ name: 'item actions', row: ARRAY_SHAPES[2], uiSchema: { items: { 'ui:fieldset': true } }, headers: 3, overlays: 3, menus: 3 },
	{
		name: 'no item actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { orderable: false, removable: false }, 'items': { 'ui:fieldset': true } },
		headers: 3,
		overlays: 3,
		menus: 0
	},
	{
		name: 'blank title without actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { orderable: false, removable: false }, 'items': { 'ui:fieldset': true, 'ui:title': '' } },
		headers: 0,
		overlays: 0,
		menus: 0
	},
	{
		name: 'hidden label without actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { orderable: false, removable: false }, 'items': { 'ui:fieldset': true, 'ui:label': false } },
		headers: 0,
		overlays: 0,
		menus: 0
	},
	{
		name: 'custom wrapping template without actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { orderable: false, removable: false }, 'items': { 'ui:fieldset': true } },
		templates: { WrapIfAdditionalTemplate: WrappedItem },
		headers: 3,
		overlays: 3,
		menus: 0
	},
	{ name: 'nested plain items', row: nestedBrokers, uiSchema: { items: { 'ui:fieldset': true } }, headers: 9, overlays: 3, menus: 9 },
	{
		name: 'nested fieldset items',
		row: nestedBrokers,
		uiSchema: { items: { 'ui:fieldset': true, 'brokers': { items: { 'ui:fieldset': true } } } },
		headers: 9,
		overlays: 9,
		menus: 9
	}
];

// RJSF 5 renders no fields for these schemas; existing items must still be movable and removable.
export const L1_EMPTY_ITEM_SCHEMAS = [
	{ name: 'unconstrained items', schema: { type: 'array', title: 'Brokers', items: {} } as RJSFSchema },
	{ name: 'empty fixed-item tuple', schema: { type: 'array', title: 'Brokers', items: [], additionalItems: { type: 'string', title: 'Backup' } } as RJSFSchema }
].map(row => ({ ...row, formData: ['broker-1.local', 'broker-2.local', 'broker-3.local'], uiSchema: { 'ui:itemPrefix': 'Broker' } }));

const ItemArrayLayout = ({ items, registry, idSchema }: ArrayFieldTemplateProps) => {
	const Item = registry.templates.ArrayFieldItemTemplate;
	return (
		<div data-custom-array-layout={idSchema.$id}>
			{items.map(({ key, ...item }) => (
				<Item key={key} {...item} />
			))}
		</div>
	);
};
export const L1_ARRAY_TEMPLATE_SHAPES = [
	{ name: 'custom ordered list', row: ARRAY_SHAPES[0], uiSchema: {}, menus: 3, labels: [] },
	{ name: 'custom unordered list', row: ARRAY_SHAPES[0], uiSchema: { 'ui:options': { orderable: false } }, menus: 0, labels: [] },
	{ name: 'custom tuple', row: ARRAY_SHAPES[3], uiSchema: {}, menus: 1, labels: ['Primary', 'Backup 2'] },
	{
		name: 'nested custom arrays keep their own ordering and names',
		row: ARRAY_SHAPES[7],
		uiSchema: { 'ui:options': { orderable: false, itemPrefix: 'Zone' }, 'items': { tags: { 'ui:options': { orderable: true, itemPrefix: 'Tag' } } } },
		menus: 12,
		labels: []
	}
].map(row => ({ ...row, ArrayTemplate: ItemArrayLayout }));

export const L1_UNION_LIST_SHAPES = (['oneOf', 'anyOf'] as const).flatMap(keyword => [
	{
		name: `${keyword} object items`,
		schema: {
			type: 'array',
			title: 'Connections',
			items: {
				type: 'object',
				title: 'Connection',
				[keyword]: [
					{ type: 'object', title: 'Token', required: ['token'], properties: { token: { type: 'string', title: 'Token' } } },
					{ type: 'object', title: 'Certificate', required: ['certificate'], properties: { certificate: { type: 'string', title: 'Certificate' } } }
				]
			}
		} as RJSFSchema,
		formData: [{ token: 'plant-token' }, { certificate: 'plant-certificate' }],
		section: true,
		itemName: 'Connection'
	},
	{
		name: `${keyword} scalar items`,
		schema: {
			type: 'array',
			title: 'Broker addresses',
			items: {
				title: 'Address',
				[keyword]: [
					{ type: 'string', title: 'Host' },
					{ type: 'integer', title: 'Port' }
				]
			}
		} as RJSFSchema,
		formData: ['broker-1.local', 1883],
		section: false,
		itemName: 'Address'
	}
]);

const ArrayItemInput = ({ idSchema, title, formData, onChange }: FieldProps) => (
	<input data-array-item-input id={idSchema.$id} aria-label={title} value={formData ?? ''} onChange={event => onChange(event.target.value)} />
);
const ForwardRefArrayItemInput = forwardRef<HTMLInputElement, FieldProps>(({ idSchema, title, formData, onChange }, ref) => (
	<input ref={ref} data-array-item-input id={idSchema.$id} aria-label={title} value={formData ?? ''} onChange={event => onChange(event.target.value)} />
));
ForwardRefArrayItemInput.displayName = 'ForwardRefArrayItemInput';
export const L1_ITEM_FIELD_COMPONENTS = [
	{ name: 'function', ItemField: ArrayItemInput },
	{ name: 'React.memo', ItemField: memo(ArrayItemInput) },
	{ name: 'forwardRef', ItemField: ForwardRefArrayItemInput }
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
	{ name: 'default field name', uiSchema: { 'ui:field': 'ObjectField' }, custom: false },
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

export const R4_OPTION_SHAPES = (['oneOf', 'anyOf'] as const).map(keyword => ({
	name: keyword,
	keyword,
	selectorId: `root_auth__${keyword.toLowerCase()}_select`,
	schema: {
		type: 'object',
		title: 'Broker connection',
		properties: {
			name: { type: 'string', title: 'Connection name' },
			auth: {
				title: 'Authentication',
				[keyword]: [
					{ type: 'string', title: 'Token' },
					{
						type: 'object',
						title: 'Broker address',
						properties: { host: { type: 'string', title: 'Host' }, port: { type: 'integer', title: 'Port' }, region: { type: 'string', title: 'Region' } }
					}
				]
			},
			hidden: { type: 'string', title: 'Internal label' },
			audit: { type: 'string', title: 'Audit mode' }
		}
	} as RJSFSchema,
	uiSchema: { hidden: { 'ui:widget': 'hidden' } } satisfies UiSchema,
	values: ['broker-token', { host: 'broker.local', port: 1883, region: 'lisbon' }]
}));

export const R4_UI_SETTING_SHAPES = [
	{ name: 'ui keys', build: (settings: UIOptionsType): UiSchema => Object.fromEntries(Object.entries(settings).map(([key, value]) => [`ui:${key}`, value])) },
	{ name: 'ui options', build: (settings: UIOptionsType): UiSchema => ({ 'ui:options': settings }) }
];

export const R4_CLASS_SETTING_SHAPES = [...R4_UI_SETTING_SHAPES, { name: 'legacy classNames', build: ({ classNames }: UIOptionsType): UiSchema => ({ classNames }) }];
export const R4_SUBMIT_UI_SHAPES = [
	...R4_UI_SETTING_SHAPES,
	{ name: 'direct then options', build: (settings: UIOptionsType): UiSchema => ({ ...R4_UI_SETTING_SHAPES[0].build(settings), 'ui:options': {} }) },
	{ name: 'options then direct', build: (settings: UIOptionsType): UiSchema => ({ 'ui:options': {}, ...R4_UI_SETTING_SHAPES[0].build(settings) }) }
];

export const R4_HETEROGENEOUS_ORDER_SHAPES = (['oneOf', 'anyOf'] as const).map(keyword => ({
	name: keyword,
	keyword,
	schema: {
		type: 'object',
		properties: {
			auth: {
				[keyword]: [
					{ type: 'object', title: 'Broker address', properties: { host: { type: 'string' }, port: { type: 'integer' }, region: { type: 'string' } } },
					{ type: 'object', title: 'Credentials', properties: { username: { type: 'string' }, password: { type: 'string' } } }
				]
			}
		}
	} as RJSFSchema,
	order: ['port', 'username', 'host'],
	branches: [
		{ formData: { auth: { host: 'broker.local', port: 1883, region: 'lisbon' } }, expected: ['port', 'host', 'region'] },
		{ formData: { auth: { username: 'broker-admin', password: 'broker-token' } }, expected: ['username', 'password'] }
	]
}));

export const R4_RAIL_VISIBILITY_SHAPES: readonly { name: string; properties: RJSFSchema['properties']; uiSchema: UiSchema; visible: boolean }[] = [
	{ name: 'bare empty object', properties: {}, uiSchema: {}, visible: false },
	{ name: 'titled empty object', properties: {}, uiSchema: { 'ui:label': true }, visible: true },
	{ name: 'hidden object', properties: { host: { type: 'string', title: 'Host' } }, uiSchema: { 'ui:widget': 'hidden' }, visible: false }
];

export const R4_EMPTY_BRANCH_TEMPLATES = [
	{
		name: 'heading beside empty object',
		FieldLayout: ({ children }: FieldTemplateProps) => (
			<>
				<h3>No authentication required</h3>
				<div>{children}</div>
			</>
		),
		visible: true
	},
	{
		name: 'text beside empty object',
		FieldLayout: ({ children }: FieldTemplateProps) => <div>No authentication required{children}</div>,
		visible: true
	},
	{
		name: 'heading beside default template',
		FieldLayout: (props: FieldTemplateProps) => {
			const Default = props.registry.templates.FieldTemplate;
			return (
				<>
					<h3>No authentication required</h3>
					<Default {...props} />
				</>
			);
		},
		visible: true
	},
	{
		name: 'text beside default template',
		FieldLayout: (props: FieldTemplateProps) => {
			const Default = props.registry.templates.FieldTemplate;
			return (
				<>
					No authentication required
					<Default {...props} />
				</>
			);
		},
		visible: true
	},
	{ name: 'empty custom template', FieldLayout: (): null => null, visible: false }
];

const R4_EMPTY_CHOICE = { 'ui:title': 'None', 'broker': { 'ui:options': { region: 'lisbon' } } };
const R4_SAVED_CHOICE = { 'ui:title': 'Plant broker' };
export const R4_OPTION_PAYLOAD_SHAPE = {
	schema: { type: 'object', properties: { broker: { title: 'Broker profile', enum: [R4_EMPTY_CHOICE, R4_SAVED_CHOICE] } } } as RJSFSchema,
	formData: { broker: R4_SAVED_CHOICE },
	emptyValue: R4_EMPTY_CHOICE,
	customOptions: { 'ui:placeholder': 'Broker address' }
};

export const R4_OPTION_OVERRIDE_SHAPES = [
	{ name: 'empty enum value', option: 'emptyValue', inherited: { ...R4_EMPTY_CHOICE, region: 'lisbon' }, provided: R4_EMPTY_CHOICE, expected: R4_EMPTY_CHOICE },
	{
		name: 'custom widget configuration',
		option: 'customOptions',
		inherited: { 'ui:placeholder': 'Old broker', 'region': 'lisbon' },
		provided: R4_OPTION_PAYLOAD_SHAPE.customOptions,
		expected: { ...R4_OPTION_PAYLOAD_SHAPE.customOptions, region: 'lisbon' }
	},
	{
		name: 'submit button configuration',
		option: 'submitButtonOptions',
		inherited: { submitText: 'Save connection', props: { disabled: true } },
		provided: { submitText: 'Connect broker' },
		expected: { submitText: 'Connect broker', props: { disabled: true } }
	}
];
export const R4_OPTION_PAYLOAD_UNIONS = (['oneOf', 'anyOf'] as const).map(keyword => ({
	name: keyword,
	keyword,
	schema: {
		type: 'object',
		properties: {
			broker: {
				title: 'Broker connection',
				[keyword]: [
					{ title: 'Broker profile', enum: [R4_EMPTY_CHOICE, R4_SAVED_CHOICE] },
					{ type: 'boolean', title: 'Skip broker' }
				]
			}
		}
	} as RJSFSchema
}));

export const R4_TEMPLATE_PLACEMENTS = ['field', 'branch', 'inherited child'] as const;
export const R4_SAME_RENDER_TEMPLATES = [
	{ name: 'memo around the same function', build: () => memo(FieldLayout) },
	{ name: 'forwardRef around the same function', build: () => forwardRef<HTMLDivElement, FieldTemplateProps>(renderForwardLayout) }
];
export const R4_BRANCH_LABEL_SHAPES = [
	{ name: 'default hidden title', parent: true, branch: undefined, expected: false },
	{ name: 'explicit shown branch title', parent: false, branch: true, expected: true },
	{ name: 'explicit hidden branch title', parent: true, branch: false, expected: false }
];
export const R4_REPORT_SCOPE_SHAPES = [
	{ name: 'independent forms', nested: false },
	{ name: 'nested objects', nested: true }
] as const;

const R4_REFERENCED_ADDRESS = {
	type: 'object',
	title: 'Broker address',
	properties: { host: { type: 'string', title: 'Host' }, port: { type: 'integer', title: 'Port' } }
} satisfies RJSFSchema;
export const R4_COMPOSED_BRANCH_SHAPES = [
	{
		name: 'referenced object',
		definitions: { BrokerAddress: R4_REFERENCED_ADDRESS },
		branch: { $ref: '#/definitions/BrokerAddress' }
	},
	{
		name: 'allOf object',
		definitions: { BrokerAddress: R4_REFERENCED_ADDRESS },
		branch: { allOf: [{ $ref: '#/definitions/BrokerAddress' }, { properties: { region: { type: 'string', title: 'Region' } } }] }
	}
];

export const R4_ORDER_SHAPES: readonly { name: string; parent: UiSchema; branch: UiSchema; expected: string[] }[] = [
	{ name: 'parent order', parent: { 'ui:order': ['port', 'host'] }, branch: {}, expected: ['port', 'host', 'region'] },
	{ name: 'parent option order', parent: { 'ui:options': { order: ['port', 'host'] } }, branch: {}, expected: ['port', 'host', 'region'] },
	{ name: 'existing wildcard', parent: { 'ui:order': ['port', '*'] }, branch: {}, expected: ['port', 'host', 'region'] },
	{ name: 'branch order', parent: { 'ui:order': ['port', 'host'] }, branch: { 'ui:order': ['region'] }, expected: ['region', 'host', 'port'] },
	{ name: 'branch option order', parent: { 'ui:order': ['port', 'host'] }, branch: { 'ui:options': { order: ['region'] } }, expected: ['region', 'host', 'port'] },
	{ name: 'empty branch order', parent: { 'ui:order': ['port', 'host'] }, branch: { 'ui:order': [] }, expected: ['host', 'port', 'region'] }
];

export const R4_BRANCH_PRESENTATIONS: readonly { name: string; uiSchema: UiSchema; section: boolean; inline?: boolean }[] = [
	{ name: 'standard object', uiSchema: {}, section: true },
	{ name: 'branch UI title', uiSchema: { 'ui:title': 'Configured broker' }, section: true },
	{ name: 'hidden branch', uiSchema: { 'ui:widget': 'hidden' }, section: false },
	{ name: 'branch custom field', uiSchema: { 'ui:field': CustomConnection }, section: false },
	{ name: 'branch custom field in options', uiSchema: { 'ui:options': { field: CustomConnection } }, section: false },
	{ name: 'inline parent', uiSchema: {}, section: true, inline: true }
];

export const R4_OPTION_ERROR_SHAPES = (['oneOf', 'anyOf'] as const).map(keyword => ({
	name: keyword,
	schema: {
		type: 'object',
		properties: {
			security: {
				type: 'object',
				title: 'Security',
				[keyword]: [
					{ title: 'Plaintext', properties: { protocol: { const: 'PLAINTEXT', default: 'PLAINTEXT' } }, required: ['protocol'] },
					{
						title: 'SASL',
						properties: {
							protocol: { const: 'SASL_PLAINTEXT', default: 'SASL_PLAINTEXT' },
							sasl: {
								type: 'object',
								title: 'SASL Authentication',
								properties: { username: { type: 'string', title: 'Username' }, password: { type: 'string', title: 'Password' } },
								required: ['username', 'password']
							}
						},
						required: ['protocol', 'sasl']
					}
				]
			}
		}
	} satisfies RJSFSchema,
	formData: { security: { protocol: 'SASL_PLAINTEXT', sasl: {} } },
	uiSchema: { security: { protocol: { 'ui:widget': 'hidden' } } } satisfies UiSchema,
	selectorId: `root_security__${keyword.toLowerCase()}_select`
}));

const NativeBrokerHost = ({ id, label, value, onChange, required, disabled, readonly }: WidgetProps<unknown>) => (
	<input id={id} name={id} aria-label={label} value={value ?? ''} required={required} disabled={disabled} readOnly={readonly} onChange={event => onChange(event.target.value)} />
);
const NATIVE_SUBMIT_SCHEMA: RJSFSchema = {
	type: 'object',
	title: 'Connection',
	required: ['host', 'secret'],
	properties: { host: { type: 'string', title: 'Broker host' }, secret: { type: 'string', title: 'Client secret' } }
};

export type R2NativeSubmitData = { host: string; secret?: string };

/** Enter and imperative submission must reveal errors on fields the user hasn't touched. */
export const R2_NATIVE_SUBMIT_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: R2NativeSubmitData;
	submittedData: R2NativeSubmitData;
	extraErrors?: R2ExtraErrors;
	accepted: boolean;
	message: string;
}[] = [
	{
		name: 'missing client secret fails validation',
		schema: NATIVE_SUBMIT_SCHEMA,
		uiSchema: { host: { 'ui:widget': NativeBrokerHost } },
		formData: { host: 'broker-1.local' },
		submittedData: { host: 'broker-0.local', secret: 'saved-client-secret' },
		accepted: false,
		message: 'This field is required.'
	},
	{
		name: 'valid connection submits with a nonblocking client secret error',
		schema: NATIVE_SUBMIT_SCHEMA,
		uiSchema: { host: { 'ui:widget': NativeBrokerHost } },
		formData: { host: 'broker-1.local', secret: 'plant-client-secret' },
		submittedData: { host: 'broker-0.local', secret: 'saved-client-secret' },
		extraErrors: { secret: { __errors: ['Client secret rejected by broker.'] } },
		accepted: true,
		message: 'Client secret rejected by broker.'
	}
];

export type R2ScalarValue = string | number | boolean | null;

/** Discard emits the saved scalar verbatim; an omitted value uses the field's normal defaults. */
export const R2_SCALAR_DISCARD_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema?: UiSchema;
	formData: R2ScalarValue;
	submittedData?: R2ScalarValue;
	label: string;
	control: 'input' | 'checkbox';
}[] = [
	{
		name: 'missing saved broker host without a default',
		schema: { type: 'string', title: 'Broker host' },
		formData: 'broker-2.local',
		label: 'Broker host',
		control: 'input'
	},
	{
		name: 'missing saved port without a default',
		schema: { type: 'integer', title: 'Port' },
		formData: 8883,
		label: 'Port',
		control: 'input'
	},
	{
		name: 'missing saved TLS setting without a default',
		schema: { type: 'boolean', title: 'TLS' },
		uiSchema: { 'ui:widget': 'checkbox' },
		formData: true,
		label: 'TLS',
		control: 'checkbox'
	},
	{
		name: 'missing saved broker host restores its default',
		schema: { type: 'string', title: 'Broker host', default: 'broker-0.local' },
		formData: 'broker-2.local',
		label: 'Broker host',
		control: 'input'
	},
	{
		name: 'missing saved port restores its zero default',
		schema: { type: 'integer', title: 'Port', default: 0 },
		formData: 8883,
		label: 'Port',
		control: 'input'
	},
	{
		name: 'missing saved TLS setting restores its false default',
		schema: { type: 'boolean', title: 'TLS', default: false },
		uiSchema: { 'ui:widget': 'checkbox' },
		formData: true,
		label: 'TLS',
		control: 'checkbox'
	},
	{
		name: 'saved false overrides a true TLS default',
		schema: { type: 'boolean', title: 'TLS', default: true },
		uiSchema: { 'ui:widget': 'checkbox' },
		formData: true,
		submittedData: false,
		label: 'TLS',
		control: 'checkbox'
	},
	{
		name: 'saved zero overrides the retry default',
		schema: { type: 'integer', title: 'Retries', default: 3 },
		formData: 3,
		submittedData: 0,
		label: 'Retries',
		control: 'input'
	},
	{
		name: 'saved empty name overrides the connection name default',
		schema: { type: 'string', title: 'Connection name', default: 'Plant broker' },
		formData: 'Plant broker',
		submittedData: '',
		label: 'Connection name',
		control: 'input'
	},
	{
		name: 'saved null overrides the nullable compression default',
		schema: { type: ['string', 'null'], title: 'Compression', default: 'gzip' },
		formData: 'gzip',
		submittedData: null,
		label: 'Compression',
		control: 'input'
	}
];

/** Keeping certificate data unchanged isolates file error visibility from file-list synchronization. */
export const R2_FILE_ERROR_VISIBILITY_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	formData: { certificate: unknown; host: string };
	submittedData: { certificate: unknown; host: string };
	extraErrors: R2ExtraErrors;
	fieldId: string;
	message: string;
	rowCount: number;
}[] = ACTION_NAME_SHAPES.filter(row => row.download).map(row => ({
	name: row.name,
	schema: { type: 'object', title: 'Connection', properties: { certificate: row.schema, host: { type: 'string', title: 'Host' } } },
	uiSchema: { certificate: row.uiSchema },
	formData: { certificate: row.formData, host: 'edited-broker.local' },
	submittedData: { certificate: row.formData, host: 'saved-broker.local' },
	extraErrors: { certificate: { __errors: ['Review this certificate.'] } },
	fieldId: 'root_certificate',
	message: 'Review this certificate.',
	rowCount: Array.isArray(row.formData) ? row.formData.length : 1
}));

// Rows share schema objects (TOPICS, ENDPOINTS, NAME), so a test that mutated one would change
// other rows, and other tests. Frozen, the mutation throws where it happens.
[
	VALUE_CASES,
	CHOICE_SCHEMAS,
	CHOICE_VALUE_SHAPES,
	DEFAULT_FIELD_SHAPES,
	CUSTOM_DROPDOWN_SHAPES,
	CHOICE_WIDGET_SHAPES,
	CHOICE_DISPATCH_SHAPES,
	CHOICE_INTERACTION_SHAPES,
	DEFAULTED_CHOICE_SHAPES,
	RADIO_KEYBOARD_SHAPES,
	RADIO_STYLE_THEMES,
	RADIO_INLINE_STYLE_SHAPES,
	CHOICE_CLEAR_NAME_SHAPES,
	CHOICE_GROUP_NAME_SHAPES,
	RADIO_FOCUS_SHAPES,
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
	R2_SUBMIT_SCHEMA,
	R2_SUBMIT_CASES,
	R2_VALIDATION_SHAPES,
	R2_ERROR_DESCRIPTION_SHAPES,
	R2_MIXED_ERROR_SHAPES,
	R2_SECTION_ERROR_SHAPE,
	R2_RESET_SHAPES,
	R2_BOUNDARY_TRANSITIONS,
	R2_WIDGET_ERROR_SHAPES,
	R2_WIDGET_ERROR_POLICIES,
	R2_WIDGET_ERROR_TRANSITIONS,
	R2_ABANDONED_RENDER_SHAPES,
	R2_VALIDATOR_IDENTITY_SHAPES,
	R2_SHARED_FIELD_ID_SHAPES,
	R2_SELECTOR_OWNER_SHAPES,
	R2_NATIVE_SUBMIT_SHAPES,
	R2_SCALAR_DISCARD_SHAPES,
	R2_FILE_ERROR_VISIBILITY_SHAPES,
	TEMPLATE_COMPONENTS,
	OPTION_SOURCES,
	LIST_OPTIONS,
	L1_SCALAR_LIST_SHAPES,
	L1_PREFIX_SHAPES,
	L1_TUPLE_SHAPES,
	L1_ALIGNMENT_SHAPES,
	L1_HIDDEN_ITEM_HEADINGS,
	L1_FIELDSET_SHAPES,
	L1_EMPTY_ITEM_SCHEMAS,
	L1_ARRAY_TEMPLATE_SHAPES,
	L1_UNION_LIST_SHAPES,
	L1_ITEM_FIELD_COMPONENTS,
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
	R4_OPTION_SHAPES,
	R4_UI_SETTING_SHAPES,
	R4_CLASS_SETTING_SHAPES,
	R4_SUBMIT_UI_SHAPES,
	R4_HETEROGENEOUS_ORDER_SHAPES,
	R4_RAIL_VISIBILITY_SHAPES,
	R4_EMPTY_BRANCH_TEMPLATES,
	R4_OPTION_PAYLOAD_SHAPE,
	R4_OPTION_OVERRIDE_SHAPES,
	R4_OPTION_PAYLOAD_UNIONS,
	R4_TEMPLATE_PLACEMENTS,
	R4_SAME_RENDER_TEMPLATES,
	R4_BRANCH_LABEL_SHAPES,
	R4_REPORT_SCOPE_SHAPES,
	R4_COMPOSED_BRANCH_SHAPES,
	R4_ORDER_SHAPES,
	R4_BRANCH_PRESENTATIONS,
	R4_OPTION_ERROR_SHAPES,
	ADDITIONAL_LAYOUT_SHAPES,
	ARRAY_ID_SHAPES,
	ADDITIONAL_NAME_SHAPES
].forEach(deepFreeze);
