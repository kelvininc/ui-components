import { FormContextType, getUiOptions, RJSFSchema, StrictRJSFSchema, UiSchema } from '@rjsf/utils';
import { has, isEqualWith, isPlainObject, mergeWith } from 'lodash';

const isSettings = (value: unknown) => isPlainObject(value) && !has(value, '$$typeof');

/** Merge settings into fresh objects; arrays and React component types keep their identity. */
export const keepUnlessSettings = (inherited: unknown, provided: unknown): unknown => {
	if (!isSettings(provided)) return provided;
	// A prior source may have supplied a component or other value by reference.
	return isSettings(inherited) ? undefined : mergeWith({}, provided, keepUnlessSettings);
};

const normalizeUiSettings = (value: unknown): unknown => {
	if (!isSettings(value)) return value;
	const settings = Object.fromEntries(
		Object.entries(value as Record<string, unknown>).map(([key, setting]) => [key, key.startsWith('ui:') ? setting : normalizeUiSettings(setting)])
	);
	const options = getUiOptions(settings);
	if (!Object.keys(options).length) return settings;
	// Resolve each source before merging so either UI form overrides the inherited value.
	return { ...settings, ...Object.fromEntries(Object.entries(options).map(([key, option]) => [`ui:${key}`, option])), 'ui:options': options };
};

const applyEmptyValueOverrides = (merged: unknown, provided: unknown): void => {
	if (!isSettings(merged) || !isSettings(provided)) return;
	const target = merged as UiSchema;
	const source = provided as UiSchema;
	const options = getUiOptions(source);
	// emptyValue is instance data; even undefined replaces the entire inherited value.
	if (has(options, 'emptyValue')) {
		target['ui:emptyValue'] = options.emptyValue;
		target['ui:options'] = { ...target['ui:options'], emptyValue: options.emptyValue };
	}
	Object.entries(source).forEach(([key, setting]) => {
		if (!key.startsWith('ui:') && Object.prototype.hasOwnProperty.call(target, key)) applyEmptyValueOverrides(target[key], setting);
	});
};

export const mergeUiSchemas = <T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	...sources: (UiSchema<T, S, F> | undefined)[]
): UiSchema<T, S, F> =>
	sources.reduce<UiSchema<T, S, F>>((merged, source) => {
		const normalized = normalizeUiSettings(source);
		const result = mergeWith({}, merged, normalized, keepUnlessSettings);
		applyEmptyValueOverrides(result, normalized);
		return result;
	}, {});

/** Component objects with identical render functions are still distinct React types. */
export const areSettingsEqual = (previous: unknown, next: unknown): boolean =>
	isEqualWith(previous, next, (left, right) => (has(left, '$$typeof') || has(right, '$$typeof') ? left === right : undefined));
