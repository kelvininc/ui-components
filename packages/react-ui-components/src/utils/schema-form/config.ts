import { customizeValidator, CustomValidatorOptionsType } from '@rjsf/validator-ajv8';
import { EApplyDefaults } from '../../components/SchemaForm/types';
import { ExperimentalAllOf, ExperimentalArrayMinItems, ExperimentalConstAsDefaults, ExperimentalEmptyObjectFields } from './types';

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT: Record<EApplyDefaults, ExperimentalEmptyObjectFields> = {
	[EApplyDefaults.All]: 'populateAllDefaults',
	[EApplyDefaults.RequiredOnly]: 'populateRequiredDefaults',
	[EApplyDefaults.Never]: 'skipDefaults'
};

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY: Record<EApplyDefaults, ExperimentalArrayMinItems> = {
	[EApplyDefaults.All]: 'all',
	[EApplyDefaults.RequiredOnly]: 'requiredOnly',
	[EApplyDefaults.Never]: 'never'
};

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ALL_OFF: Record<EApplyDefaults, ExperimentalAllOf> = {
	[EApplyDefaults.All]: 'populateDefaults',
	[EApplyDefaults.RequiredOnly]: 'populateDefaults',
	[EApplyDefaults.Never]: 'skipDefaults'
};

export const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_CONST_AS_DEFAULT: Record<EApplyDefaults, ExperimentalConstAsDefaults> = {
	[EApplyDefaults.All]: 'skipOneOf',
	[EApplyDefaults.RequiredOnly]: 'skipOneOf',
	[EApplyDefaults.Never]: 'never'
};

// Custom validator options.
export const AJV_OPTIONS_OVERRIDES: CustomValidatorOptionsType['ajvOptionsOverrides'] = {
	$data: true //Mandatory for use $data reference (https://ajv.js.org/guide/combining-schemas.html#data-reference)
};

export const AJV_FORMAT_OPTIONS: CustomValidatorOptionsType['ajvFormatOptions'] = {
	keywords: true //Mandatory for use keywords to compare values like formatMinimum,... (https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum)
};

// A single shared validator instance. @rjsf/validator-ajv8 caches compiled schemas
// per instance (keyed by hashForSchema); returning a fresh instance on every call
// discarded that cache, so large/dynamic schemas were recompiled on every
// getDefaultFormState/validate call (e.g. ~8-10x per table column reorder via the
// view dirty-check). Sharing one instance compiles each unique schema once,
// process-wide. Generics are erased at runtime, so one instance serves all callers.
export const DEFAULT_VALIDATOR = customizeValidator({ ajvOptionsOverrides: AJV_OPTIONS_OVERRIDES, ajvFormatOptions: AJV_FORMAT_OPTIONS });
