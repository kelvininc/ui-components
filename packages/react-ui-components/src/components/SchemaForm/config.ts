import { customizeValidator, CustomValidatorOptionsType } from '@rjsf/validator-ajv8';

export const SCROLL_OFFSET = 12;
export const INPUT_INLINE_WIDTH = '250px';

// Custom validator
const ajvOptionsOverrides: CustomValidatorOptionsType['ajvOptionsOverrides'] = {
	$data: true //Mandatory for use $data reference (https://ajv.js.org/guide/combining-schemas.html#data-reference)
};
const ajvFormatOptions: CustomValidatorOptionsType['ajvFormatOptions'] = {
	keywords: true //Mandatory for use keywords to compare values like formatMinimum,... (https://ajv.js.org/packages/ajv-formats.html#keywords-to-compare-values-formatmaximum-formatminimum-and-formatexclusivemaximum-formatexclusiveminimum)
};
export const DEFAULT_VALIDATOR = customizeValidator({ ajvOptionsOverrides, ajvFormatOptions });
