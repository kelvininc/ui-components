import { Experimental_DefaultFormStateBehavior, FormContextType, getDefaultFormState, RJSFSchema, StrictRJSFSchema, ValidatorType } from '@rjsf/utils';
import { SchemaFormContext } from '../../components';
import { customizeValidator, CustomValidatorOptionsType } from '@rjsf/validator-ajv8';
import { EApplyDefaults } from '../../components/SchemaForm/types';
import {
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ALL_OFF,
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY,
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_CONST_AS_DEFAULT,
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT
} from './config';
import { JSONSchema7Definition } from 'json-schema';
import { UiSchema } from '@rjsf/utils';
import { set } from 'lodash';

export type NormalizeEnumsResult<S extends StrictRJSFSchema = RJSFSchema> = {
	schema: S;
	uiSchema: UiSchema;
};

const isOneOfWithTitleAndConst = (schema: JSONSchema7Definition[]): schema is { title: string; const: string }[] => {
	if (!schema || typeof schema !== 'object') {
		return false;
	}

	if (schema.every(item => item && Object.keys(item).every(key => ['title', 'const'].includes(key)))) {
		return true;
	}

	return false;
};

const setNestedValue = (obj: UiSchema, path: string[], value: unknown): void => {
	set(obj, path, value);
	// let current = obj;
	// for (let i = 0; i < path.length - 1; i++) {
	// 	if (!current[path[i]]) {
	// 		current[path[i]] = {};
	// 	}
	// 	current = current[path[i]] as UiSchema;
	// }
	// current[path[path.length - 1]] = value;
};

/**
 * Collapses simple `oneOf` constructs (whose members consist ONLY of `title` + `const`) into
 * an equivalent `{ enum: [...] }` representation, with titles returned separately in uiSchema.
 *
 * @typeParam S - Schema type extending `StrictRJSFSchema`.
 * @param schema - The schema to normalize.
 * @returns Object with normalized schema and uiSchema containing ui:enumNames.
 *
 * @example
 * const schema = { properties: { status: { type: 'string', oneOf: [
 *   { const: 'on',  title: 'On' },
 *   { const: 'off', title: 'Off' }
 * ]}}};
 * normalizeEnums(schema);
 * // => { schema: { properties: { status: { type: 'string', enum: ['on', 'off'] }}},
 * //      uiSchema: { status: { 'ui:enumNames': ['On', 'Off'] }}}
 */
export const normalizeEnums = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): NormalizeEnumsResult<S> => {
	const uiSchema: UiSchema = {};

	const normalize = (subSchema: unknown, path: string[]): unknown => {
		if (!subSchema || typeof subSchema !== 'object') {
			return subSchema;
		}

		if (Array.isArray(subSchema)) {
			return subSchema.map((item, index) => normalize(item, [...path, String(index)]));
		}

		const schemaObj = subSchema as Record<string, unknown>;

		// Check if it's a oneOf with title and const
		if (Array.isArray(schemaObj.oneOf) && isOneOfWithTitleAndConst(schemaObj.oneOf as JSONSchema7Definition[])) {
			const { oneOf, ...rest } = schemaObj;
			const typedOneOf = oneOf as { title: string; const: string }[];
			const enumNames = typedOneOf.map(item => item.title);

			// Add to uiSchema at the correct path
			if (path.length > 0) {
				setNestedValue(uiSchema, [...path, 'ui:enumNames'], enumNames);
			}

			return {
				...rest,
				enum: typedOneOf.map(item => item.const)
			};
		}

		// Process properties - the uiSchema path should skip 'properties'
		if (schemaObj.properties && typeof schemaObj.properties === 'object') {
			const normalizedProperties: Record<string, unknown> = {};
			for (const propKey of Object.keys(schemaObj.properties as Record<string, unknown>)) {
				normalizedProperties[propKey] = normalize((schemaObj.properties as Record<string, unknown>)[propKey], [...path, propKey]);
			}
			return { ...schemaObj, properties: normalizedProperties };
		}

		// Process items - the uiSchema path should skip 'items'
		if (schemaObj.items) {
			return { ...schemaObj, items: normalize(schemaObj.items, path) };
		}

		// Process other keys recursively
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(schemaObj)) {
			result[key] = normalize(schemaObj[key], path);
		}
		return result;
	};

	const normalizedSchema = normalize(structuredClone(schema), []) as S;

	return { schema: normalizedSchema, uiSchema };
};

/**
 * Normalizes a JSON schema by applying various transformations.
 * @param schema The schema to normalize.
 * @returns Object with normalized schema and uiSchema.
 */
export function normalizeSchema<S extends StrictRJSFSchema = RJSFSchema>(schema: S): NormalizeEnumsResult<S> {
	return normalizeEnums(cleanUnsupportedSchemaKeys(schema));
}

export const cleanUnsupportedSchemaKeys = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): S => {
	// Remove unsupported keys from the schema
	const { $schema, ...cleanedSchema } = schema;
	return cleanedSchema as S;
};

export const getInitialFormData = <T, S extends StrictRJSFSchema = RJSFSchema>(
	schema: S,
	formDataProp: T | undefined,
	validator: ValidatorType<T, S, SchemaFormContext> = getDefaultValidator<T, S>(),
	applyDefaults: EApplyDefaults = EApplyDefaults.All,
	normalizeSchema = true
): any => {
	const defaultFormStateBehavior = buildDefaultFormStateBehavior(applyDefaults);
	const cleanedSchema = normalizeSchema ? cleanUnsupportedSchemaKeys(schema) : schema;
	return getDefaultFormState<T, S, SchemaFormContext>(validator, cleanedSchema, formDataProp, cleanedSchema, undefined, defaultFormStateBehavior);
};

export const getDefaultValidator = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>() => {
	// Custom validator
	const ajvOptionsOverrides: CustomValidatorOptionsType['ajvOptionsOverrides'] = {
		$data: true //Mandatory for use $data reference (https://ajv.js.org/guide/combining-schemas.html#data-reference)
	};
	const ajvFormatOptions: CustomValidatorOptionsType['ajvFormatOptions'] = {
		keywords: true //Mandatory for use keywords to compare values like formatMinimum,... (https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum)
	};

	return customizeValidator<T, S, F>({ ajvOptionsOverrides, ajvFormatOptions });
};

export const buildDefaultFormStateBehavior = (applyDefaults: EApplyDefaults): Experimental_DefaultFormStateBehavior => {
	const emptyObjectFields = APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT[applyDefaults];
	const populate = APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY[applyDefaults];
	const constAsDefaults = APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_CONST_AS_DEFAULT[applyDefaults];
	const allOf = APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ALL_OFF[applyDefaults];

	return {
		arrayMinItems: {
			populate
		},
		emptyObjectFields,
		allOf,
		mergeDefaultsIntoFormData: 'useFormDataIfPresent',
		constAsDefaults
	};
};
