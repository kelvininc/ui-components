import { FormContextType, getSchemaType, Registry, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';
import { isPlainObject } from 'lodash';
import { hasCustomField } from '../rjsf/hasCustomField';
import { getRenderedArrayFieldTemplate } from '../rjsf/arrayTemplate';

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
