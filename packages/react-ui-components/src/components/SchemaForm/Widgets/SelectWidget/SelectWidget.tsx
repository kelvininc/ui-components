import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { KvMultiSelectDropdown, KvSingleSelectDropdown } from '../../../stencil-generated';
import { EValidationState } from '@kelvininc/ui-components';
import { buildDropdownOptions, buildSelectedOptions, getSelectedOptions, processValue, searchDropdownOptions } from './utils';

const SelectWidget = ({ schema, id, options, label, required, disabled, readonly, value, multiple, onChange, placeholder, rawErrors = [], uiSchema = {} }: WidgetProps) => {
	const { enumOptions, enumDisabled } = options;
	const { displayValue, searchable, selectionClearable } = uiSchema;

	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	const defaultDropdownOptions = useMemo(() => buildDropdownOptions(enumOptions, enumDisabled), [enumOptions, enumDisabled]);
	const filteredOptions = useMemo(() => {
		if (searchTerm !== null && searchTerm.length > 0) {
			return searchDropdownOptions(searchTerm, defaultDropdownOptions);
		}

		return defaultDropdownOptions;
	}, [searchTerm, defaultDropdownOptions]);
	const [stateValue, setStateValue] = useState(processValue(schema, value));
	const emptyValue = useMemo(() => (multiple ? [] : undefined), [multiple]);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => setSearchTerm(searchedLabel), []);
	const onChangeOptionSelected = useCallback(({ detail: selectedOption }: CustomEvent<string>) => {
		onChangeValue(selectedOption);
	}, []);
	const onChangeOptionsSelected = useCallback(({ detail: selectedOptionsMap }: CustomEvent<{ [key: string]: boolean }>) => {
		const selectedOptions = getSelectedOptions(selectedOptionsMap);
		onChangeValue(selectedOptions);
	}, []);
	const onSelectionCleared = useCallback(() => {
		onChangeValue([]);
	}, [onChange]);
	const onChangeValue = useCallback(newValue => {
		const processedValue = processValue(schema, newValue);
		onChange(processedValue);
		setStateValue(processedValue);
	}, []);

	const props = {
		id,
		label: label || schema.title,
		placeholder: placeholder ? placeholder : undefined,
		required,
		disabled: disabled || readonly,
		errorState: rawErrors.length > 0 ? EValidationState.Invalid : EValidationState.Valid,
		displayValue: typeof value === 'undefined' ? emptyValue : displayValue?.(value, defaultDropdownOptions),
		options: filteredOptions,
		onSearchChange,
		searchable
	};

	useEffect(() => {
		setStateValue(processValue(schema, value));
	}, [value]);

	return (
		<>
			{!multiple && <KvSingleSelectDropdown {...args} selectedOption={stateValue} onOptionSelected={onChangeOptionSelected} />}
			{multiple && (
				<KvMultiSelectDropdown
					selectionClearable={selectionClearable}
					onSelectionCleared={onSelectionCleared}
					selectedOptions={buildSelectedOptions(stateValue)}
					onOptionsSelected={onChangeOptionsSelected}
					{...props}
				/>
			)}
		</>
	);
};

export default SelectWidget;
