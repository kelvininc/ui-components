import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { EValidationState } from '@kelvininc/ui-components';
import { KvTextArea } from '../../../../stencil-generated';
import { useFieldDescription, useFieldErrors, useFormState } from '../../contexts';
import { useSchemaFormFocusRef } from '../../hooks/entryFocus';

const TextareaWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	label,
	uiSchema = {},
	value,
	placeholder,
	disabled,
	readonly,
	onChange,
	rawErrors = []
}: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const accessibleDescriptionElements = useFieldDescription(id);
	const focusRef = useSchemaFormFocusRef<HTMLKvTextAreaElement>(disabled || readonly);
	const { maxCharLength, iconName } = uiSchema;
	const hasErrors = useFieldErrors(id, rawErrors);

	const onTextChange = useCallback(
		({ detail: textValue }: CustomEvent<string>) => {
			trackFieldChange(id, textValue);
			onChange(textValue);
		},
		[onChange, trackFieldChange, id]
	);

	return (
		<KvTextArea
			ref={focusRef}
			id={id}
			accessibleLabel={label}
			accessibleDescriptionElements={accessibleDescriptionElements}
			state={hasErrors ? EValidationState.Invalid : EValidationState.None}
			disabled={disabled || readonly}
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
