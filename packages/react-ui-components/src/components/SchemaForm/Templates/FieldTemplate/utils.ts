import { JSONSchema7Type } from 'json-schema';
import {
	EnumOptionsType,
	FieldTemplateProps,
	FormContextType,
	getSchemaType,
	getUiOptions,
	getWidget,
	GlobalUISchemaOptions,
	optionsList,
	RJSFSchema,
	StrictRJSFSchema,
	UIOptionsType,
	UiSchema,
	Widget
} from '@rjsf/utils';
import { get, isEqual, isNil, isPlainObject, merge } from 'lodash';
import { DEFAULT_VALUE_HELPER_PREFIX } from '../../config';
import { DEFAULT_BOOLEAN_LABELS } from '../../Fields/BooleanField/config';
import { getEnumOptions } from '../../Fields/BooleanField/utils';
import { getChoiceWidget } from '../../rjsf/choiceWidget';
import { hasConstantOptions } from '../../rjsf/constantOptions';
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

/**
 * The placeholder SelectWidget shows, trimmed. RJSF's StringField passes the field's own `ui:placeholder` and drops it
 * from the options; BooleanField passes an empty one, so SelectWidget falls back to its options, which include the
 * global UI options.
 */
export const getSelectPlaceholder = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ schema, uiSchema, registry }: FieldTemplateProps<T, S, F>) => {
	const { placeholder } = getSchemaType(schema) === 'boolean' ? getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions) : getUiOptions<T, S, F>(uiSchema);
	return typeof placeholder === 'string' ? placeholder.trim() : '';
};

type UiOptionsSource<T, S extends StrictRJSFSchema, F extends FormContextType> = { uiSchema?: UiSchema<T, S, F>; globalUiOptions?: GlobalUISchemaOptions };

const findLabel = <S extends StrictRJSFSchema>(options: EnumOptionsType<S>[] | undefined, value: unknown) => options?.find(option => isEqual(option.value, value))?.label;

/** A raw value as text: arrays list their items, objects read as JSON. */
const formatRawValue = (value: unknown): string => {
	if (Array.isArray(value)) return value.map(formatRawValue).join(', ');
	if (isPlainObject(value)) return JSON.stringify(value);
	return String(value);
};

/**
 * The options the field itself renders, or undefined when it renders none. Booleans resolve through BooleanField's
 * own `getEnumOptions` with the same `booleanLabels` source; other schemas only list options when every branch is
 * constant, because RJSF's `optionsList` throws on a non-constant `anyOf`/`oneOf` branch.
 */
const getFieldOptions = <T, S extends StrictRJSFSchema, F extends FormContextType>(schema: S, { uiSchema, globalUiOptions }: UiOptionsSource<T, S, F>) => {
	if (getSchemaType(schema) === 'boolean') {
		if (Array.isArray(schema.oneOf) && !hasConstantOptions({ oneOf: schema.oneOf } as S)) return undefined;
		const { booleanLabels = DEFAULT_BOOLEAN_LABELS } = getUiOptions<T, S, F>(uiSchema, globalUiOptions);
		return getEnumOptions(schema, booleanLabels as Record<string, string>);
	}
	return hasConstantOptions(schema) ? optionsList<S, T, F>(schema, uiSchema) : undefined;
};

/**
 * The default as the field shows it: a choice's option label ("No", "Debug"), a multi-select's labels joined with
 * commas, or the raw value when no option matches.
 */
const formatDefaultValue = <T, S extends StrictRJSFSchema, F extends FormContextType>(defaultValue: JSONSchema7Type, schema: S | undefined, source: UiOptionsSource<T, S, F>) => {
	if (!schema) return formatRawValue(defaultValue);
	if (getSchemaType(schema) === 'array' && Array.isArray(defaultValue) && isPlainObject(schema.items)) {
		const items = schema.items as S;
		const options = hasConstantOptions(items) ? optionsList<S, T, F>(items, source.uiSchema) : undefined;
		return defaultValue.map(value => findLabel(options, value) ?? formatRawValue(value)).join(', ');
	}
	return findLabel(getFieldOptions(schema, source), defaultValue) ?? formatRawValue(defaultValue);
};

/**
 * @param uiOptions - The form context merged with the field's options; decides whether the helper shows and its prefix.
 * @param schema - The field's resolved schema, used to name choice defaults by their option label.
 * @param source - The field's `uiSchema` and the form's global UI options, read the way the field reads them.
 */
export default function buildDefaultHelperText<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	uiOptions: UIOptionsType<T, S, F>,
	defaultValue?: JSONSchema7Type,
	schema?: S,
	source: UiOptionsSource<T, S, F> = {}
): string | undefined {
	const showDefaultOnHelper = get(uiOptions, ['showDefaultValueHelper'], false);

	if (showDefaultOnHelper && !isNil(defaultValue)) {
		const defaultHelperPrefix = get(uiOptions, ['defaultValueHelperPrefix'], DEFAULT_VALUE_HELPER_PREFIX);
		return `${defaultHelperPrefix}${formatDefaultValue(defaultValue, schema, source)}`;
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
