import { FormContextType, getSchemaType, getUiOptions, Registry, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';

const FIELD_BY_TYPE: Record<string, string> = {
	array: 'ArrayField',
	boolean: 'BooleanField',
	integer: 'NumberField',
	number: 'NumberField',
	object: 'ObjectField',
	string: 'StringField',
	null: 'NullField'
};

/** Mirrors RJSF 5 SchemaField dispatch, then compares with the type's registry default; see the contract test. */
export const hasCustomField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>,
	schema: S
): boolean => {
	const { field } = getUiOptions(uiSchema, registry.globalUiOptions);
	const schemaType = getSchemaType(schema);
	const type = Array.isArray(schemaType) ? schemaType[0] : schemaType || '';
	const defaultField = registry.fields[FIELD_BY_TYPE[type]];
	const selected =
		typeof field === 'function'
			? field
			: typeof field === 'string' && field in registry.fields
			? registry.fields[field]
			: schema.$id && schema.$id in registry.fields
			? registry.fields[schema.$id]
			: defaultField;
	return selected !== defaultField;
};
