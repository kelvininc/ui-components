import React, { useMemo, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { KvMultiSelectDropdown, KvSingleSelectDropdown } from '../../../stencil-generated';
import { EValidationState } from '@kelvininc/ui-components';
import { getSelectedOptions, processValue } from './utils';

const SelectWidget = ({ schema, id, options, label, required, disabled, readonly, value, multiple, onChange, placeholder, rawErrors = [] }: WidgetProps) => {
	const { enumOptions, enumDisabled } = options;
	const emptyValue = useMemo(() => (multiple ? [] : undefined), [multiple]);
	const args = {
		id,
		label: label || schema.title,
		placeholder: placeholder ? placeholder : undefined,
		required,
		disabled: disabled || readonly,
		errorState: rawErrors.length > 0 ? EValidationState.Invalid : EValidationState.Valid,
		displayValue: typeof value === 'undefined' ? emptyValue : value,
		options: Array.isArray(enumOptions)
			? enumOptions.reduce((acc, { value, label }) => {
					const disabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(value) != -1;
					acc[value] = { value, label, disabled };
					return acc;
			  }, {})
			: []
	};

	const [stateValue, setStateValue] = useState(processValue(schema, value));
	const onChangeOptionSelected = ({ detail: selectedOption }: CustomEvent<string>) => {
		const newValue = processValue(schema, selectedOption);
		onChange(newValue);
		setStateValue(newValue);
	};

	const onChangeOptionsSelected = ({ detail: selectedOptionsMap }: CustomEvent<{ [key: string]: boolean }>) => {
		const selectedOptions = getSelectedOptions(selectedOptionsMap);
		const newValue = processValue(schema, selectedOptions);
		onChange(newValue);
		setStateValue(newValue);
	};

	return (
		<>
			{!multiple && <KvSingleSelectDropdown {...args} selectedOption={stateValue} onOptionSelected={onChangeOptionSelected} />}
			{multiple && <KvMultiSelectDropdown {...args} selectedOptions={stateValue} onOptionsSelected={onChangeOptionsSelected} />}
		</>
	);
};

export default SelectWidget;
