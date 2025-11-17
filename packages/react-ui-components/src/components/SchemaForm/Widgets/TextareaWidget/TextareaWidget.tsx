import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvTextArea } from '../../../../stencil-generated';
import { useFormState } from '../../contexts';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ id, uiSchema = {}, value, placeholder, onChange }: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const { maxCharLength, iconName } = uiSchema;

	const onTextChange = useCallback(
		({ detail: textValue }: CustomEvent<string>) => {
			trackFieldChange(id, textValue);
			onChange(textValue);
		},
		[onChange, trackFieldChange, id]
	);

	return (
		<KvTextArea
			maxCharLength={maxCharLength}
			icon={iconName}
			text={value}
			placeholder={placeholder}
			onTextChange={onTextChange}
			onBlur={() => markFieldAsTouched(id)}
			onFocus={() => markFieldAsTouched(id)}
		/>
	);
};

export default TextareaWidget;
