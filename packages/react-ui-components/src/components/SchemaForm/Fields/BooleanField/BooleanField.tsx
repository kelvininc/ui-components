import { FieldProps, FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps, getUiOptions } from '@rjsf/utils';
import React, { useCallback } from 'react';
import { getEnumOptions, getWidget } from './utils';
import { DEFAULT_BOOLEAN_LABELS } from './config';

function BooleanField<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	name,
	uiSchema = {},
	fieldPathId,
	formData,
	registry,
	required,
	disabled,
	readonly,
	autofocus,
	onChange,
	onFocus,
	onBlur
}: FieldProps<T, S, F>) {
	const { title } = schema;
	const { widgets, globalUiOptions } = registry;
	let Widget = getWidget(uiSchema, widgets);

	const { title: uiTitle, label: displayLabel = true, inline: uiInline, booleanLabels = DEFAULT_BOOLEAN_LABELS, ...options } = getUiOptions<T, S, F>(uiSchema, globalUiOptions);
	let enumOptions = getEnumOptions(schema, booleanLabels as Record<string, string>);
	const label = uiTitle ?? title ?? name;
	const onWidgetChange = useCallback<WidgetProps<T, S, F>['onChange']>((value, errorSchema, id) => onChange(value, fieldPathId.path, errorSchema, id), [onChange, fieldPathId]);

	return (
		<Widget
			name={name}
			id={fieldPathId.$id}
			schema={schema}
			options={{ ...options, enumOptions, inline: uiInline === undefined ? true : uiInline }}
			value={formData}
			required={required}
			disabled={disabled}
			readonly={readonly}
			label={label}
			onChange={onWidgetChange}
			onFocus={onFocus}
			onBlur={onBlur}
			uiSchema={uiSchema}
			registry={registry}
			autofocus={autofocus}
			multiple={false}
			placeholder=""
		/>
	);
}

export default BooleanField;
