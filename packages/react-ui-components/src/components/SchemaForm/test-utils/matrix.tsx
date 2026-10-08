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
import { EComponentSize, EIconName, StyleMode } from '@kelvininc/ui-components';
import { EApplyDefaults, SchemaFormContext } from '../types';
import { useSchemaFormFocusRef } from '../hooks/entryFocus';
import DefaultFieldTemplate from '../Templates/FieldTemplate';
import FileWidget from '../Widgets/FileWidget';

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
	expected: 'radio' | 'select' | 'text' | 'updown' | 'email' | 'checkbox' | 'custom';
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
	{ name: 'default number delegates to text', schema: { type: 'number', title: 'Temperature' }, uiSchema: {}, expected: 'text' },
	{ name: 'default integer delegates to text', schema: { type: 'integer', title: 'Retries' }, uiSchema: {}, expected: 'text' },
	{ name: 'number explicitly selects updown', schema: { type: 'number', title: 'Temperature' }, uiSchema: { 'ui:widget': 'updown' }, expected: 'updown' },
	{ name: 'integer explicitly selects updown', schema: { type: 'integer', title: 'Retries' }, uiSchema: { 'ui:widget': 'updown' }, expected: 'updown' },
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

export const R5_ARRAY_ACTIONS = [
	{ name: 'add below limit', action: 'add', count: 4, canAdd: true, index: 3, target: { kind: 'add' } },
	{ name: 'add at limit', action: 'add', count: 4, canAdd: false, index: 3, target: { kind: 'item', index: 3, control: true } },
	{ name: 'remove middle', action: 'remove', count: 2, canAdd: true, index: 1, target: { kind: 'item', index: 1, control: false } },
	{ name: 'remove last', action: 'remove', count: 2, canAdd: true, index: 2, target: { kind: 'item', index: 1, control: false } },
	{ name: 'move up', action: 'move-up', count: 3, canAdd: true, index: 2, target: { kind: 'item', index: 1, control: false } },
	{ name: 'move down', action: 'move-down', count: 3, canAdd: true, index: 0, target: { kind: 'item', index: 1, control: false } },
	{ name: 'remove final with Add', action: 'remove', count: 0, canAdd: true, index: 0, target: { kind: 'add' } },
	{ name: 'remove final without Add', action: 'remove', count: 0, canAdd: false, index: 0, target: { kind: 'list' } }
] as const;

export const R5_FOCUS_ARRAY_SHAPES = ARRAY_SHAPES.map(row => {
	const fixed = Array.isArray(row.schema.items) ? row.schema.items.length : 0;
	const formData = [...row.formData];
	while (formData.length < fixed + 3) formData.push(row.formData[row.formData.length - 1]);
	return { ...row, formData, fixed };
});

export const R5_TUPLE_FOCUS_CASES = [
	{ name: 'last additional with Add', index: 1, count: 1, fixed: 1, canAdd: true, target: { kind: 'add' } },
	{ name: 'last additional without Add', index: 1, count: 1, fixed: 1, canAdd: false, target: { kind: 'list' } },
	{ name: 'next additional', index: 2, count: 3, fixed: 1, canAdd: true, target: { kind: 'item', index: 2, control: false } },
	{ name: 'previous additional', index: 3, count: 3, fixed: 2, canAdd: true, target: { kind: 'item', index: 2, control: false } }
] as const;
export const R5_FOCUS_CANCELLATIONS = ['user leaves', 'readonly', 'unmounted'] as const;

export const R5_PROPERTY_SHAPES = [
	{ name: 'untyped additional property', additionalProperties: true },
	{ name: 'string additional property', additionalProperties: { type: 'string' } },
	{ name: 'object additional property', additionalProperties: { type: 'object', properties: { host: { type: 'string' } } } }
] as const;
const R5WrappedField = (props: FieldTemplateProps) => (
	<aside data-r5-field-template>
		<DefaultFieldTemplate {...props} />
	</aside>
);
export const R5_PROPERTY_TEMPLATES = [
	{ name: 'default field template', templates: undefined },
	{ name: 'custom wrapping template', templates: { FieldTemplate: R5WrappedField } }
];
export const R5_ADD_LIMITS = [
	{ name: 'below limit', max: 3, intoEntry: false },
	{ name: 'at limit', max: 2, intoEntry: true }
] as const;

const RegisteredBrokerWidget = ({ disabled, readonly, value, onChange }: WidgetProps) => {
	const ref = useSchemaFormFocusRef<HTMLInputElement>(disabled || readonly);
	return <input ref={ref} aria-label="Broker host" disabled={disabled || readonly} value={value ?? ''} onChange={event => onChange(event.target.value)} />;
};
export const R5_ENTRY_WIDGETS: readonly { name: string; schema: RJSFSchema; uiSchema?: UiSchema; selector: string }[] = [
	{ name: 'text', schema: { type: 'string' }, selector: 'kv-text-field' },
	{ name: 'integer', schema: { type: 'integer' }, selector: 'kv-text-field' },
	{ name: 'password', schema: { type: 'string' }, uiSchema: { 'ui:widget': 'password' }, selector: 'kv-text-field' },
	{ name: 'textarea', schema: { type: 'string' }, uiSchema: { 'ui:widget': 'textarea' }, selector: 'kv-text-area' },
	{ name: 'select', schema: { type: 'string', enum: ['telemetry', 'alarms'] }, selector: 'kv-single-select-dropdown' },
	{ name: 'radio', schema: { type: 'string', enum: ['telemetry', 'alarms'] }, uiSchema: { 'ui:widget': 'radio' }, selector: 'kv-radio-list' },
	{ name: 'boolean', schema: { type: 'boolean' }, selector: 'kv-radio-list' },
	{ name: 'checkbox', schema: { type: 'boolean' }, uiSchema: { 'ui:widget': 'checkbox' }, selector: 'kv-checkbox' },
	{ name: 'multi-select', schema: { type: 'array', uniqueItems: true, items: { type: 'string', enum: ['telemetry', 'alarms'] } }, selector: 'kv-multi-select-dropdown' },
	{
		name: 'toggle group',
		schema: { type: 'array', uniqueItems: true, items: { type: 'string', enum: ['telemetry', 'alarms'] } },
		uiSchema: { 'ui:widget': 'toggleButtonGroup' },
		selector: 'kv-toggle-button-group'
	},
	{ name: 'file', schema: { type: 'object', properties: { certificate: { type: 'string', format: 'data-url' } } }, selector: 'kv-action-button-text' },
	{ name: 'registered custom widget', schema: { type: 'string' }, uiSchema: { 'ui:widget': RegisteredBrokerWidget }, selector: 'input' }
];

export const R5_FALLBACK_SHAPES = [
	{ name: 'empty schema with actions', schema: { type: 'array', title: 'Topics', items: {} }, uiSchema: {}, itemTarget: true },
	{ name: 'hidden widget with actions', schema: { type: 'array', title: 'Topics', items: { type: 'string' } }, uiSchema: { items: { 'ui:widget': 'hidden' } }, itemTarget: true },
	{
		name: 'empty object without actions',
		schema: { type: 'array', title: 'Brokers', items: { type: 'object', title: 'Broker', properties: {} } },
		uiSchema: { 'ui:options': { orderable: false, removable: false } },
		itemTarget: false
	}
] as const;

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
		labels: ['Download ca.pem', 'Remove ca.pem', 'Replace file: Certificate'],
		action: { label: 'Remove ca.pem', nextData: undefined },
		download: 'Download ca.pem'
	},
	{
		name: 'multiple files',
		schema: { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' } },
		uiSchema: { 'ui:options': { filePreview: true } },
		formData: [CERTIFICATE, CLIENT_CERTIFICATE],
		labels: ['Download ca.pem', 'Remove ca.pem', 'Download client.pem', 'Remove client.pem', 'Add files: Certificates'],
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

const R7_TEXTAREA_SCHEMA: RJSFSchema = { type: 'string', title: 'Connection notes' };
export const R7_TEXTAREA_EMPTY_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema<Record<string, unknown>, RJSFSchema, SchemaFormContext>;
	expected: unknown;
	displayText: string;
}[] = [
	{
		name: 'omitted empty value',
		schema: { type: 'object', properties: { notes: R7_TEXTAREA_SCHEMA } },
		uiSchema: { notes: { 'ui:widget': 'textarea' } },
		expected: undefined,
		displayText: ''
	},
	...[...VALUE_CASES, { name: 'string sentinel', value: 'No connection notes' }].flatMap(({ name, value }) =>
		[false, true].map(inOptions => ({
			name: `${name} in ${inOptions ? 'ui:options' : 'ui:emptyValue'}`,
			schema: { type: 'object' as const, properties: { notes: R7_TEXTAREA_SCHEMA } },
			uiSchema: { notes: { 'ui:widget': 'textarea', ...(inOptions ? { 'ui:options': { emptyValue: value as UIOptionsType['emptyValue'] } } : { 'ui:emptyValue': value }) } },
			expected: value,
			displayText: value ? String(value) : ''
		}))
	)
];
export const R7_TEXTAREA_LIMIT_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	limit?: number;
	expectedText: string;
}[] = [
	{ name: 'unlimited', schema: R7_TEXTAREA_SCHEMA, uiSchema: { 'ui:widget': 'textarea' }, expectedText: 'é🚀ABC' },
	{ name: 'schema limit', schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 3 }, uiSchema: { 'ui:widget': 'textarea' }, limit: 3, expectedText: 'é🚀A' },
	{ name: 'UI-only limit', schema: R7_TEXTAREA_SCHEMA, uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': 3 }, limit: 3, expectedText: 'é🚀A' },
	{
		name: 'UI below schema',
		schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 3 },
		uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': 2 },
		limit: 2,
		expectedText: 'é🚀'
	},
	{
		name: 'UI above schema',
		schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 2 },
		uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': 4 },
		limit: 4,
		expectedText: 'é🚀AB'
	},
	{
		name: 'UI zero stays unlimited',
		schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 2 },
		uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': 0 },
		limit: 0,
		expectedText: 'é🚀ABC'
	},
	{ name: 'schema zero', schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 0 }, uiSchema: { 'ui:widget': 'textarea' }, limit: 0, expectedText: 'é🚀ABC' },
	{
		name: 'undefined UI limit uses schema',
		schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 3 },
		uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': undefined },
		limit: 3,
		expectedText: 'é🚀A'
	}
];
export const R7_TEXTAREA_REPLACEMENT_SHAPES = [
	{ name: 'whole field at the limit', initial: 'CAB', selection: 'all', replacement: 'TLS', limit: 3, typed: 'TLS', pasted: 'TLS' },
	{ name: 'last character at the limit', initial: 'CAB', selection: 'last', replacement: 'X', limit: 3, typed: 'CAX', pasted: 'CAX' },
	{ name: 'selected Unicode code point', initial: 'Aé🚀', selection: 'last', replacement: 'Z', limit: 3, typed: 'AéZ', pasted: 'AéZ' },
	{ name: 'partial replacement overflow', initial: 'CAB', selection: 'last', replacement: 'XY', limit: 3, typed: 'CAX', pasted: 'CAB' },
	{ name: 'whole replacement overflow', initial: 'CAB', selection: 'all', replacement: 'TLSX', limit: 3, typed: 'TLS', pasted: 'CAB' },
	{ name: 'Unicode replacement at the limit', initial: 'CAB', selection: 'all', replacement: 'é🚀A', limit: 3, typed: 'é🚀A', pasted: 'é🚀A' },
	{ name: 'selected multiline text', initial: 'CA\nB', selection: 'all', replacement: 'TLS', limit: 4, typed: 'TLS', pasted: 'TLS' }
].map(row => ({ ...row, schema: { ...R7_TEXTAREA_SCHEMA, maxLength: row.limit }, uiSchema: { 'ui:widget': 'textarea' } }));
export const R7_TEXTAREA_NATIVE_INPUT_SHAPES = [
	{ name: 'Unicode insertion overflow', initial: 'AB', selection: 'end', inserted: '🚀X', limit: 3, expected: 'AB' },
	{ name: 'Unicode insertion at the limit', initial: 'AB', selection: 'end', inserted: '🚀', limit: 3, expected: 'AB🚀' },
	{ name: 'Unicode whole-field replacement', initial: 'CAB', selection: 'all', inserted: 'é🚀A', limit: 3, expected: 'é🚀A' },
	{ name: 'partial native replacement overflow', initial: 'CAB', selection: 'last', inserted: '🚀X', limit: 3, expected: 'CAB' },
	{ name: 'whole native replacement overflow', initial: 'CAB', selection: 'all', inserted: 'é🚀AB', limit: 3, expected: 'CAB' },
	{ name: 'unlimited native insertion', initial: 'AB', selection: 'end', inserted: '🚀X', limit: undefined, expected: 'AB🚀X' },
	{ name: 'zero native limit', initial: 'AB', selection: 'end', inserted: '🚀X', limit: 0, expected: 'AB🚀X' }
].map(row => ({ ...row, schema: { ...R7_TEXTAREA_SCHEMA, maxLength: row.limit }, uiSchema: { 'ui:widget': 'textarea' } }));
export const R7_TEXTAREA_COMPOSITION_SHAPES = [
	{ name: 'draft exceeds cap before a valid commit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日', limit: 3, expected: 'AB日' },
	{ name: 'overflowing IME commit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日本', limit: 3, expected: 'AB' },
	{ name: 'IME replaces the whole field', initial: 'CAB', selection: 'all', draft: 'にほんご', committed: '日本語', limit: 3, expected: '日本語' },
	{ name: 'canceled IME draft', initial: 'AB', selection: 'end', draft: 'にほん', committed: '', limit: 3, expected: 'AB' },
	{ name: 'unlimited IME commit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日本', limit: undefined, expected: 'AB日本' },
	{ name: 'zero IME limit', initial: 'AB', selection: 'end', draft: 'にほん', committed: '日本', limit: 0, expected: 'AB日本' }
].map(row => ({ ...row, schema: { ...R7_TEXTAREA_SCHEMA, maxLength: row.limit }, uiSchema: { 'ui:widget': 'textarea' } }));
export const R7_TEXTAREA_PASTE_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	initial: string;
	pasted: string;
	allowed: boolean;
	selection?: string;
	expectedText?: string;
}[] = [
	{ name: 'unlimited plain text', schema: R7_TEXTAREA_SCHEMA, uiSchema: { 'ui:widget': 'textarea' }, initial: 'Ops: ', pasted: 'Use TLS\nKeepalive enabled', allowed: true },
	{ name: 'blank line stays text', schema: R7_TEXTAREA_SCHEMA, uiSchema: { 'ui:widget': 'textarea' }, initial: '', pasted: '\n', allowed: true },
	{ name: 'spaces stay text', schema: R7_TEXTAREA_SCHEMA, uiSchema: { 'ui:widget': 'textarea' }, initial: '', pasted: '  ', allowed: true },
	{ name: 'schema rejects overflow', schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 4 }, uiSchema: { 'ui:widget': 'textarea' }, initial: 'CA', pasted: 'cert', allowed: false },
	{ name: 'Unicode at schema boundary', schema: { ...R7_TEXTAREA_SCHEMA, maxLength: 4 }, uiSchema: { 'ui:widget': 'textarea' }, initial: 'CA', pasted: '🚀é', allowed: true },
	{ name: 'UI override rejects overflow', schema: R7_TEXTAREA_SCHEMA, uiSchema: { 'ui:widget': 'textarea', 'maxCharLength': 4 }, initial: 'CA', pasted: 'cert', allowed: false },
	...R7_TEXTAREA_REPLACEMENT_SHAPES.map(row => ({
		name: row.name,
		schema: row.schema,
		uiSchema: row.uiSchema,
		initial: row.initial,
		pasted: row.replacement,
		selection: row.selection,
		allowed: row.pasted !== row.initial,
		expectedText: row.pasted
	}))
];
export const R7_TEXTAREA_RESET_SHAPES: readonly {
	name: string;
	action: 'external' | 'discard' | 'defaults';
	schema: RJSFSchema;
	uiSchema: UiSchema<Record<string, unknown>, RJSFSchema, SchemaFormContext>;
	emptyData: Record<string, unknown>;
}[] = [
	...[
		{ name: 'external undefined', action: 'external' as const, value: undefined },
		{ name: 'external null', action: 'external' as const, value: null },
		{ name: 'discard to undefined', action: 'discard' as const, value: undefined },
		{ name: 'reset to empty default', action: 'defaults' as const, value: '' }
	].map(row => ({
		name: row.name,
		action: row.action,
		schema: { type: 'object' as const, properties: { notes: { ...R7_TEXTAREA_SCHEMA, ...(row.action === 'defaults' ? { default: '' } : {}) } } },
		uiSchema: { notes: { 'ui:widget': 'textarea' } },
		emptyData: { notes: row.value }
	}))
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

export const FIELD_FEEDBACK_SHAPES = [
	...R2_ERROR_DESCRIPTION_SHAPES.filter(row => row.fields.length === 1),
	{
		name: 'textarea with icon',
		schema: { type: 'string', title: 'Operating instructions' } as RJSFSchema,
		uiSchema: { 'ui:widget': 'textarea', 'iconName': EIconName.Notes },
		formData: 'Inspect the cooling loop before restarting.'
	},
	{ name: 'date', schema: { type: 'string', title: 'Inspection date', format: 'date' } as RJSFSchema, uiSchema: {}, formData: '2026-10-08' },
	{ name: 'file', schema: { type: 'string', title: 'CA certificate', format: 'data-url' } as RJSFSchema, uiSchema: {}, formData: 'data:text/plain;name=ca.pem;base64,Y2E=' }
].map(({ name, schema, uiSchema, formData }) => ({
	name,
	schema: { ...schema, description: 'Configure this connection setting.', default: formData as RJSFSchema['default'] },
	uiSchema: { ...uiSchema, 'ui:showDefaultValueHelper': true },
	formData
}));

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
	{ name: 'item actions', row: ARRAY_SHAPES[2], uiSchema: { 'ui:options': { layout: 'sections' }, 'items': { 'ui:fieldset': true } }, headers: 3, overlays: 3, menus: 3 },
	{
		name: 'no item actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { layout: 'sections', orderable: false, removable: false }, 'items': { 'ui:fieldset': true } },
		headers: 3,
		overlays: 3,
		menus: 0
	},
	{
		name: 'blank title without actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { layout: 'sections', orderable: false, removable: false }, 'items': { 'ui:fieldset': true, 'ui:title': '' } },
		headers: 0,
		overlays: 0,
		menus: 0
	},
	{
		name: 'hidden label without actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { layout: 'sections', orderable: false, removable: false }, 'items': { 'ui:fieldset': true, 'ui:label': false } },
		headers: 0,
		overlays: 0,
		menus: 0
	},
	{
		name: 'custom wrapping template without actions',
		row: ARRAY_SHAPES[2],
		uiSchema: { 'ui:options': { layout: 'sections', orderable: false, removable: false }, 'items': { 'ui:fieldset': true } },
		templates: { WrapIfAdditionalTemplate: WrappedItem },
		headers: 3,
		overlays: 3,
		menus: 0
	},
	{
		name: 'nested plain items',
		row: nestedBrokers,
		uiSchema: { items: { 'ui:fieldset': true, 'brokers': { 'ui:options': { layout: 'sections' } } } },
		headers: 9,
		overlays: 3,
		menus: 9
	},
	{
		name: 'nested fieldset items',
		row: nestedBrokers,
		uiSchema: { items: { 'ui:fieldset': true, 'brokers': { 'ui:options': { layout: 'sections' }, 'items': { 'ui:fieldset': true } } } },
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

export const L1_HIDDEN_ITEM_WIDGETS: {
	name: string;
	row: { schema: RJSFSchema; formData: unknown[] };
	uiSchema: UiSchema;
	itemNames: string[];
	hiddenPositions: number[];
	section: boolean;
}[] = [
	{
		name: 'hidden strings',
		row: ARRAY_SHAPES[0],
		uiSchema: { items: { 'ui:widget': 'hidden' } },
		itemNames: ['Topic 1', 'Topic 2', 'Topic 3'],
		hiddenPositions: [0, 1, 2],
		section: false
	},
	{
		name: 'hidden widget in options',
		row: ARRAY_SHAPES[0],
		uiSchema: { items: { 'ui:options': { widget: 'hidden' } } },
		itemNames: ['Topic 1', 'Topic 2', 'Topic 3'],
		hiddenPositions: [0, 1, 2],
		section: false
	},
	{
		name: 'hidden additional tuple positions',
		row: { schema: ENDPOINTS, formData: ['primary.local', 'backup-1.local', 'backup-2.local'] },
		uiSchema: { additionalItems: { 'ui:widget': 'hidden' } },
		itemNames: ['Primary', 'Backup 2', 'Backup 3'],
		hiddenPositions: [1, 2],
		section: false
	},
	{
		name: 'hidden fixed and additional tuple positions',
		row: { schema: ENDPOINTS, formData: ['primary.local', 'backup-1.local', 'backup-2.local'] },
		uiSchema: { items: [{ 'ui:widget': 'hidden' }], additionalItems: { 'ui:widget': 'hidden' } },
		itemNames: ['Primary', 'Backup 2', 'Backup 3'],
		hiddenPositions: [0, 1, 2],
		section: false
	},
	{
		name: 'hidden objects with nested lists',
		row: ARRAY_SHAPES[7],
		uiSchema: { items: { 'ui:widget': 'hidden' } },
		itemNames: ['Group 1', 'Group 2', 'Group 3'],
		hiddenPositions: [0, 1, 2],
		section: true
	}
];

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

export const L2_ELIGIBILITY_SHAPES = [
	{
		name: 'property names with spaces',
		schema: variables({ type: 'object', properties: { 'broker host': { type: 'string', title: 'Broker host' } } }),
		formData: [{ 'broker host': 'broker-1.local' }],
		isFlat: true
	},
	{
		name: 'property choice with fields',
		schema: variables({
			type: 'object',
			properties: {
				value: {
					type: 'string',
					oneOf: [
						{ title: 'Text', minLength: 1 },
						{ title: 'Empty', maxLength: 0 }
					]
				}
			}
		}),
		formData: [{ value: 'telemetry' }],
		isFlat: false
	},
	{
		name: 'property constant choices',
		schema: variables({
			type: 'object',
			properties: {
				level: {
					type: 'string',
					title: 'Level',
					oneOf: [
						{ const: 'info', title: 'Info' },
						{ const: 'debug', title: 'Debug' }
					]
				}
			}
		}),
		formData: [{ level: 'info' }],
		isFlat: true
	},
	{
		name: 'conditional property reference',
		schema: {
			...variables({ type: 'object', properties: { value: { $ref: '#/definitions/value' } } }),
			definitions: { value: { type: 'string', if: { const: 'debug' }, then: { minLength: 5 } } }
		},
		formData: [{ value: 'debug' }],
		isFlat: false
	},
	...['text', 'TextWidget', 'updown', 'UpDownWidget', 'select', 'SelectWidget'].map(widget => ({
		name: `explicit ${widget}`,
		schema: variables({ type: 'object', properties: { port: { type: 'integer', title: 'Port', enum: widget.toLowerCase().includes('select') ? [1883, 8883] : undefined } } }),
		uiSchema: { items: { port: { 'ui:widget': widget } } } as UiSchema,
		formData: [{ port: 1883 }, { port: 8883 }],
		isFlat: true
	})),
	...['email', 'uri'].flatMap(format =>
		[false, true].map(explicit => ({
			name: `${explicit ? 'explicit widget' : 'implicit format'} ${format}`,
			schema: variables({ type: 'object', properties: { address: { type: 'string', title: 'Address', format } } }),
			uiSchema: { items: { address: explicit ? { 'ui:widget': format } : {} } } as UiSchema,
			formData: [{ address: format === 'email' ? 'operations@kelvininc.com' : 'https://kelvininc.com' }],
			isFlat: !explicit
		}))
	),
	...['data-url', 'date', 'date-time', 'time', 'color'].map(format => ({
		name: `special format ${format}`,
		schema: variables({ type: 'object', properties: { value: { type: 'string', format } } }),
		formData: [{}],
		isFlat: false
	})),
	{
		name: 'no visible columns',
		schema: variables({ type: 'object', properties: { id: NAME } }),
		uiSchema: { items: { id: { 'ui:widget': 'hidden' } } },
		formData: [{ id: 'variable-1' }],
		isFlat: false
	},
	{
		name: 'hidden fifth column',
		schema: variables({ type: 'object', properties: { name: NAME, value: VALUE, unit: NAME, scale: VALUE, id: NAME } }),
		uiSchema: { items: { id: { 'ui:widget': 'hidden' } } },
		formData: [{ name: 'TIMEOUT', value: '30', unit: 's', scale: '1', id: 'timeout' }],
		isFlat: true
	},
	{
		name: 'item reference',
		schema: { ...variables({ $ref: '#/definitions/variable' }), definitions: { variable: { type: 'object', properties: { name: NAME, value: VALUE } } } },
		formData: [{ name: 'TIMEOUT', value: '30' }],
		isFlat: true
	},
	{
		name: 'property reference',
		schema: { ...variables({ type: 'object', properties: { name: { $ref: '#/definitions/name' } } }), definitions: { name: NAME } },
		formData: [{ name: 'TIMEOUT' }],
		isFlat: true
	},
	{
		name: 'allOf properties',
		schema: variables({ allOf: [{ type: 'object', properties: { name: NAME } }, { properties: { value: VALUE } }] }),
		formData: [{ name: 'TIMEOUT', value: '30' }],
		isFlat: true
	},
	{
		name: 'conditional reference',
		schema: {
			...variables({ $ref: '#/definitions/variable' }),
			definitions: { variable: { type: 'object', properties: { name: NAME }, if: { properties: { name: { const: 'TIMEOUT' } } }, then: { properties: { value: VALUE } } } }
		},
		formData: [{ name: 'TIMEOUT', value: '30' }],
		isFlat: false
	},
	{
		name: 'conditional allOf',
		schema: variables({ type: 'object', allOf: [{ properties: { name: NAME }, if: { properties: { name: { const: 'TIMEOUT' } } }, then: { properties: { value: VALUE } } }] }),
		formData: [{ name: 'TIMEOUT', value: '30' }],
		isFlat: false
	},
	{
		name: 'dependencies',
		schema: variables({ type: 'object', properties: { name: NAME }, dependencies: { name: { properties: { value: VALUE } } } }),
		formData: [{ name: 'TIMEOUT', value: '30' }],
		isFlat: false
	},
	{
		name: 'additional properties',
		schema: variables({ type: 'object', properties: { name: NAME }, additionalProperties: { type: 'string' } }),
		formData: [{ name: 'TIMEOUT', value: '30' }],
		isFlat: false
	},
	{
		name: 'custom property field',
		schema: FLAT_OBJECT_SHAPES[0].schema,
		uiSchema: { items: { value: { 'ui:field': CustomConnection } } },
		formData: FLAT_OBJECT_SHAPES[0].formData,
		isFlat: false
	},
	{
		name: 'custom item field',
		schema: FLAT_OBJECT_SHAPES[0].schema,
		uiSchema: { items: { 'ui:field': CustomConnection } },
		formData: FLAT_OBJECT_SHAPES[0].formData,
		isFlat: false
	},
	{
		name: 'custom property layout',
		schema: FLAT_OBJECT_SHAPES[0].schema,
		uiSchema: { items: { value: { 'ui:FieldTemplate': FieldLayout } } },
		formData: FLAT_OBJECT_SHAPES[0].formData,
		isFlat: false
	},
	{
		name: 'custom item layout',
		schema: FLAT_OBJECT_SHAPES[0].schema,
		uiSchema: { items: { 'ui:FieldTemplate': FieldLayout } },
		formData: FLAT_OBJECT_SHAPES[0].formData,
		isFlat: false
	},
	...['radio', 'textarea', 'file', 'color'].map(widget => ({
		name: `global ${widget} leaves text widget dispatch local`,
		schema: FLAT_OBJECT_SHAPES[0].schema,
		uiSchema: { 'ui:globalOptions': { widget } as UIOptionsType },
		formData: FLAT_OBJECT_SHAPES[0].formData,
		isFlat: true
	})),
	{
		name: 'global radio leaves enum widget dispatch local',
		schema: FLAT_OBJECT_SHAPES[1].schema,
		uiSchema: { 'ui:globalOptions': { widget: 'radio' } as UIOptionsType },
		formData: FLAT_OBJECT_SHAPES[1].formData,
		isFlat: true
	},
	{
		name: 'local radio overrides global text',
		schema: FLAT_OBJECT_SHAPES[1].schema,
		uiSchema: { 'ui:globalOptions': { widget: 'text' } as UIOptionsType, 'items': { level: { 'ui:widget': 'radio' } } },
		formData: FLAT_OBJECT_SHAPES[1].formData,
		isFlat: false
	},
	...['data-url', 'date'].map(format => ({
		name: `global text preserves the ${format} control`,
		schema: variables({ type: 'object', properties: { value: { type: 'string', format } } }),
		uiSchema: { 'ui:globalOptions': { widget: 'text' } as UIOptionsType },
		formData: [{}],
		isFlat: false
	})),
	{
		name: 'global hidden keeps fields hidden',
		schema: FLAT_OBJECT_SHAPES[0].schema,
		uiSchema: { 'ui:globalOptions': { widget: 'hidden' } as UIOptionsType },
		formData: FLAT_OBJECT_SHAPES[0].formData,
		isFlat: false
	}
] satisfies readonly { name: string; schema: RJSFSchema; uiSchema?: UiSchema; formData: object[]; isFlat: boolean }[];

export const L2_PRESENTATION_SHAPES = ['description', 'help', 'default helper', 'required'].map(presentation => ({
	name: presentation,
	schema: variables({
		type: 'object',
		title: 'Variable',
		required: presentation === 'required' ? ['name'] : [],
		properties: {
			name: {
				...NAME,
				description: presentation === 'description' ? 'Starts with a letter or underscore.' : undefined,
				default: presentation === 'default helper' ? 'LOG_LEVEL' : undefined
			},
			value: VALUE
		}
	}),
	uiSchema: {
		items: {
			'ui:order': ['value', 'name'],
			'name': presentation === 'help' ? { 'ui:help': 'Starts with a letter or underscore.' } : presentation === 'default helper' ? { 'ui:showDefaultValueHelper': true } : {}
		}
	} as UiSchema,
	formData: FLAT_OBJECT_SHAPES[0].formData
}));

export const L2_SIZE_SHAPES = [
	{ name: 'default large controls', formContext: {}, uiSchema: {}, actionSize: EComponentSize.Large },
	{ name: 'global compact controls', formContext: { componentSize: EComponentSize.Small }, uiSchema: {}, actionSize: EComponentSize.Small },
	{ name: 'local compact first control', formContext: {}, uiSchema: { items: { name: { componentSize: EComponentSize.Small } } }, actionSize: EComponentSize.Small },
	{
		name: 'local large overrides compact context',
		formContext: { componentSize: EComponentSize.Small },
		uiSchema: { items: { name: { componentSize: EComponentSize.Large } } },
		actionSize: EComponentSize.Large
	},
	{ name: 'compact second control', formContext: {}, uiSchema: { items: { value: { componentSize: EComponentSize.Small } } }, actionSize: EComponentSize.Large },
	{
		name: 'reordered compact select first',
		formContext: {},
		uiSchema: { items: { 'ui:order': ['level', 'name'], 'level': { componentSize: EComponentSize.Small } } },
		actionSize: EComponentSize.Small,
		select: true
	}
].map(({ select = false, ...row }) => ({
	...row,
	uiSchema: row.uiSchema as UiSchema,
	formContext: row.formContext as SchemaFormContext,
	schema: FLAT_OBJECT_SHAPES[select ? 1 : 0].schema,
	formData: FLAT_OBJECT_SHAPES[select ? 1 : 0].formData
}));

export const L2_LABEL_SHAPES = [
	{ name: 'local label suppressed', uiSchema: { items: { name: { 'ui:label': false } } }, isFlat: false },
	{ name: 'local options label suppressed', uiSchema: { items: { name: { 'ui:options': { label: false } } } }, isFlat: false },
	{ name: 'empty UI title', uiSchema: { items: { name: { 'ui:title': '' } } }, isFlat: false },
	{ name: 'whitespace UI title', uiSchema: { items: { name: { 'ui:title': '  ' } } }, isFlat: false },
	{ name: 'global label suppressed', uiSchema: { 'ui:globalOptions': { label: false } as UIOptionsType }, isFlat: false },
	{ name: 'global empty UI title', uiSchema: { 'ui:globalOptions': { title: '' } as UIOptionsType }, isFlat: false },
	{
		name: 'local labels override global suppression',
		uiSchema: { 'ui:globalOptions': { label: false } as UIOptionsType, 'items': { name: { 'ui:label': true }, value: { 'ui:label': true } } },
		isFlat: true
	},
	{
		name: 'local titles override global suppression',
		uiSchema: { 'ui:globalOptions': { title: '' } as UIOptionsType, 'items': { name: { 'ui:title': 'Name' }, value: { 'ui:title': 'Value' } } },
		isFlat: true
	},
	{ name: 'hidden property label suppressed', uiSchema: { items: { id: { 'ui:widget': 'hidden', 'ui:label': false } } }, isFlat: true, hidden: true }
].map(({ hidden = false, ...row }) => ({
	...row,
	uiSchema: row.uiSchema as UiSchema,
	schema: FLAT_OBJECT_SHAPES[hidden ? 3 : 0].schema,
	formData: FLAT_OBJECT_SHAPES[hidden ? 3 : 0].formData
}));

export const L2_ITEM_GUIDANCE_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: object[];
	uiSchema: UiSchema;
	formContext?: SchemaFormContext;
	isFlat: boolean;
	message?: string;
	helper?: boolean;
}[] = [
	{
		name: 'schema description',
		item: { description: 'Passed to the connector when it starts.' },
		uiSchema: {},
		isFlat: false,
		message: 'Passed to the connector when it starts.'
	},
	{
		name: 'UI description',
		item: {},
		uiSchema: { items: { 'ui:description': 'Configure each connector variable.' } },
		isFlat: false,
		message: 'Configure each connector variable.'
	},
	{
		name: 'item help',
		item: {},
		uiSchema: { items: { 'ui:help': 'Use the connector environment variable name.' } },
		isFlat: false,
		message: 'Use the connector environment variable name.'
	},
	{
		name: 'hidden description',
		item: { description: 'Passed to the connector when it starts.' },
		uiSchema: { items: { 'ui:descriptionPosition': 'none' } },
		isFlat: true
	},
	{
		name: 'item default helper',
		item: { default: { name: 'LOG_LEVEL', value: 'info' } },
		uiSchema: { items: { 'ui:showDefaultValueHelper': true } },
		isFlat: false,
		helper: true
	},
	{
		name: 'context default helper',
		item: { default: { name: 'LOG_LEVEL', value: 'info' } },
		uiSchema: {},
		formContext: { showDefaultValueHelper: true },
		isFlat: false,
		helper: true
	},
	{
		name: 'disabled default helper',
		item: { default: { name: 'LOG_LEVEL', value: 'info' } },
		uiSchema: { items: { 'ui:showDefaultValueHelper': false } },
		formContext: { showDefaultValueHelper: true },
		isFlat: true
	},
	{ name: 'default without helper', item: { default: { name: 'LOG_LEVEL', value: 'info' } }, uiSchema: {}, isFlat: true }
].map(({ item, ...row }) => ({
	...row,
	schema: variables({ type: 'object', title: 'Variable', properties: { name: NAME, value: VALUE }, ...item }),
	formData: FLAT_OBJECT_SHAPES[0].formData
}));

const hiddenTableDescriptionOptions: UIOptionsType = { descriptionPosition: 'none' };
export const L2_DESCRIPTION_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	formData: object[];
	uiSchema: UiSchema;
	expectedTip?: string;
}[] = [
	{ name: 'hidden schema description', uiSchema: { items: { name: { 'ui:descriptionPosition': 'none' } } }, expectedTip: undefined },
	{
		name: 'hidden UI description',
		uiSchema: { items: { name: { 'ui:options': { descriptionPosition: 'none', description: 'Private connector configuration.' } } } },
		expectedTip: undefined
	},
	{
		name: 'hidden description with explicit help',
		uiSchema: { items: { name: { 'ui:descriptionPosition': 'none', 'ui:help': 'Enter an environment variable.' } } },
		expectedTip: 'Enter an environment variable.'
	},
	{ name: 'globally hidden description', uiSchema: { 'ui:globalOptions': hiddenTableDescriptionOptions }, expectedTip: undefined },
	{
		name: 'globally hidden description with explicit help',
		uiSchema: { 'ui:globalOptions': hiddenTableDescriptionOptions, 'items': { name: { 'ui:help': 'Enter an environment variable.' } } },
		expectedTip: 'Enter an environment variable.'
	},
	{
		name: 'visible field override',
		uiSchema: { 'ui:globalOptions': hiddenTableDescriptionOptions, 'items': { name: { 'ui:descriptionPosition': 'top' } } },
		expectedTip: 'Starts with a letter or underscore.'
	}
].map(row => ({
	...row,
	schema: variables({ type: 'object', properties: { name: { ...NAME, description: 'Starts with a letter or underscore.' }, value: VALUE } }),
	formData: FLAT_OBJECT_SHAPES[0].formData
}));

export const L2_REGISTRY_OVERRIDES = [
	{ name: 'named text widget', widgets: { TextWidget: SecretInput } },
	{ name: 'text alias', widgets: { text: SecretInput } },
	{ name: 'string field', fields: { StringField: CustomConnection } },
	{ name: 'object field', fields: { ObjectField: CustomConnection } },
	{ name: 'array item field', fields: { ArraySchemaField: CustomConnection } },
	{ name: 'field layout', templates: { FieldTemplate: FieldLayout } },
	{ name: 'object layout', templates: { ObjectFieldTemplate: CustomConnection } },
	{ name: 'item layout', templates: { ArrayFieldItemTemplate: CustomConnection } },
	{ name: 'base input', templates: { BaseInputTemplate: CustomConnection } },
	{ name: 'title layout', templates: { TitleFieldTemplate: CustomConnection } },
	{ name: 'additional wrapper', templates: { WrapIfAdditionalTemplate: CustomConnection } }
];

export const L2_ROW_ERROR_SHAPES = [
	{ name: 'item error', extraErrors: { 1: { __errors: ['Variable is unavailable.'] } }, message: 'Variable is unavailable.' },
	{ name: 'item and cell errors', extraErrors: { 1: { __errors: ['Variable is unavailable.'], name: { __errors: ['Name is reserved.'] } } }, message: 'Variable is unavailable.' }
];

export const L2_NUMERIC_DISPATCH_SHAPES = (['number', 'integer'] as const).flatMap(type =>
	[
		{ name: 'default ignores custom UpDownWidget', widgets: { UpDownWidget: SecretInput }, uiSchema: {}, isFlat: true, custom: false },
		{ name: 'default uses custom TextWidget', widgets: { TextWidget: SecretInput }, uiSchema: {}, isFlat: false, custom: true },
		{
			name: 'explicit updown uses custom UpDownWidget',
			widgets: { UpDownWidget: SecretInput },
			uiSchema: { items: { retries: { 'ui:widget': 'updown' } } },
			isFlat: false,
			custom: true
		},
		{
			name: 'explicit updown ignores custom TextWidget',
			widgets: { TextWidget: SecretInput },
			uiSchema: { items: { retries: { 'ui:widget': 'updown' } } },
			isFlat: true,
			custom: false
		}
	].map(row => ({
		...row,
		name: `${type}: ${row.name}`,
		uiSchema: row.uiSchema as UiSchema,
		schema: variables({ type: 'object', properties: { retries: { type, title: 'Retries' } } }) as RJSFSchema,
		formData: [{ retries: 3 }]
	}))
);
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

export const R6_FILE_VALUES = Object.freeze([
	{ name: 'empty', values: [] as string[], labels: [] as string[] },
	{ name: 'one file', values: [CERTIFICATE], labels: ['ca.pem'] },
	{ name: 'duplicate names', values: [CERTIFICATE, 'data:text/plain;name=ca.pem;base64,YmFja3Vw'], labels: ['ca.pem', 'ca.pem'] },
	{ name: 'nameless legacy file', values: ['data:text/plain;base64,Y2E='], labels: ['unknown'] },
	{ name: 'stored path', values: ['certificates/plant-ca.pem'], labels: ['certificates/plant-ca.pem'] },
	{ name: 'secret reference', values: ['<% secrets.ca %>'], labels: ['<% secrets.ca %>'] },
	{ name: 'malformed data URL', values: ['data:text/plain;name=ca.pem;base64,%%%'], labels: ['data:text/plain;name=ca.pem;base64,%%%'] },
	{ name: 'encoded filename', values: ['data:text/plain;name=plant%20CA%20%23%201.pem;base64,Y2E='], labels: ['plant CA # 1.pem'] }
]);
export const R6_FILE_STATES = Object.freeze([
	{ name: 'editable', readonly: false, disabled: false },
	{ name: 'readonly', readonly: true, disabled: false },
	{ name: 'disabled', readonly: false, disabled: true },
	{ name: 'readonly and disabled', readonly: true, disabled: true }
]);
export const R6_FILE_REFERENCE_SHAPES = [
	{ name: 'CA reference', value: '<% secrets.ca %>', valid: true },
	{ name: 'compact reference', value: '<%secrets.ca%>', valid: true },
	{ name: 'nested reference', value: '<% secrets.plant.ca %>', valid: true },
	{ name: 'key punctuation', value: '<% secrets.plant_1.ca-certificate %>', valid: true },
	{ name: 'delimiter whitespace', value: '<%\tsecrets.ca\n%>', valid: true },
	{ name: 'other namespace', value: '<% environment.ca %>', valid: false },
	{ name: 'missing key', value: '<% secrets. %>', valid: false },
	{ name: 'empty key segment', value: '<% secrets.plant..ca %>', valid: false },
	{ name: 'space in key', value: '<% secrets.plant ca %>', valid: false },
	{ name: 'trailing key separator', value: '<% secrets.ca. %>', valid: false },
	{ name: 'expression', value: '<% secrets.ca + secrets.client %>', valid: false },
	{ name: 'prefixed reference', value: 'certificate: <% secrets.ca %>', valid: false },
	{ name: 'suffixed reference', value: '<% secrets.ca %>.pem', valid: false },
	{ name: 'newline outside delimiters', value: '<% secrets.ca %>\n', valid: false },
	{ name: 'unfinished reference', value: '<% secrets.ca', valid: false }
];
export const R6_FILE_REFERENCE_FORMS = [false, true].flatMap(multiple =>
	[false, true].map(readonly => ({
		name: `${multiple ? 'multiple' : 'single'} ${readonly ? 'readonly' : 'editable'} references`,
		multiple,
		readonly,
		formData: multiple ? ['<% secrets.ca %>', CERTIFICATE] : '<% secrets.ca %>',
		schema: (multiple
			? { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' } }
			: { type: 'string', title: 'Certificate', format: 'data-url' }) as RJSFSchema,
		uiSchema: { 'ui:options': { filePreview: true } }
	}))
);
export const R6_FILE_SHAPES = [false, true].flatMap(multiple =>
	R6_FILE_VALUES.flatMap(row =>
		R6_FILE_STATES.map(state => {
			const actionLabel = multiple ? 'Add files' : row.values.length ? 'Replace file' : 'Choose file';
			return {
				...row,
				...state,
				name: `${multiple ? 'multiple' : 'single'} ${row.name}, ${state.name}`,
				multiple,
				// Legacy single fields can contain an array. Keep both rows visible until an edit normalizes it.
				formData: multiple || row.values.length > 1 ? row.values : row.values[0],
				schema: (multiple
					? { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' } }
					: { type: 'string', title: 'Certificate', format: 'data-url' }) as RJSFSchema,
				uiSchema: { 'ui:options': { filePreview: true } },
				actionLabel,
				actionName: `${actionLabel}: ${multiple ? 'Certificates' : 'Certificate'}`
			};
		})
	)
);

export const R6_FILE_ACTION_LABEL_SHAPES = [
	{ name: 'custom empty single', uiSchema: { 'ui:options': { fileActionLabel: 'Upload certificate' } }, actionLabel: 'Upload certificate' },
	{ name: 'custom populated single', populated: true, uiSchema: { 'ui:options': { fileActionLabel: 'Upload certificate' } }, actionLabel: 'Upload certificate' },
	{ name: 'custom multiple', multiple: true, uiSchema: { 'ui:options': { fileActionLabel: 'Attach certificates' } }, actionLabel: 'Attach certificates' },
	{
		name: 'translated global label and title',
		multiple: true,
		uiSchema: { 'ui:globalOptions': { fileActionLabel: 'Adicionar ficheiros', title: 'Certificados' } },
		actionLabel: 'Adicionar ficheiros',
		fieldName: 'Certificados'
	},
	{
		name: 'local label over global label',
		uiSchema: { 'ui:globalOptions': { fileActionLabel: 'Attach file' }, 'ui:options': { fileActionLabel: 'Upload certificate' } },
		actionLabel: 'Upload certificate'
	},
	{ name: 'trimmed custom text', uiSchema: { 'ui:options': { fileActionLabel: '  Upload certificate  ' } }, actionLabel: 'Upload certificate' },
	{ name: 'empty text', uiSchema: { 'ui:options': { fileActionLabel: '' } }, actionLabel: 'Choose file' },
	{ name: 'blank populated single', populated: true, uiSchema: { 'ui:options': { fileActionLabel: '  ' } }, actionLabel: 'Replace file' },
	{
		name: 'blank local label overrides global label',
		uiSchema: { 'ui:globalOptions': { fileActionLabel: 'Attach file' }, 'ui:options': { fileActionLabel: '  ' } },
		actionLabel: 'Choose file'
	},
	{ name: 'numeric text', uiSchema: { 'ui:options': { fileActionLabel: 42 } }, actionLabel: 'Choose file' },
	{ name: 'object text', multiple: true, uiSchema: { 'ui:options': { fileActionLabel: { add: 'Attach files' } } }, actionLabel: 'Add files' },
	{ name: 'blank global text', multiple: true, uiSchema: { 'ui:globalOptions': { fileActionLabel: ' ' } }, actionLabel: 'Add files' }
].map(({ multiple = false, populated = false, fieldName, ...row }) => ({
	...row,
	multiple,
	schema: (multiple
		? { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' } }
		: { type: 'string', title: 'Certificate', format: 'data-url' }) as RJSFSchema,
	uiSchema: row.uiSchema as UiSchema,
	formData: populated ? CERTIFICATE : multiple ? ([] as string[]) : undefined,
	actionName: `${row.actionLabel}: ${fieldName ?? (multiple ? 'Certificates' : 'Certificate')}`
}));

export const R6_FILE_ACTION_TRANSITIONS = [
	{ name: 'single defaults', multiple: false, initialLabel: 'Choose file', selectedLabel: 'Replace file', uiSchema: {} },
	{ name: 'multiple defaults', multiple: true, initialLabel: 'Add files', selectedLabel: 'Add files', uiSchema: {} },
	{
		name: 'custom single label',
		multiple: false,
		initialLabel: 'Upload certificate',
		selectedLabel: 'Upload certificate',
		uiSchema: { 'ui:options': { fileActionLabel: 'Upload certificate' } }
	}
].map(row => ({
	...row,
	schema: (row.multiple
		? { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' } }
		: { type: 'string', title: 'Certificate', format: 'data-url' }) as RJSFSchema,
	uiSchema: row.uiSchema as UiSchema,
	formData: row.multiple ? ([] as string[]) : undefined,
	fieldName: row.multiple ? 'Certificates' : 'Certificate'
}));

export const R6_FILE_EMPTY_RESET_SHAPE = {
	schema: {
		type: 'object',
		properties: {
			certificate: R6_FILE_ACTION_TRANSITIONS[0].schema,
			host: { type: 'string', title: 'Host', default: 'default-broker.local' }
		}
	} as RJSFSchema,
	formData: { host: 'edited-broker.local' }
};
export const R6_FILE_READ_CANCELLATIONS = [
	'unmount',
	'readonly',
	'disabled',
	'readonly then editable',
	'disabled then editable',
	'external value',
	'discard',
	'reset defaults'
] as const;
export const R6_FILE_READ_FAILURES = [
	{ name: 'earlier read succeeds', earlierFails: false },
	{ name: 'earlier read fails', earlierFails: true }
];
export const R6_FILE_LABEL_SHAPES: readonly { name: string; schema: RJSFSchema; uiSchema?: UiSchema; expected: string }[] = [
	{ name: 'schema title', schema: { type: 'string', format: 'data-url', title: 'CA certificate' }, expected: 'Replace file: CA certificate' },
	{
		name: 'UI title',
		schema: { type: 'string', format: 'data-url', title: 'Certificate' },
		uiSchema: { 'ui:title': 'CA certificate' },
		expected: 'Replace file: CA certificate'
	},
	{
		name: 'UI options title',
		schema: { type: 'string', format: 'data-url', title: 'Certificate' },
		uiSchema: { 'ui:options': { title: 'CA certificate' } },
		expected: 'Replace file: CA certificate'
	},
	{
		name: 'global title',
		schema: { type: 'string', format: 'data-url', title: 'Certificate' },
		uiSchema: { 'ui:globalOptions': { title: 'CA certificate' } } as UiSchema,
		expected: 'Replace file: CA certificate'
	},
	{
		name: 'local title over global title',
		schema: { type: 'string', format: 'data-url', title: 'Certificate' },
		uiSchema: { 'ui:globalOptions': { title: 'Client certificate' }, 'ui:title': 'CA certificate' } as UiSchema,
		expected: 'Replace file: CA certificate'
	},
	{ name: 'untitled field', schema: { type: 'string', format: 'data-url' }, expected: 'Replace file: root' },
	{ name: 'suppressed title', schema: { type: 'string', format: 'data-url', title: 'Certificate' }, uiSchema: { 'ui:title': ' ' }, expected: 'Replace file: root' }
];
export const R6_FILE_ERROR_SHAPES = [
	{
		name: 'server item errors',
		formData: [CERTIFICATE, CLIENT_CERTIFICATE],
		extraErrors: { 0: { __errors: ['CA certificate expired.'] }, 1: { __errors: ['Client certificate expired.'] } },
		messages: ['CA certificate expired.', 'Client certificate expired.']
	},
	{
		name: 'one invalid stored value',
		formData: [CERTIFICATE, 'certificates/client.pem'],
		extraErrors: { 1: { __errors: ['Upload a client certificate.'] } },
		messages: ['', 'Upload a client certificate.']
	}
] as const;

export const R6_FILE_ARRAY_ENTRY_SHAPES: readonly {
	name: string;
	formData: readonly unknown[];
	invalidIndex: number;
	message: string;
	omitExtraData?: false;
}[] = [
	{ name: 'blank before certificate', formData: ['', CERTIFICATE], invalidIndex: 0, message: 'must match format "data-url"' },
	{ name: 'blank after certificate', formData: [CERTIFICATE, ''], invalidIndex: 1, message: 'must match format "data-url"' },
	{ name: 'only blank entry', formData: [''], invalidIndex: 0, message: 'must match format "data-url"' },
	{ name: 'null before certificate', formData: [null, CERTIFICATE], invalidIndex: 0, message: 'must be string' },
	{ name: 'undefined before certificate', formData: [undefined, CERTIFICATE], invalidIndex: 0, message: 'must be string' },
	{ name: 'number after certificate', formData: [CERTIFICATE, 42], invalidIndex: 1, message: 'must be string' },
	{ name: 'retained object before certificate', formData: [{ path: 'certificates/plant-ca.pem' }, CERTIFICATE], invalidIndex: 0, message: 'must be string', omitExtraData: false }
];

export const R6_FILE_LAYOUT_SHAPES = [
	{ name: 'empty single field', source: 'single empty, editable' },
	{ name: 'single secret reference', source: 'single secret reference, editable' },
	{ name: 'multiple files', source: 'multiple duplicate names, editable' },
	{
		name: 'multiple files with row error',
		source: 'multiple duplicate names, editable',
		extraErrors: { 1: { __errors: ['Client certificate expired.'] } }
	}
].map(({ source, ...row }) => ({ ...R6_FILE_SHAPES.find(shape => shape.name === source)!, ...row }));

const DescriptionWidget = () => <p data-description-widget>Connector setting</p>;
const collectionDescription = 'Configure the files or entries before deploying this connector.';
type DescriptionShape = {
	name: string;
	schema: RJSFSchema;
	uiSchema?: UiSchema;
	formData?: unknown;
	widgets?: Record<string, ComponentType<WidgetProps>>;
	kind: 'list' | 'file' | 'control' | 'custom';
	contentSelector: string;
	collection: boolean;
};
export const COLLECTION_DESCRIPTION_FIELDS: readonly DescriptionShape[] = [
	{
		name: 'scalar list',
		schema: { ...TOPICS, description: collectionDescription },
		formData: ['telemetry', 'alarms'],
		kind: 'list',
		contentSelector: '[data-schema-form-list="root"]',
		collection: true
	},
	{
		name: 'empty scalar list',
		schema: { ...TOPICS, description: collectionDescription },
		formData: [],
		kind: 'list',
		contentSelector: '[data-schema-form-list="root"]',
		collection: true
	},
	{
		name: 'tuple list',
		schema: { ...ENDPOINTS, description: collectionDescription },
		formData: ['broker-1.local', 'broker-2.local'],
		kind: 'list',
		contentSelector: '[data-schema-form-list="root"]',
		collection: true
	},
	{
		name: 'object sections',
		schema: { ...DESCRIBED_CONNECTION_ARRAY, description: collectionDescription },
		uiSchema: { 'ui:options': { layout: 'sections' } },
		formData: [{ host: 'broker-1.local' }],
		kind: 'list',
		contentSelector: '[data-schema-form-list="root"]',
		collection: true
	},
	{
		name: 'object table',
		schema: { ...DESCRIBED_CONNECTION_ARRAY, description: collectionDescription },
		formData: [{ host: 'broker-1.local' }],
		kind: 'list',
		contentSelector: '[data-schema-form-list="root"]',
		collection: true
	},
	{
		name: 'single file',
		schema: { type: 'string', title: 'Certificate', format: 'data-url', description: collectionDescription },
		formData: CERTIFICATE,
		kind: 'file',
		contentSelector: 'input[type="file"]',
		collection: true
	},
	{
		name: 'empty single file',
		schema: { type: 'string', title: 'Certificate', format: 'data-url', description: collectionDescription },
		kind: 'file',
		contentSelector: 'input[type="file"]',
		collection: true
	},
	{
		name: 'multiple files',
		schema: { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' }, description: collectionDescription },
		formData: [CERTIFICATE, CLIENT_CERTIFICATE],
		kind: 'file',
		contentSelector: 'input[type="file"]',
		collection: true
	},
	{
		name: 'empty multiple files',
		schema: { type: 'array', title: 'Certificates', items: { type: 'string', format: 'data-url' }, description: collectionDescription },
		formData: [],
		kind: 'file',
		contentSelector: 'input[type="file"]',
		collection: true
	},
	{
		name: 'single file alias',
		schema: { type: 'string', title: 'Certificate', description: collectionDescription },
		uiSchema: { 'ui:widget': 'connectorFile' },
		widgets: { connectorFile: FileWidget },
		formData: CERTIFICATE,
		kind: 'file',
		contentSelector: 'input[type="file"]',
		collection: true
	},
	{
		name: 'multiple file component',
		schema: { ...TOPICS, description: collectionDescription },
		uiSchema: { 'ui:widget': FileWidget },
		formData: [CERTIFICATE],
		kind: 'file',
		contentSelector: 'input[type="file"]',
		collection: true
	},
	{
		name: 'multi-select',
		schema: { type: 'array', title: 'Assets', uniqueItems: true, items: { type: 'string', enum: ['north-line', 'south-line'] }, description: collectionDescription },
		formData: ['north-line'],
		kind: 'control',
		contentSelector: 'kv-multi-select-dropdown',
		collection: false
	},
	{
		name: 'text input',
		schema: { type: 'string', title: 'Broker', description: collectionDescription },
		formData: 'broker-1.local',
		kind: 'control',
		contentSelector: 'kv-text-field',
		collection: false
	},
	{
		name: 'textarea',
		schema: { type: 'string', title: 'Notes', description: collectionDescription },
		uiSchema: { 'ui:widget': 'textarea' },
		formData: 'Plant broker',
		kind: 'control',
		contentSelector: 'kv-text-area',
		collection: false
	},
	{
		name: 'custom file widget',
		schema: { type: 'string', title: 'Certificate', format: 'data-url', description: collectionDescription },
		widgets: { FileWidget: DescriptionWidget },
		formData: CERTIFICATE,
		kind: 'custom',
		contentSelector: '[data-description-widget]',
		collection: false
	},
	{
		name: 'custom array widget',
		schema: { ...TOPICS, description: collectionDescription },
		uiSchema: { 'ui:widget': DescriptionWidget },
		formData: [],
		kind: 'custom',
		contentSelector: '[data-description-widget]',
		collection: false
	},
	{
		name: 'custom array layout',
		schema: { ...TOPICS, description: collectionDescription },
		uiSchema: { 'ui:ArrayFieldTemplate': CustomArrayLayout },
		formData: ['telemetry'],
		kind: 'custom',
		contentSelector: 'kv-text-field',
		collection: false
	}
];
export const COLLECTION_DESCRIPTION_SHAPES = COLLECTION_DESCRIPTION_FIELDS.flatMap(row =>
	[
		{ name: 'default', options: {}, position: row.collection ? 'top' : 'bottom' },
		{ name: 'explicit top', options: { 'ui:descriptionPosition': 'top' }, position: 'top' },
		{ name: 'explicit bottom', options: { 'ui:options': { descriptionPosition: 'bottom' } }, position: 'bottom' },
		{ name: 'suppressed', options: { 'ui:descriptionPosition': 'none' }, position: 'none' },
		{ name: 'global bottom', options: { 'ui:globalOptions': { descriptionPosition: 'bottom' } }, position: 'bottom' }
	].map(placement => {
		const uiSchema: UiSchema = { ...row.uiSchema, ...placement.options };
		if (uiSchema['ui:options']) uiSchema['ui:options'] = { ...row.uiSchema?.['ui:options'], ...uiSchema['ui:options'] };
		return { ...row, name: `${row.name}; ${placement.name}`, uiSchema, position: placement.position };
	})
);

const referencedConnectionList = SECTION_HEADING_SHAPES.find(row => row.name === 'referenced object list')!.schema;
const referencedTopicList: RJSFSchema = { type: 'array', title: 'Topics', definitions: { topic: { type: 'string', title: 'Topic' } }, items: { $ref: '#/definitions/topic' } };
export const COLLECTION_ADD_ALIGNMENT_SHAPES = [
	{ name: 'referenced object items', schema: referencedConnectionList, grip: false, empty: [], populated: [{ host: 'broker-1.local' }] },
	{
		name: 'allOf object items',
		schema: { ...referencedConnectionList, items: { allOf: [{ $ref: '#/definitions/connection' }] } },
		grip: false,
		empty: [],
		populated: [{ host: 'broker-1.local' }]
	},
	{ name: 'referenced scalar items', schema: referencedTopicList, grip: true, empty: [], populated: ['line-1.telemetry'] },
	{
		name: 'referenced additional object items',
		schema: { ...referencedConnectionList, items: [{ type: 'string', title: 'Primary broker' }], additionalItems: { $ref: '#/definitions/connection' } } as RJSFSchema,
		grip: false,
		empty: ['broker-1.local'],
		populated: ['broker-1.local', { host: 'broker-2.local' }]
	},
	{
		name: 'referenced additional scalar items',
		schema: { ...referencedTopicList, items: [{ type: 'string', title: 'Telemetry topic' }], additionalItems: { $ref: '#/definitions/topic' } } as RJSFSchema,
		grip: true,
		empty: ['line-1.telemetry'],
		populated: ['line-1.telemetry', 'line-1.alarms']
	}
].flatMap(({ empty, populated, ...row }) => [
	{ ...row, name: `${row.name}; empty`, formData: empty },
	{ ...row, name: `${row.name}; populated`, formData: populated }
]);

export const COLLECTION_ENTRY_ERROR_SHAPES = ['scalar list', 'object table', 'object sections', 'multiple files']
	.map(name => {
		const row = COLLECTION_DESCRIPTION_FIELDS.find(row => row.name === name)!;
		const message = 'Review the first connector entry.';
		return {
			...row,
			schema:
				name === 'scalar list'
					? { ...row.schema, items: { ...(row.schema.items as RJSFSchema), default: 'telemetry', description: 'Use the configured broker topic.' } }
					: row.schema,
			uiSchema: name === 'scalar list' ? { items: { 'ui:showDefaultValueHelper': true } } : row.uiSchema,
			message,
			extraErrors: name.startsWith('object') ? { 0: { host: { __errors: [message] } } } : { 0: { __errors: [message] } },
			entrySelector: row.kind === 'file' ? '[data-file-index="0"]' : '[data-schema-form-list-item="0"]'
		};
	})
	.flatMap(row =>
		row.name === 'scalar list'
			? [true, false].flatMap(orderable =>
					[true, false].map(removable => ({
						...row,
						name: `${row.name}; orderable=${orderable}, removable=${removable}`,
						uiSchema: { ...row.uiSchema, 'ui:options': { orderable, removable } }
					}))
			  )
			: [row]
	);

export const WIDGET_ENTRY_LAYOUT_SHAPES = [
	...['scalar list', 'object table', 'multiple files'].map(name => {
		const row = COLLECTION_DESCRIPTION_FIELDS.find(row => row.name === name)!;
		const formData = Array.isArray(row.formData) && row.formData.length === 1 ? [...row.formData, ...row.formData] : row.formData;
		return { name, schema: row.schema, uiSchema: row.uiSchema, formData, kind: row.kind === 'file' ? 'file' : 'list' };
	}),
	...['RadioWidget', 'RadioListWidget'].map(widget => ({
		name: widget,
		schema: { type: 'string', title: 'Delivery policy', enum: ['At most once', 'At least once'] } as RJSFSchema,
		uiSchema: { 'ui:widget': widget } as UiSchema,
		formData: 'At least once',
		kind: 'radio'
	}))
];

export const FILE_FEEDBACK_LAYOUT_SHAPES = [
	{ name: 'uploaded single file', formData: CERTIFICATE },
	{ name: 'single secret reference', formData: '<% secrets.ca %>' },
	{ name: 'empty single file', formData: undefined }
].map(row => ({ ...row, schema: { type: 'string', title: 'CA certificate', format: 'data-url' } as RJSFSchema, message: 'Review the CA certificate.' }));

const describedFiles = COLLECTION_DESCRIPTION_FIELDS.find(row => row.name === 'multiple files')!.schema;
const describedChoices = COLLECTION_DESCRIPTION_FIELDS.find(row => row.name === 'multi-select')!.schema;
export const ARRAY_WIDGET_DISPATCH_SHAPES: readonly {
	name: string;
	schema: RJSFSchema;
	uiSchema: UiSchema;
	file: boolean;
	collection: boolean;
	contentSelector: string;
}[] = [
	{
		name: 'file array with global custom widget',
		schema: describedFiles,
		uiSchema: { 'ui:globalOptions': { widget: DescriptionWidget } },
		file: false,
		collection: false,
		contentSelector: '[data-description-widget]'
	},
	{
		name: 'file array with global file widget',
		schema: describedFiles,
		uiSchema: { 'ui:globalOptions': { widget: FileWidget } },
		file: true,
		collection: true,
		contentSelector: 'input[type="file"]'
	},
	{
		name: 'local file alias overrides global custom widget',
		schema: describedFiles,
		uiSchema: { 'ui:globalOptions': { widget: DescriptionWidget }, 'ui:widget': 'files' },
		file: true,
		collection: true,
		contentSelector: 'input[type="file"]'
	},
	{
		name: 'local custom widget overrides global file widget',
		schema: describedFiles,
		uiSchema: { 'ui:globalOptions': { widget: FileWidget }, 'ui:widget': DescriptionWidget },
		file: false,
		collection: false,
		contentSelector: '[data-description-widget]'
	},
	{
		name: 'multi-select with global file widget',
		schema: describedChoices,
		uiSchema: { 'ui:globalOptions': { widget: FileWidget } },
		file: true,
		collection: true,
		contentSelector: 'input[type="file"]'
	},
	{
		name: 'multi-select with global custom widget',
		schema: describedChoices,
		uiSchema: { 'ui:globalOptions': { widget: DescriptionWidget } },
		file: false,
		collection: false,
		contentSelector: '[data-description-widget]'
	},
	{
		name: 'normal array ignores global file widget',
		schema: { ...TOPICS, description: collectionDescription },
		uiSchema: { 'ui:globalOptions': { widget: FileWidget } },
		file: false,
		collection: true,
		contentSelector: '[data-schema-form-list="root"]'
	},
	{
		name: 'file tuple ignores global widget for its layout',
		schema: { type: 'array', title: 'Certificates', description: collectionDescription, items: [{ type: 'string', format: 'data-url' }] },
		uiSchema: { 'ui:globalOptions': { widget: FileWidget } },
		file: false,
		collection: true,
		contentSelector: '[data-schema-form-list="root"]'
	},
	{
		name: 'custom widget replaces the fixed tuple layout',
		schema: { type: 'array', title: 'Certificates', description: collectionDescription, items: [{ type: 'string', format: 'data-url' }] },
		uiSchema: { 'ui:widget': FileWidget },
		file: true,
		collection: true,
		contentSelector: 'input[type="file"]'
	}
];

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
	R5_ARRAY_ACTIONS,
	R5_FOCUS_ARRAY_SHAPES,
	R5_TUPLE_FOCUS_CASES,
	R5_FOCUS_CANCELLATIONS,
	R5_PROPERTY_SHAPES,
	R5_PROPERTY_TEMPLATES,
	R5_ADD_LIMITS,
	R5_ENTRY_WIDGETS,
	R5_FALLBACK_SHAPES,
	FIELDSET_BACKGROUND_SHAPES,
	OBJECT_SHAPES,
	ACTION_NAME_SHAPES,
	SUBMIT_BUTTON_SHAPES,
	TEXTAREA_CONSUMER_SHAPES,
	TEXTAREA_EDITABILITY_SHAPES,
	TEXTAREA_VALIDATION_SHAPES,
	R7_TEXTAREA_EMPTY_SHAPES,
	R7_TEXTAREA_LIMIT_SHAPES,
	R7_TEXTAREA_PASTE_SHAPES,
	R7_TEXTAREA_REPLACEMENT_SHAPES,
	R7_TEXTAREA_NATIVE_INPUT_SHAPES,
	R7_TEXTAREA_COMPOSITION_SHAPES,
	R7_TEXTAREA_RESET_SHAPES,
	HELP_TEXT_CONSUMER_SHAPES,
	BROKER_SCHEMA,
	BROKER_FORM_DATA,
	ERROR_SHAPES,
	R2_SUBMIT_SCHEMA,
	R2_SUBMIT_CASES,
	R2_VALIDATION_SHAPES,
	R2_ERROR_DESCRIPTION_SHAPES,
	FIELD_FEEDBACK_SHAPES,
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
	R6_FILE_VALUES,
	R6_FILE_STATES,
	R6_FILE_REFERENCE_SHAPES,
	R6_FILE_REFERENCE_FORMS,
	R6_FILE_SHAPES,
	R6_FILE_ACTION_LABEL_SHAPES,
	R6_FILE_ACTION_TRANSITIONS,
	R6_FILE_EMPTY_RESET_SHAPE,
	R6_FILE_READ_CANCELLATIONS,
	R6_FILE_READ_FAILURES,
	R6_FILE_LABEL_SHAPES,
	R6_FILE_ERROR_SHAPES,
	R6_FILE_ARRAY_ENTRY_SHAPES,
	R6_FILE_LAYOUT_SHAPES,
	COLLECTION_DESCRIPTION_FIELDS,
	COLLECTION_DESCRIPTION_SHAPES,
	COLLECTION_ADD_ALIGNMENT_SHAPES,
	COLLECTION_ENTRY_ERROR_SHAPES,
	WIDGET_ENTRY_LAYOUT_SHAPES,
	FILE_FEEDBACK_LAYOUT_SHAPES,
	ARRAY_WIDGET_DISPATCH_SHAPES,
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
	L1_HIDDEN_ITEM_WIDGETS,
	L1_ARRAY_TEMPLATE_SHAPES,
	L1_UNION_LIST_SHAPES,
	L1_ITEM_FIELD_COMPONENTS,
	FLAT_OBJECT_SHAPES,
	L2_ELIGIBILITY_SHAPES,
	L2_PRESENTATION_SHAPES,
	L2_SIZE_SHAPES,
	L2_LABEL_SHAPES,
	L2_ITEM_GUIDANCE_SHAPES,
	L2_DESCRIPTION_SHAPES,
	L2_REGISTRY_OVERRIDES,
	L2_ROW_ERROR_SHAPES,
	L2_NUMERIC_DISPATCH_SHAPES,
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
