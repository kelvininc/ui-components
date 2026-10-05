import { EComponentSize } from '@kelvininc/ui-components';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import React, { useContext } from 'react';
import { KvRadioList } from '../../../stencil-generated';
import { ChoiceControlContext, useFieldDescription, useFieldErrors, useFormState } from '../contexts';
import { getSelectedOptionIndex } from './utils';

export const RadioChoice = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	label,
	required,
	value,
	options,
	disabled,
	readonly,
	rawErrors = [],
	hideError,
	onChange,
	descriptions,
	size,
	className
}: WidgetProps<T, S, F> & { descriptions?: boolean; size?: EComponentSize; className?: string }) => {
	const host = useContext(ChoiceControlContext);
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const accessibleDescriptionElements = useFieldDescription(id);
	const invalid = useFieldErrors(id, rawErrors) && !hideError;
	const enumOptions = Array.isArray(options.enumOptions) ? options.enumOptions : [];
	const selected = getSelectedOptionIndex(
		enumOptions.map(option => option.value),
		value
	);
	const items = enumOptions.map((option, index) => ({
		optionId: String(index),
		label: option.label,
		size,
		disabled: Boolean(disabled || readonly || (Array.isArray(options.enumDisabled) && options.enumDisabled.includes(option.value))),
		description: descriptions ? (Array.isArray(options.enumDescriptions) ? options.enumDescriptions[index] : undefined) || option.schema?.description : undefined,
		accessibleDescriptionElements
	}));
	return (
		<KvRadioList
			ref={host ?? undefined}
			id={id}
			className={className}
			accessibleLabel={label}
			required={required}
			invalid={invalid}
			options={items}
			selectedOption={selected < 0 ? undefined : String(selected)}
			onOptionSelected={({ detail }) => {
				const index = items.findIndex(item => item.optionId === String(detail));
				if (index < 0 || items[index].disabled) return;
				const next = enumOptions[index].value;
				trackFieldChange(id, next);
				onChange(next);
			}}
			onFocus={() => markFieldAsTouched(id)}
			onBlur={() => markFieldAsTouched(id)}
		/>
	);
};
