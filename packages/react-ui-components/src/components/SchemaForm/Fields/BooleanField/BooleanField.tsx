import { FieldProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';

function BooleanField<T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	name,
	uiSchema,
	idSchema,
	formData,
	registry,
	required,
	disabled,
	readonly,
	autofocus,
	onChange,
	onFocus,
	onBlur,
	rawErrors
}: FieldProps<T, S, F>) {
	const { title } = schema;
	const { widgets, formContext, fields } = registry;
	const { RadioWidget } = widgets;
	const enumOptions = [
		{
			label: 'True',
			value: true
		},
		{
			label: 'False',
			value: false
		}
	];

	return (
		<RadioWidget
			name={name}
			id={idSchema && idSchema.$id}
			schema={schema}
			options={{ enumOptions, inline: true }}
			value={formData}
			required={required}
			disabled={disabled}
			readonly={readonly}
			label={title === undefined ? name : title}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
			uiSchema={uiSchema}
			registry={registry}
			formContext={formContext}
			autofocus={autofocus}
			rawErrors={rawErrors}
			multiple={false}
			placeholder=""
			DescriptionField={fields.DescriptionField}
		/>
	);
}

export default BooleanField;
