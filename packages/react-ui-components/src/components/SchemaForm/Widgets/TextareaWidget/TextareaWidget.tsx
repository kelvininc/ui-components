import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { get } from 'lodash';
import { KvFormLabel, KvTextArea } from '../../../stencil-generated';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	label,
	required,
	schema,
	id,
	uiSchema = {},
	value,
	placeholder,
	onChange
}: WidgetProps<T, S, F>) => {
	const { maxCharLength, iconName } = uiSchema;

	const onTextChange = useCallback(
		({ detail: textValue }) => {
			onChange(textValue);
		},
		[onChange]
	);

	return (
		<>
			{(get(uiSchema, ['ui:title']) || schema.title || label) && (
				<KvFormLabel id={`${id}-title`} label={get(uiSchema, ['ui:title']) || schema.title || label} required={required} />
			)}
			<KvTextArea maxCharLength={maxCharLength} icon={iconName} text={value} placeholder={placeholder} onTextChange={onTextChange} />
		</>
	);
};

export default TextareaWidget;
