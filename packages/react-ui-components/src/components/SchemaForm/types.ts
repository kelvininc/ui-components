import { CustomCssClass, EComponentSize } from '@kelvininc/ui-components';
import Form, { FormProps } from '@rjsf/core';
import { FormContextType, RJSFSchema, StrictRJSFSchema, ValidatorType } from '@rjsf/utils';

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

export enum EApplyDefaults {
	All = 'all',
	RequiredOnly = 'requiredOnly',
	Never = 'never'
}

export enum EDescriptionPosition {
	Top = 'top',
	Bottom = 'bottom',
	None = 'none'
}

export interface SchemaFormContext {
	showDefaultValueHelper?: boolean;
	defaultValueHelperPrefix?: string;
	componentSize?: EComponentSize;
	dropdownConfig?: {
		zIndex?: number;
		minHeight?: string;
		maxHeight?: string;
		minWidth?: string;
		maxWidth?: string;
	};
	inputConfig?: {
		width?: string;
		minWidth?: string;
		maxWidth?: string;
	};
	booleanLabels?: Record<string, string>;
	descriptionPosition?: EDescriptionPosition;
	allowClearInputs?: boolean;
}

export interface SchemaFormProps<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> extends Partial<FormProps<T, S, F>> {
	schema: S; //Required
	validator?: ValidatorType<T, S, F>; //Optional
	customClass?: CustomCssClass;
	submittedData?: T;
	allowDiscardChanges?: boolean;
	allowResetToDefaults?: boolean;
	formReference?: React.RefObject<Form<T, S, F>>;
	/** Optional enumerated flag controlling how empty object fields and array fields where `minItems` is set are populated.
	 * Default: `All`;
	 * - `All`: Legacy behavior - set default when there is a primitive value, an non-empty object field,
	 *        or the field itself is required  |
	 * - `RequiredOnly`: Only sets default when a value is an object and its parent field is required, or it
	 *        is a primitive value and it is required |
	 * - `Never`: Does not set defaults                                                                                                      |
	 */
	applyDefaults?: EApplyDefaults;
	/**
	 * If set to `true`, the form will always display error messages below the corresponding fields.
	 * Default: `false`, meaning that errors will be displayed only after form submission or when they are touched.
	 */
	displayErrors?: boolean;
}
