import { JSONSchema7Type } from 'json-schema';
import { FormContextType, RJSFSchema, StrictRJSFSchema, UIOptionsType } from '@rjsf/utils';
import { get, isNil, merge } from 'lodash';
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

/**
 * Layers a field's own `ui:*` options over the form-wide context to produce the
 * options a field resolves its helper text from.
 *
 * The `{}` target is load-bearing. This was `merge(formContext, uiOptions)`, which
 * wrote straight into `formContext` — the single object RJSF shares with every
 * field and widget in the form. One field carrying `ui:dropdownConfig` therefore
 * leaked that config into every other widget, and whichever field happened to
 * render first decided what the rest of the form saw.
 */
export const buildHelperOptions = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	formContext: F,
	uiOptions: UIOptionsType<T, S, F>
): UIOptionsType<T, S, F> => merge({}, formContext, uiOptions);
