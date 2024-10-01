import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvTextArea } from '../../../../stencil-generated/components';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ uiSchema = {}, value, placeholder, onChange }: WidgetProps<T, S, F>) => {
	const { maxCharLength, iconName } = uiSchema;

	const onTextChange = useCallback(
		({ detail: textValue }: CustomEvent<string>) => {
			onChange(textValue);
		},
		[onChange]
	);

	return <KvTextArea maxCharLength={maxCharLength} icon={iconName} text={value} placeholder={placeholder} onTextChange={onTextChange} />;
};

export default TextareaWidget;
