import { FieldProps, FormContextType, RJSFSchema, StrictRJSFSchema, getUiOptions } from '@rjsf/utils';
import React from 'react';
import { getEnumOptions, getWidget } from './utils';
import { DEFAULT_BOOLEAN_LABELS } from './config';

function BooleanField<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	name,
	uiSchema = {},
	idSchema,
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
	const { widgets, formContext, fields, globalUiOptions } = registry;
	let Widget = getWidget(uiSchema, widgets);

	const { title: uiTitle, label: displayLabel = true, inline: uiInline, booleanLabels = DEFAULT_BOOLEAN_LABELS, ...options } = getUiOptions<T, S, F>(uiSchema, globalUiOptions);
	let enumOptions = getEnumOptions(schema, booleanLabels as Record<string, string>);
	const label = uiTitle ?? title ?? name;

	return (
		<Widget
			name={name}
			id={idSchema && idSchema.$id}
			schema={schema}
			options={{ ...options, enumOptions, inline: uiInline === undefined ? true : uiInline }}
			value={formData}
			required={required}
			disabled={disabled}
			readonly={readonly}
			label={label}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			uiSchema={uiSchema}
			registry={registry}
			formContext={formContext}
			autofocus={autofocus}
			multiple={false}
			placeholder=""
			DescriptionField={fields.DescriptionField}
		/>
	);
}

export default BooleanField;
