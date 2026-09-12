import { Experimental_DefaultFormStateBehavior, FormContextType, getDefaultFormState, RJSFSchema, StrictRJSFSchema, ValidatorType } from '@rjsf/utils';
import { SchemaFormContext } from '../../components';
import { EApplyDefaults } from '../../components/SchemaForm/types';
import {
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ALL_OFF,
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY,
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_CONST_AS_DEFAULT,
	APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT,
	DEFAULT_VALIDATOR
} from './config';
import { JSONSchema7, JSONSchema7Definition, JSONSchema7Type } from 'json-schema';
import { UiSchema } from '@rjsf/utils';
import { set } from 'lodash';

export type NormalizeEnumsResult<S extends StrictRJSFSchema = RJSFSchema> = {
	schema: S;
	uiSchema: UiSchema;
};

// Intersecting with JSONSchema7 keeps this assignable to JSONSchema7Definition, which is what
// lets `isOptionBranchList` narrow the array it guards.
type OptionBranch = JSONSchema7 & { const: JSONSchema7Type; title: string; disabled?: boolean; description?: string };

/**
 * The keys an option branch may carry and still be collapsed into an `enum`. Every one of them has a
 * uiSchema destination (see `normalizeEnums`), which is the whole test for membership: collapsing a
 * branch that carries anything else would silently drop information the widgets read back off
 * `enumOptions[].schema`, which RJSF only populates for `oneOf`.
 */
const RELOCATABLE_OPTION_KEYS = ['const', 'title', 'disabled', 'description'];

/**
 * Where `oneOf` stops being merely verbose and becomes a problem of its own. AJV compiles `oneOf` as
 * one nested `else` block per branch, so the generated validator nests as deeply as the option list;
 * past a few thousand branches `new Function` overflows V8's parser stack. RJSF also resolves a
 * `oneOf` by calling `validator.isValid()` once per branch, which is expensive long before that.
 */
const LARGE_ONE_OF_THRESHOLD = 100;

/**
 * Containers whose contents RJSF does not address by the parent's uiSchema path. A `oneOf` inside one
 * of these is left alone: collapsing it would move its titles to a uiSchema key nothing reads, which
 * loses the labels. `allOf` is deliberately absent — RJSF merges it into the parent, so its contents
 * are addressed by plain property name.
 */
const UNADDRESSABLE_CONTAINERS = ['definitions', '$defs', 'dependencies', 'patternProperties', 'anyOf', 'not'];

const isOptionBranchList = (schema: JSONSchema7Definition[]): schema is OptionBranch[] => {
	if (!schema || typeof schema !== 'object' || schema.length === 0) {
		return false;
	}

	return schema.every(item => item && typeof item === 'object' && 'title' in item && 'const' in item && Object.keys(item).every(key => RELOCATABLE_OPTION_KEYS.includes(key)));
};

/** Why a `oneOf` could not be collapsed, phrased for whoever has to change the schema. */
const getBlockingOptionKeys = (branches: JSONSchema7Definition[]): string[] => {
	const blocking = new Set<string>();

	branches.forEach(item => {
		if (!item || typeof item !== 'object') {
			blocking.add(`(branch is ${typeof item})`);
			return;
		}

		if (!('const' in item)) {
			blocking.add('(no const)');
		}
		if (!('title' in item)) {
			blocking.add('(no title)');
		}
		Object.keys(item)
			.filter(key => !RELOCATABLE_OPTION_KEYS.includes(key))
			.forEach(key => blocking.add(key));
	});

	return Array.from(blocking);
};

/**
 * An option list long enough to hurt that we could not collapse is worth saying out loud — left to
 * itself it surfaces as `RangeError: Maximum call stack size exceeded` from inside AJV's
 * `new Function`, which RJSF then swallows into a validation error that points at no field.
 * Development only: a library has no business writing to a customer's console, and this runs on paths
 * that repeat many times per interaction.
 */
const reportUncollapsedOptionList = (branches: JSONSchema7Definition[], path: string[], addressable: boolean): void => {
	if (process.env.NODE_ENV === 'production' || branches.length < LARGE_ONE_OF_THRESHOLD) {
		return;
	}

	const where = path.length > 0 ? path.join('.') : '<root>';
	const why = addressable ? `its branches carry: ${getBlockingOptionKeys(branches).join(', ')}` : 'it sits in a container RJSF does not address by property path';

	// eslint-disable-next-line no-console
	console.error(
		`[schema-form] The "oneOf" at "${where}" has ${branches.length} branches and could not be collapsed into an "enum" because ${why}. Long "oneOf" lists are slow to validate and can exceed the call stack when AJV compiles them — prefer "enum" with "ui:enumNames".`
	);
};

/**
 * Collapses simple `oneOf` constructs into an equivalent `{ enum: [...] }`, moving everything the
 * branches carried into the uiSchema: titles to `ui:enumNames`, disabled options to `ui:enumDisabled`
 * and per-option descriptions to `ui:enumDescriptions`.
 *
 * This is not cosmetic. AJV compiles `oneOf` as one nested `else` per branch, so an option list built
 * from instance data — every asset, every data stream — produces a validator nested as deeply as the
 * list, and `new Function` overflows the parser stack. `enum` compiles to a single loop instead.
 *
 * @typeParam S - Schema type extending `StrictRJSFSchema`.
 * @param schema - The schema to normalize.
 * @returns Object with normalized schema and uiSchema containing the derived `ui:enum*` keys.
 *
 * @example
 * const schema = { properties: { status: { type: 'string', oneOf: [
 *   { const: 'on',  title: 'On' },
 *   { const: 'off', title: 'Off', disabled: true }
 * ]}}};
 * normalizeEnums(schema);
 * // => { schema: { properties: { status: { type: 'string', enum: ['on', 'off'] }}},
 * //      uiSchema: { status: { 'ui:enumNames': ['On', 'Off'], 'ui:enumDisabled': ['off'] }}}
 */
export const normalizeEnums = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): NormalizeEnumsResult<S> => {
	const uiSchema: UiSchema = {};

	const setUiSchema = (path: string[], key: string, value: unknown): void => {
		if (path.length > 0) {
			set(uiSchema, [...path, key], value);
		} else {
			uiSchema[key] = value;
		}
	};

	const normalize = (subSchema: unknown, path: string[], addressable: boolean): unknown => {
		if (!subSchema || typeof subSchema !== 'object') {
			return subSchema;
		}

		if (Array.isArray(subSchema)) {
			return subSchema.map(item => normalize(item, path, addressable));
		}

		const schemaObj = subSchema as Record<string, unknown>;

		// Collapse an option list, but only where its titles have somewhere to go
		if (Array.isArray(schemaObj.oneOf)) {
			const branches = schemaObj.oneOf as JSONSchema7Definition[];

			if (addressable && isOptionBranchList(branches)) {
				const { oneOf, ...rest } = schemaObj;
				const disabled = branches.filter(branch => branch.disabled).map(branch => branch.const);
				const descriptions = branches.map(branch => branch.description ?? '');

				setUiSchema(
					path,
					'ui:enumNames',
					branches.map(branch => branch.title)
				);
				if (disabled.length > 0) {
					setUiSchema(path, 'ui:enumDisabled', disabled);
				}
				if (descriptions.some(description => description !== '')) {
					setUiSchema(path, 'ui:enumDescriptions', descriptions);
				}

				return {
					...rest,
					enum: branches.map(branch => branch.const)
				};
			}

			reportUncollapsedOptionList(branches, path, addressable);

			// A `oneOf` we did not collapse is a union, and RJSF addresses its members separately
			return { ...schemaObj, oneOf: branches.map(branch => normalize(branch, path, false)) };
		}

		// Every key is walked, so nothing hides behind a sibling. Only the path and whether the
		// contents stay addressable differ per container.
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(schemaObj)) {
			const value = schemaObj[key];

			if (key === 'properties' && value && typeof value === 'object') {
				const normalizedProperties: Record<string, unknown> = {};
				for (const propKey of Object.keys(value as Record<string, unknown>)) {
					normalizedProperties[propKey] = normalize((value as Record<string, unknown>)[propKey], [...path, propKey], addressable);
				}
				result[key] = normalizedProperties;
				continue;
			}

			// A single `items` schema is addressed by the array's own uiSchema entry; a tuple is not
			if (key === 'items') {
				result[key] = Array.isArray(value) ? normalize(value, path, false) : normalize(value, path, addressable);
				continue;
			}

			result[key] = normalize(value, path, addressable && !UNADDRESSABLE_CONTAINERS.includes(key));
		}

		return result;
	};

	const normalizedSchema = normalize(schema, [], true) as S;

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

/**
 * @param shouldNormalizeSchema - Whether to normalize the schema first. Pass `false` only when the
 * caller has already run {@link normalizeSchema} — the previous name for this parameter shadowed that
 * function, and it did nothing but strip `$schema`, so any caller leaving it at its default was
 * handing a raw `oneOf` straight to AJV.
 */
export const getInitialFormData = <T, S extends StrictRJSFSchema = RJSFSchema>(
	schema: S,
	formDataProp: T | undefined,
	validator: ValidatorType<T, S, SchemaFormContext> = getDefaultValidator<T, S>(),
	applyDefaults: EApplyDefaults = EApplyDefaults.All,
	shouldNormalizeSchema = true
): any => {
	const defaultFormStateBehavior = buildDefaultFormStateBehavior(applyDefaults);
	const preparedSchema = shouldNormalizeSchema ? normalizeSchema(schema).schema : schema;
	return getDefaultFormState<T, S, SchemaFormContext>(validator, preparedSchema, formDataProp, preparedSchema, undefined, defaultFormStateBehavior);
};

export const getDefaultValidator = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): ValidatorType<T, S, F> =>
	DEFAULT_VALIDATOR as unknown as ValidatorType<T, S, F>;

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
