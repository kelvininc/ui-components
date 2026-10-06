import {
	findSchemaDefinition,
	FormContextType,
	getSchemaType,
	getTemplate,
	getUiOptions,
	getWidget,
	orderProperties,
	Registry,
	RJSFSchema,
	StrictRJSFSchema,
	UiSchema
} from '@rjsf/utils';
import { getDefaultRegistry } from '@rjsf/core';
import { isPlainObject } from 'lodash';
import { EDescriptionPosition } from '../types';
import { hasCustomField } from '../rjsf/hasCustomField';
import { getRenderedArrayFieldTemplate } from '../rjsf/arrayTemplate';
import { getChoiceWidget } from '../rjsf/choiceWidget';
import { isBuiltinSchemaField } from '../rjsf/SchemaField';
import TextWidget from '../Widgets/TextWidget';
import SelectWidget from '../Widgets/SelectWidget';
import EmailWidget from '../Widgets/EmailWidget';
import FieldTemplate from './FieldTemplate';
import ObjectFieldTemplate from './ObjectFieldTemplate';
import BaseInputTemplate from './BaseInputTemplate';
import TitleFieldTemplate from './TitleFieldTemplate';
import WrapIfAdditionalTemplate from './WrapIfAdditionalTemplate';
import buildDefaultHelperText, { buildHelperOptions } from './FieldTemplate/utils';

export const getObjectArrayItems = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(schema: S, registry: Registry<T, S, F>): S | undefined => {
	if (getSchemaType(schema) !== 'array' || !isPlainObject(schema.items) || registry.schemaUtils.isMultiSelect(schema)) return undefined;
	const items = registry.schemaUtils.retrieveSchema(schema.items as S);
	return getSchemaType(items) === 'object' ? items : undefined;
};

export const isSectionSchema = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(schema: S, registry: Registry<T, S, F>): boolean =>
	getSchemaType(schema) === 'object' || Boolean(getObjectArrayItems(schema, registry));

export const isSectionField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	schema: S,
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>
): boolean =>
	!hasCustomField(uiSchema, registry, schema) &&
	isSectionSchema(schema, registry) &&
	(getSchemaType(schema) !== 'array' || Boolean(getRenderedArrayFieldTemplate(schema, uiSchema, registry)));

export type TableColumn = { name: string; title: string; description?: string; required: boolean };
const CELL_WIDGETS = ['text', 'TextWidget', 'updown', 'UpDownWidget', 'select', 'SelectWidget'];
const WIDGET_FORMATS = ['data-url', 'date', 'date-time', 'time', 'color'];

// Check before retrieval: RJSF resolves conditional branches using the current data.
const hasDynamicItems = (schema: RJSFSchema, root: RJSFSchema, seen = new Set<RJSFSchema>(), select = false): boolean => {
	if (seen.has(schema)) return false;
	seen.add(schema);
	return (
		['dependencies', 'if', ...(!select ? ['oneOf', 'anyOf'] : [])].some(key => key in schema) ||
		Boolean(schema.$ref && hasDynamicItems(findSchemaDefinition(schema.$ref, root), root, seen, select)) ||
		Boolean(schema.allOf?.some(part => typeof part !== 'boolean' && hasDynamicItems(part, root, seen, select)))
	);
};

export const getTableColumns = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	items: S,
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>
): TableColumn[] | undefined => {
	try {
		if (hasDynamicItems(items, registry.rootSchema)) return undefined;
		const resolved = registry.schemaUtils.retrieveSchema(items);
		const options = getUiOptions(uiSchema, registry.globalUiOptions);
		const itemDescription = options.descriptionPosition === EDescriptionPosition.None ? undefined : options.description ?? resolved.description;
		if (itemDescription || options.help || buildDefaultHelperText(buildHelperOptions(registry.formContext, options), resolved.default)) return undefined;
		const defaults = getDefaultRegistry<T, S, F>();
		if (
			getSchemaType(resolved) !== 'object' ||
			hasCustomField(uiSchema, registry, resolved) ||
			options.field ||
			getUiOptions(uiSchema).widget ||
			resolved.additionalProperties ||
			Object.keys(resolved.patternProperties ?? {}).length ||
			!isBuiltinSchemaField(registry.fields.SchemaField) ||
			(registry.fields.ArraySchemaField && !isBuiltinSchemaField(registry.fields.ArraySchemaField)) ||
			['ObjectField', 'StringField', 'NumberField'].some(name => registry.fields[name] !== defaults.fields[name]) ||
			getTemplate('FieldTemplate', registry, options) !== FieldTemplate ||
			getTemplate('ObjectFieldTemplate', registry, options) !== ObjectFieldTemplate ||
			getTemplate('TitleFieldTemplate', registry, options) !== TitleFieldTemplate ||
			getTemplate('WrapIfAdditionalTemplate', registry, options) !== WrapIfAdditionalTemplate
		)
			return undefined;
		const names = orderProperties(Object.keys(resolved.properties ?? {}), uiSchema?.['ui:order']);
		const visible = names.filter(name => getUiOptions(uiSchema?.[name], registry.globalUiOptions).widget !== 'hidden');
		if (!visible.length || visible.length > 4) return undefined;
		const columns: TableColumn[] = [];
		for (const name of visible) {
			const raw = resolved.properties![name];
			if (typeof raw === 'boolean') return undefined;
			const property = registry.schemaUtils.retrieveSchema(raw as S);
			if (hasDynamicItems(raw, registry.rootSchema, new Set(), registry.schemaUtils.isSelect(property))) return undefined;
			const fieldUiSchema = uiSchema?.[name];
			const fieldOptions = getUiOptions(fieldUiSchema, registry.globalUiOptions);
			const fieldWidget = getUiOptions(fieldUiSchema).widget;
			if (
				!['string', 'number', 'integer'].includes(String(getSchemaType(property))) ||
				fieldOptions.label === false ||
				(typeof fieldOptions.title === 'string' && !fieldOptions.title.trim()) ||
				fieldOptions.field ||
				hasCustomField(fieldUiSchema, registry, property) ||
				(fieldWidget && !CELL_WIDGETS.includes(String(fieldWidget))) ||
				(!fieldWidget && WIDGET_FORMATS.includes(String(property.format))) ||
				getTemplate('FieldTemplate', registry, fieldOptions) !== FieldTemplate ||
				getTemplate('BaseInputTemplate', registry, fieldOptions) !== BaseInputTemplate ||
				getTemplate('TitleFieldTemplate', registry, fieldOptions) !== TitleFieldTemplate ||
				getTemplate('WrapIfAdditionalTemplate', registry, fieldOptions) !== WrapIfAdditionalTemplate
			)
				return undefined;
			const expectedWidgets = { ...defaults.widgets, TextWidget, SelectWidget, EmailWidget } as Registry<T, S, F>['widgets'];
			const widget = getChoiceWidget({ schema: property, uiSchema: fieldUiSchema, registry });
			const expected = getChoiceWidget({ schema: property, uiSchema: fieldUiSchema, registry: { ...registry, widgets: expectedWidgets } });
			if (widget !== expected) return undefined;
			// A format may use a standard text widget, but never a file/date/color control.
			const allowed = ['text', 'updown', 'select', 'email', 'uri'].some(alias => {
				try {
					return widget === getWidget(property, alias, expectedWidgets);
				} catch {
					return false;
				}
			});
			if (!allowed) return undefined;
			const description = fieldOptions.descriptionPosition === EDescriptionPosition.None ? undefined : fieldOptions.description ?? property.description;
			columns.push({
				name,
				title: fieldOptions.title?.trim() || property.title?.trim() || name,
				description: [description, fieldOptions.help].filter(value => typeof value === 'string' && value.trim()).join('\n') || undefined,
				required: resolved.required?.includes(name) ?? false
			});
		}
		return columns;
	} catch {
		return undefined;
	}
};

export const isTableEligible = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	items: S,
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>
) => Boolean(getTableColumns(items, uiSchema, registry));
