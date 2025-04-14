import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvTextArea } from '../../../stencil-generated';
import { useCurrentDirtyFieldsContext } from '../../contexts/CurrentDirtyFieldsContext';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ id, uiSchema = {}, value, placeholder, onChange }: WidgetProps<T, S, F>) => {
	const { maxCharLength, iconName } = uiSchema;
	const { setDirty } = useCurrentDirtyFieldsContext();
	const onTextChange = useCallback(
		({ detail: textValue }) => {
			onChange(textValue);
			setDirty(id);
		},
		[onChange, setDirty, id]
	);

	return <KvTextArea maxCharLength={maxCharLength} icon={iconName} text={value} placeholder={placeholder} onTextChange={onTextChange} />;
};

export default TextareaWidget;
