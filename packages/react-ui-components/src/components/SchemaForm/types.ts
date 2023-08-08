import { CustomCssClass } from '@kelvininc/ui-components';
import Form, { FormProps } from '@rjsf/core';
import { RJSFSchema, StrictRJSFSchema, ValidatorType } from '@rjsf/utils';

// We need this extra because they are not standard keywords in the JSON Schema specification(JSONSchema7) but added by AJV-keywords and used by the AJV Validator.
// https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum
// https://github.com/json-schema-org/json-schema-spec/issues/116
// https://github.com/rjsf-team/react-jsonschema-form/issues/2663#issuecomment-1106698186
declare module 'json-schema' {
	export interface JSONSchema7 {
		formatMinimum?: string | { $data: string };
		formatExclusiveMinimum?: string | { $data: string };
		formatMaximum?: string | { $data: string };
		formatExclusiveMaximum?: string | { $data: string };
	}
}

export interface SchemaFormProps<T, S extends StrictRJSFSchema = RJSFSchema> extends Partial<FormProps<T, S>> {
	schema: S; //Required
	validator?: ValidatorType<T, S>; //Optional
	customClass?: CustomCssClass;
	submittedData?: T;
	allowDiscardChanges?: boolean;
	formReference?: React.RefObject<Form<T>>;
}
