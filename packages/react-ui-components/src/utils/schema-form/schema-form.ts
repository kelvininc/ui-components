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
 * loses the labels. `allOf`, `then` and `else` are deliberately absent — RJSF merges them into the
 * parent, so their contents are addressed by plain property name. `if` is not: it is only ever a
 * condition, never rendered, so its titles would overwrite those of the field that is.
 */
/**
 * Keywords whose values are instance data rather than schemas. Walking into them rewrote a `default`
 * that happened to carry a `oneOf` key into an `enum`, and let the titles of that data overwrite the
 * `ui:enumNames` generated for the field itself. Every other object-valued keyword in a schema is a
 * schema container, so these are named rather than allow-listing the containers - an allow-list would
 * also have to re-implement traversal for the map-valued ones (`definitions`, `dependencies`, ...),
 * whose keys are arbitrary names and would otherwise stop being walked at all.
 */
const DATA_KEYWORDS = ['default', 'const', 'enum', 'examples'];

const UNADDRESSABLE_CONTAINERS = [
	'definitions',
	'$defs',
	'dependencies',
	'patternProperties',
	'additionalProperties',
	'contains',
	'propertyNames',
	'additionalItems',
	'anyOf',
	'if',
	'not'
];

const isOptionBranchList = (schema: JSONSchema7Definition[]): schema is OptionBranch[] => {
	if (!schema || typeof schema !== 'object' || schema.length === 0) {
		return false;
	}

	return schema.every(item => item && typeof item === 'object' && 'title' in item && 'const' in item && Object.keys(item).every(key => RELOCATABLE_OPTION_KEYS.includes(key)));
};

/** Plain assignment cannot create an own `__proto__` key; this can. */
const defineOwnProperty = (target: Record<string, unknown>, key: string, value: unknown): void => {
	Object.defineProperty(target, key, { value, writable: true, enumerable: true, configurable: true });
};

/** A boolean field renders two options. A longer list is not one, whatever its `const` values say. */
const BOOLEAN_BRANCH_LIMIT = 2;

/**
 * A boolean option list keeps its `oneOf` rather than collapsing. `BooleanField` reads its labels
 * straight off the branches (see `Fields/BooleanField/utils.ts`) and never looks at the generated
 * `ui:enumNames`, so collapsing one would silently swap custom titles for the default True/False. Its
 * metadata is still relocated, because the widgets read disabled state only from `ui:enumDisabled`.
 *
 * The length check is what makes the exception safe. Two branches never overflow AJV, but a generated
 * schema repeating boolean consts would, and it has no claim on an exception meant for a field that
 * renders two options - without the check such a list skips collapsing and reporting alike.
 */
const isBooleanOptionList = (branches: OptionBranch[]): boolean => branches.length <= BOOLEAN_BRANCH_LIMIT && branches.every(branch => typeof branch.const === 'boolean');

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

/** The only values that prove a development environment. An unset `NODE_ENV` proves nothing. */
const DEVELOPMENT_ENVIRONMENTS = ['development', 'test'];

/**
 * Development has to be proven, not assumed, and only an explicit `NODE_ENV` proves it. `process` is
 * not declared in a browser, and this package ships a client bundle that Rollup runs no `process.env`
 * replacement over, so the global is probed rather than read - `process &&` would not do, since
 * referencing an undeclared identifier throws before `&&` can short-circuit. Testing `!== 'production'`
 * would not do either: `NODE_ENV` is unset in plenty of SSR and serverless deployments, and a library
 * has no business writing to those consoles.
 */
const isDevelopment = (): boolean => typeof process !== 'undefined' && DEVELOPMENT_ENVIRONMENTS.includes(process.env?.NODE_ENV ?? '');

/**
 * An option list long enough to hurt that we could not collapse is worth saying out loud — left to
 * itself it surfaces as `RangeError: Maximum call stack size exceeded` from inside AJV's
 * `new Function`, which RJSF then swallows into a validation error that points at no field.
 * Development only: a library has no business writing to a customer's console, and this runs on paths
 * that repeat many times per interaction.
 */
const reportUncollapsedOptionList = (branches: JSONSchema7Definition[], path: string[], addressable: boolean): void => {
	if (branches.length < LARGE_ONE_OF_THRESHOLD || !isDevelopment()) {
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
 * The protection reaches only option lists that sit at a static uiSchema path. A list inside a union
 * branch, or behind a `$ref` into `definitions`, is left as a `oneOf` and can still reach AJV: the same
 * definition may be referenced from several properties, and two union branches may name the same
 * property, so there is no single path its titles could be written to. Collapsing those needs
 * reference- and branch-aware traversal, which this does not attempt.
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

	/**
	 * Walks the path building plain objects. The segments are schema property names, and a schema may
	 * legitimately name one `0` or `__proto__`, which rules out both obvious spellings: `lodash.set`
	 * reads `0` as an array index and builds an array, while plain assignment to `__proto__` sets the
	 * prototype instead of a key - and reading it back hands you `Object.prototype` to write onto.
	 * Hence an own-property test on the way down and a defined own property on the way in.
	 */
	const setUiSchema = (path: string[], key: string, value: unknown): void => {
		let target: Record<string, unknown> = uiSchema;

		for (const segment of path) {
			const existing = Object.prototype.hasOwnProperty.call(target, segment) ? target[segment] : undefined;

			if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
				defineOwnProperty(target, segment, {});
			}

			target = target[segment] as Record<string, unknown>;
		}

		defineOwnProperty(target, key, value);
	};

	const normalize = (subSchema: unknown, path: string[], addressable: boolean): unknown => {
		if (!subSchema || typeof subSchema !== 'object') {
			return subSchema;
		}

		if (Array.isArray(subSchema)) {
			return subSchema.map(item => normalize(item, path, addressable));
		}

		const schemaObj = subSchema as Record<string, unknown>;

		// What an option list becomes is settled here, but nothing returns here: whatever happens to a
		// `oneOf`, its siblings still have to be walked or a nested option list hides behind them.
		let normalizedOneOf: Record<string, unknown> | undefined;

		// Collapse an option list, but only where its titles have somewhere to go
		if (Array.isArray(schemaObj.oneOf)) {
			const branches = schemaObj.oneOf as JSONSchema7Definition[];

			if (addressable && isOptionBranchList(branches)) {
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

				normalizedOneOf = isBooleanOptionList(branches)
					? { oneOf: branches.map(branch => normalize(branch, path, false)) }
					: { enum: branches.map(branch => branch.const) };
			} else {
				reportUncollapsedOptionList(branches, path, addressable);

				// A `oneOf` we did not collapse is a union, and RJSF addresses its members separately
				normalizedOneOf = { oneOf: branches.map(branch => normalize(branch, path, false)) };
			}
		}

		// Every key is walked, so nothing hides behind a sibling. Only the path and whether the
		// contents stay addressable differ per container.
		const result: Record<string, unknown> = {};
		for (const key of Object.keys(schemaObj)) {
			// Settled above: collapsing drops the key, keeping it as a union re-adds it below
			if (key === 'oneOf' && normalizedOneOf !== undefined) {
				continue;
			}

			const value = schemaObj[key];

			// Data, not a schema - copy it through untouched
			if (DATA_KEYWORDS.includes(key)) {
				defineOwnProperty(result, key, value);
				continue;
			}

			if (key === 'properties' && value && typeof value === 'object') {
				const normalizedProperties: Record<string, unknown> = {};
				for (const propKey of Object.keys(value as Record<string, unknown>)) {
					defineOwnProperty(normalizedProperties, propKey, normalize((value as Record<string, unknown>)[propKey], [...path, propKey], addressable));
				}
				defineOwnProperty(result, key, normalizedProperties);
				continue;
			}

			// A single `items` schema is addressed by the array's own uiSchema entry; a tuple is not
			if (key === 'items') {
				defineOwnProperty(result, key, Array.isArray(value) ? normalize(value, path, false) : normalize(value, path, addressable));
				continue;
			}

			// `key` is a schema keyword here, but the same walk runs over maps whose keys are arbitrary
			// names - `definitions`, `dependencies`, `patternProperties` - where one may be `__proto__`
			defineOwnProperty(result, key, normalize(value, path, addressable && !UNADDRESSABLE_CONTAINERS.includes(key)));
		}

		return { ...result, ...normalizedOneOf };
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
