import { FieldTemplateProps, FormContextType, getSchemaType, getUiOptions, getWidget, hasWidget, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { getWidget as getBooleanWidget } from '../Fields/BooleanField/utils';

/** Mirrors pinned RJSF 5 StringField dispatch, with Kelvin's BooleanField dispatch; see the contract test. */
export const getChoiceWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	uiSchema,
	registry
}: Pick<FieldTemplateProps<T, S, F>, 'schema' | 'uiSchema' | 'registry'>) => {
	if (getSchemaType(schema) === 'boolean') return getBooleanWidget(uiSchema, registry.widgets);
	let defaultWidget = registry.schemaUtils.isSelect(schema) ? 'select' : 'text';
	if (schema.format && hasWidget(schema, schema.format, registry.widgets)) defaultWidget = schema.format;
	const { widget = defaultWidget } = getUiOptions(uiSchema);
	return getWidget(schema, widget, registry.widgets);
};
