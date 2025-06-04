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

export const cleanUnsupportedSchemaKeys = <S extends StrictRJSFSchema = RJSFSchema>(schema: S): S => {
	// Remove unsupported keys from the schema
	const { $schema, ...cleanedSchema } = schema;
	return cleanedSchema as S;
};

export const getInitialFormData = <T, S extends StrictRJSFSchema = RJSFSchema>(
	schema: S,
	formDataProp: T | undefined,
	validator: ValidatorType<T, S, SchemaFormContext> = getDefaultValidator<T, S>(),
	applyDefaults: EApplyDefaults = EApplyDefaults.All
): T | T[] => {
	const defaultFormStateBehavior = buildDefaultFormStateBehavior(applyDefaults);
	const cleanedSchema = cleanUnsupportedSchemaKeys(schema);
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
