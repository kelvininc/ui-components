import { Experimental_DefaultFormStateBehavior, FormContextType, RJSFSchema, StrictRJSFSchema, ValidatorType, getDefaultFormState } from '@rjsf/utils';
import { EApplyDefaults, SchemaFormContext } from './types';
import { CustomValidatorOptionsType, customizeValidator } from '@rjsf/validator-ajv8';

type ExperimentalEmptyObjectFields = 'populateAllDefaults' | 'populateRequiredDefaults' | 'skipDefaults';
type ExperimentalArrayMinItems = 'all' | 'requiredOnly' | 'never';

const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT: Record<EApplyDefaults, ExperimentalEmptyObjectFields> = {
	[EApplyDefaults.All]: 'populateAllDefaults',
	[EApplyDefaults.RequiredOnly]: 'populateRequiredDefaults',
	[EApplyDefaults.Never]: 'skipDefaults'
};

const APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY: Record<EApplyDefaults, ExperimentalArrayMinItems> = {
	[EApplyDefaults.All]: 'all',
	[EApplyDefaults.RequiredOnly]: 'requiredOnly',
	[EApplyDefaults.Never]: 'never'
};

export const buildDefaultFormStateBehavior = (applyDefaults: EApplyDefaults): Experimental_DefaultFormStateBehavior => {
	const emptyObjectFields = APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT[applyDefaults];
	const populate = APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY[applyDefaults];

	return {
		arrayMinItems: {
			populate
		},
		emptyObjectFields
	};
};

export default function getDefaultValidator<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>() {
	// Custom validator
	const ajvOptionsOverrides: CustomValidatorOptionsType['ajvOptionsOverrides'] = {
		$data: true //Mandatory for use $data reference (https://ajv.js.org/guide/combining-schemas.html#data-reference)
	};
	const ajvFormatOptions: CustomValidatorOptionsType['ajvFormatOptions'] = {
		keywords: true //Mandatory for use keywords to compare values like formatMinimum,... (https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum)
	};

	return customizeValidator<T, S, F>({ ajvOptionsOverrides, ajvFormatOptions });
}

/**
 * There's an issue in the "react-jsonschema-form" package where the form will always trigger
 * an `onChange` event on mount when the schema contains array type properties with not default values.
 *
 * To overcome this issue we need set the form initial value to the default values.
 *
 * For more information: https://github.com/rjsf-team/react-jsonschema-form/issues/3697
 */
export const getInitialFormData = <T, S extends StrictRJSFSchema = RJSFSchema>(
	validator: ValidatorType<T, S, SchemaFormContext>,
	schema: S,
	formDataProp: T | undefined,
	defaultFormStateBehavior: Experimental_DefaultFormStateBehavior
): any => {
	return getDefaultFormState<T, S, SchemaFormContext>(validator, schema, formDataProp, schema, undefined, defaultFormStateBehavior);
};
