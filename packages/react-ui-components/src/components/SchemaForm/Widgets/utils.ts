import { FormContextType, getUiOptions, Registry, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';
import { isEqual } from 'lodash';

const isPrimitive = (value: unknown): boolean => ['string', 'number', 'boolean'].includes(typeof value);

/** Match JSON values first; primitive string fallback preserves existing numeric-string inputs. */
export const getSelectedOptionIndex = (values: readonly unknown[], value: unknown): number => {
	if (value === undefined) return -1;
	const exact = values.findIndex(option => isEqual(option, value));
	return exact !== -1 || !isPrimitive(value) ? exact : values.findIndex(option => isPrimitive(option) && String(option) === String(value));
};

/** Resolve field/global UI options before the form context, preserving explicit false. */
export const resolveAllowClearInputs = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiSchema: UiSchema<T, S, F> | undefined,
	registry: Registry<T, S, F>
): boolean | undefined => (getUiOptions(uiSchema, registry.globalUiOptions).allowClearInputs as boolean | undefined) ?? registry.formContext?.allowClearInputs;
