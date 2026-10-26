import { JSONSchema7Type } from 'json-schema';
import { FieldTemplateProps, FormContextType, getSchemaType, getWidget, RJSFSchema, StrictRJSFSchema, UIOptionsType, Widget } from '@rjsf/utils';
import { get, isNil, merge } from 'lodash';
import { DEFAULT_VALUE_HELPER_PREFIX } from '../../config';
import { getChoiceWidget } from '../../rjsf/choiceWidget';
import { hasCustomField } from '../../rjsf/hasCustomField';
import RadioWidget from '../../Widgets/RadioWidget';
import RadioListWidget from '../../Widgets/RadioListWidget';
import SelectWidget from '../../Widgets/SelectWidget';

/** Classify the actual built-in widget; registered aliases and component references keep their extras. */
export const getChoicePresentation = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ schema, uiSchema, registry }: FieldTemplateProps<T, S, F>) => {
	const schemaType = getSchemaType(schema);
	const type = Array.isArray(schemaType) ? schemaType[0] : schemaType || '';
	if (hasCustomField(uiSchema, registry, schema) || ['array', 'object', 'null'].includes(type) || (type !== 'boolean' && !registry.schemaUtils.isSelect(schema))) {
		return { choice: false, radio: false };
	}
	const Widget = getChoiceWidget({ schema, uiSchema, registry });
	const builtin = (component: Widget<T, S, F>) => (type === 'boolean' ? component : getWidget(schema, component, registry.widgets));
	const radio = Widget === builtin(RadioWidget) || Widget === builtin(RadioListWidget);
	return { choice: radio || Widget === builtin(SelectWidget), radio };
};

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
