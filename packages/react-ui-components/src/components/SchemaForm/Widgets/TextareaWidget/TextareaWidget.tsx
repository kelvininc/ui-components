import React, { useCallback } from 'react';
import { WidgetProps } from '@rjsf/utils';
import { get } from 'lodash';
import { KvFormLabel, KvTextArea } from '../../../stencil-generated';

const TextareaWidget = ({ label, required, schema, id, uiSchema = {}, value, placeholder, onChange }: WidgetProps) => {
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
