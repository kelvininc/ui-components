import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { EValidationState } from '@kelvininc/ui-components';
import { KvTextArea } from '../../../../stencil-generated';
import { useFormState } from '../../contexts';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	label,
	uiSchema = {},
	value,
	placeholder,
	onChange,
	rawErrors = []
}: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched, isFieldTouched, displayErrors } = useFormState();
	const { maxCharLength, iconName } = uiSchema;
	const shouldShowErrors = isFieldTouched(id) || displayErrors;
	const hasErrors = shouldShowErrors && rawErrors.length > 0;

	const onTextChange = useCallback(
		({ detail: textValue }: CustomEvent<string>) => {
			trackFieldChange(id, textValue);
			onChange(textValue);
		},
		[onChange, trackFieldChange, id]
	);

	return (
		<KvTextArea
			id={id}
			accessibleLabel={label}
			state={hasErrors ? EValidationState.Invalid : EValidationState.None}
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
