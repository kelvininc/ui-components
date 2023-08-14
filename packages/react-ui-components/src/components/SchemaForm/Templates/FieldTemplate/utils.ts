import { JSONSchema7Type } from 'json-schema';
import { FormContextType, RJSFSchema, StrictRJSFSchema, UIOptionsType } from '@rjsf/utils';
import { get, isNil } from 'lodash';
import { DEFAULT_VALUE_HELPER_PREFIX } from '../../config';

export default function buildDefaultHelperText<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiOptions: UIOptionsType<T, S, F>,
	defaultValue?: JSONSchema7Type
): string | undefined {
	const showDefaultOnHelper = get(uiOptions, ['showDefaultValueHelper'], false);

	if (showDefaultOnHelper && !isNil(defaultValue)) {
		const defaultHelperPrefix = get(uiOptions, ['defaultValueHelperPrefix'], DEFAULT_VALUE_HELPER_PREFIX);
		return `${defaultHelperPrefix}${defaultValue}`;
	}

	return undefined;
}
