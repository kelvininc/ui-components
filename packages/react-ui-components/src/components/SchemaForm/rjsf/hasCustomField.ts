import { FormContextType, getUiOptions, Registry, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';

/** Mirrors RJSF 5 SchemaField's custom field dispatch; see the adjacent contract test. */
export const hasCustomField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>,
	schema: S
): boolean => {
	const { field } = getUiOptions(uiSchema, registry.globalUiOptions);
	return typeof field === 'function' || (typeof field === 'string' && field in registry.fields) || (typeof schema.$id === 'string' && schema.$id in registry.fields);
};
