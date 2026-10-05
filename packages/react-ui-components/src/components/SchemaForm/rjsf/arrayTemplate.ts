import { getDefaultRegistry } from '@rjsf/core';
import { FormContextType, getSchemaType, getTemplate, getUiOptions, isCustomWidget, isFixedItems, Registry, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';
import { hasCustomField } from './hasCustomField';

export const defaultArrayDescriptionTemplate = getDefaultRegistry().templates.ArrayFieldDescriptionTemplate;

/** Mirrors ArrayField.render's template/widget branches, after SchemaField dispatch. */
export const getRenderedArrayFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	schema: S,
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>
) => {
	if (
		getSchemaType(schema) !== 'array' ||
		hasCustomField(uiSchema, registry, schema) ||
		!('items' in schema) ||
		registry.schemaUtils.isMultiSelect(schema) ||
		isCustomWidget(uiSchema)
	)
		return undefined;
	if (!isFixedItems(schema) && registry.schemaUtils.isFilesArray(schema, uiSchema)) return undefined;
	// RJSF 5's normal and tuple render paths select templates with local options (see the contract).
	return getTemplate('ArrayFieldTemplate', registry, getUiOptions(uiSchema));
};
