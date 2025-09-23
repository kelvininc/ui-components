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

const isOneOfWithTitleAndConst = (schema: JSONSchema7Definition[]): schema is { title: string; const: string }[] => {
	if (!schema || typeof schema !== 'object') {
		return false;
	}

	// Check if the schema is a oneOf with title and const
	if (schema.every(item => item && Object.keys(item).every(key => ['title', 'const'].includes(key)))) {
		return true;
	}

	return false;
};

/**
 * Collapses simple `oneOf` constructs (whose members consist ONLY of `title` + `const`) into
 * an equivalent `{ enum: [...], 'x-titles': [...] }` representation.
 *
 * Motivation / Performance:
 * Large schemas containing many shallow `oneOf` blocks of `{ const, title }` objects trigger
 * deep recursion and may produce `Maximum call stack size exceeded` errors in AJV/RJSF
 * (see issue: https://github.com/rjsf-team/react-jsonschema-form/issues/3829). Replacing them
 * with `enum` + parallel title array keeps the semantic meaning while minimizing nesting.
 *
 *
 * @typeParam S - Schema type extending `StrictRJSFSchema`.
 * @param schema - The schema (or subschema) to normalize.
 * @returns The normalized schema (same reference unless a collapsing replacement occurred at the root).
 *
 * @example
 * const schema = { type: 'string', oneOf: [
 *   { const: 'on',  title: 'On' },
 *   { const: 'off', title: 'Off' }
 * ]};
 * normalizeEnums(schema);
 * // => { type: 'string', enum: ['on', 'off'], 'x-titles': ['On', 'Off'] }
 */
export const normalizeEnums = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): S => {
	if (!schema || typeof schema !== 'object') {
		return schema;
	}

	// Check if the schema is a oneOf with title and const
	if (Array.isArray(schema.oneOf) && isOneOfWithTitleAndConst(schema.oneOf)) {
		const { oneOf, ...rest } = schema;

		return {
			...rest,
			'enum': schema.oneOf.map(item => item.const),
			'x-titles': schema.oneOf.map(item => item.title)
		} as unknown as S;
	}

	let normalizedSchema = structuredClone(schema);

	// If the schema is an object, recursively normalize its properties
	for (const key of Object.keys(normalizedSchema)) {
		const schemaKey = key as keyof S;

		normalizedSchema = {
			...normalizedSchema,
			[schemaKey]: normalizeEnums(normalizedSchema[schemaKey])
		};
	}

	return normalizedSchema;
};

/**
 * Normalizes a JSON schema by applying various transformations.
 * @param schema The schema to normalize.
 * @returns The normalized schema.
 */
export function normalizeSchema<S extends StrictRJSFSchema = RJSFSchema>(schema: S): S {
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
