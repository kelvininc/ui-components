import { getUiOptions } from '@rjsf/utils';
import { mergeWith } from 'lodash';
import { describe, expect, it } from 'vitest';
import { R4_OPTION_PAYLOAD_SHAPE, R4_UI_SETTING_SHAPES, TEMPLATE_COMPONENTS } from '../test-utils/matrix';
import { areSettingsEqual, keepUnlessSettings, mergeUiSchemas } from './merge';

describe.each(TEMPLATE_COMPONENTS)('$name settings merge', ({ FieldLayout }) => {
	it('preserves component identity inside copied settings', () => {
		const source = { host: { 'ui:FieldTemplate': FieldLayout, 'ui:options': { disabled: false } } };
		const result = mergeWith({}, source, keepUnlessSettings);
		expect(result.host).not.toBe(source.host);
		expect(result.host['ui:FieldTemplate']).toBe(FieldLayout);
		expect(result.host['ui:options']).not.toBe(source.host['ui:options']);
	});
	it('replaces a retained component with fresh settings without mutating it', () => {
		const keys = Reflect.ownKeys(FieldLayout);
		const provided = { inputWidth: 640, nested: { enabled: true } };
		const result = mergeWith({}, { input: FieldLayout }, { input: provided }, keepUnlessSettings);
		expect(result.input).toEqual(provided);
		expect(result.input).not.toBe(provided);
		expect(result.input.nested).not.toBe(provided.nested);
		expect(Reflect.ownKeys(FieldLayout)).toEqual(keys);
	});
});

it('replaces arrays as a whole and merges ordinary settings without changing either source', () => {
	const inherited = { order: ['host', 'port'], options: { enabled: true, inputWidth: 320 } };
	const provided = { order: [] as string[], options: { inputWidth: 640 } };
	const result = mergeWith({}, inherited, provided, keepUnlessSettings);
	expect(result).toEqual({ order: [], options: { enabled: true, inputWidth: 640 } });
	expect(result.order).toBe(provided.order);
	expect(inherited).toEqual({ order: ['host', 'port'], options: { enabled: true, inputWidth: 320 } });
	expect(provided).toEqual({ order: [], options: { inputWidth: 640 } });
});

it.each([[], new Date('2026-10-06T00:00:00Z')])('replaces a retained non-settings value with a fresh object', inherited => {
	const keys = Reflect.ownKeys(inherited);
	const provided = { enabled: true };
	const result = mergeWith({}, { input: inherited }, { input: provided }, keepUnlessSettings);
	expect(result.input).toEqual(provided);
	expect(result.input).not.toBe(provided);
	expect(Reflect.ownKeys(inherited)).toEqual(keys);
});

it('compares rebuilt settings structurally while distinguishing component references', () => {
	const component = TEMPLATE_COMPONENTS[1].FieldLayout;
	expect(areSettingsEqual({ host: { 'ui:FieldTemplate': component } }, { host: { 'ui:FieldTemplate': component } })).toBe(true);
	expect(areSettingsEqual({ host: { 'ui:FieldTemplate': component } }, { host: { 'ui:FieldTemplate': { ...component } } })).toBe(false);
});

describe.each(R4_UI_SETTING_SHAPES)('inherited $name UI', inherited => {
	it.each(R4_UI_SETTING_SHAPES)('accepts explicit $name overrides at the boundary and in child settings', provided => {
		const component = TEMPLATE_COMPONENTS[1].FieldLayout;
		const order = ['port', 'host'];
		const source = {
			...inherited.build({ label: true }),
			host: { 'ui:options': { placeholder: 'Broker address' }, ...inherited.build({ widget: 'text', FieldTemplate: component, order }) }
		};
		const result = mergeUiSchemas(source, { ...provided.build({ label: false }), host: provided.build({ widget: 'password' }) });
		expect(getUiOptions(result).label).toBe(false);
		expect(getUiOptions(result.host).widget).toBe('password');
		expect(getUiOptions(result.host).FieldTemplate).toBe(component);
		expect(getUiOptions(result.host).order).toBe(order);
		expect(getUiOptions(source.host).widget).toBe('text');
	});
});

it('uses RJSF precedence within a single source before merging layers', () => {
	const directLast = { 'ui:options': { label: false }, 'ui:label': true };
	const optionsLast = { 'ui:label': true, 'ui:options': { label: false } };
	expect(getUiOptions(mergeUiSchemas(directLast)).label).toBe(getUiOptions(directLast).label);
	expect(getUiOptions(mergeUiSchemas(optionsLast)).label).toBe(getUiOptions(optionsLast).label);
});

it.each(R4_UI_SETTING_SHAPES)('preserves JSON option payloads supplied through $name', ({ build }) => {
	const { emptyValue, customOptions } = R4_OPTION_PAYLOAD_SHAPE;
	const result = mergeUiSchemas({ host: build({ emptyValue, customOptions }) });
	expect(getUiOptions(result.host).emptyValue).toEqual(emptyValue);
	expect(getUiOptions(result.host).customOptions).toEqual(customOptions);
});
