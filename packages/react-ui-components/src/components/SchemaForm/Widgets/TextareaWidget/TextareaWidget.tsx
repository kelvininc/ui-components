import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvTextArea } from '../../../../stencil-generated';
import { useFormState } from '../../contexts';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	uiSchema = {},
	value,
	placeholder,
	onChange,
	onBlur
}: WidgetProps<T, S, F>) => {
	const { trackField } = useFormState();
	const { maxCharLength, iconName } = uiSchema;

	const onTextChange = useCallback(
		({ detail: textValue }: CustomEvent<string>) => {
			trackField(id, textValue);
			onChange(textValue);
		},
		[onChange, trackField, id]
	);

	const onTextBlur = useCallback(
		({ detail: textValue }: CustomEvent<string>) => {
			onBlur(id, textValue);
		},
		[onBlur, id]
	);

	return <KvTextArea maxCharLength={maxCharLength} icon={iconName} text={value} placeholder={placeholder} onTextChange={onTextChange} onTextAreaBlur={onTextBlur} />;
};

export default TextareaWidget;
