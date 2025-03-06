import { Experimental_DefaultFormStateBehavior, FormContextType, getDefaultFormState, RJSFSchema, StrictRJSFSchema, ValidatorType } from '@rjsf/utils';
import { SchemaFormContext } from '../../components';
import { customizeValidator, CustomValidatorOptionsType } from '@rjsf/validator-ajv8';
import { EApplyDefaults } from '../../components/SchemaForm/types';
import { APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_ARRAY, APPLY_DEFAULTS_TO_EXPERIMENTAL_DEFAULT_FORM_OBJECT } from './config';

export const getInitialFormData = <T, S extends StrictRJSFSchema = RJSFSchema>(
	schema: S,
	formDataProp: T | undefined,
	validator: ValidatorType<T, S, SchemaFormContext> = getDefaultValidator<T, S>(),
	applyDefaults: EApplyDefaults = EApplyDefaults.All
): any => {
	const defaultFormStateBehavior = buildDefaultFormStateBehavior(applyDefaults);
	return getDefaultFormState<T, S, SchemaFormContext>(validator, schema, formDataProp, schema, undefined, defaultFormStateBehavior);
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

	return {
		arrayMinItems: {
			populate
		},
		emptyObjectFields
	};
};
