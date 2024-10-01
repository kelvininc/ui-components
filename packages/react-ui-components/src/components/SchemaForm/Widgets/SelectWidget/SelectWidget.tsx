import { EComponentSize, EValidationState } from '@kelvininc/ui-components';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { KvMultiSelectDropdown, KvSingleSelectDropdown } from '../../../../stencil-generated/components';
import styles from './SelectWidget.module.scss';
import { buildDropdownOptions, buildSelectedOptions, getSelectedOptions, processValue, searchDropdownOptions } from './utils';
import { DEFAULT_DROPDOWN_CONFIG, DEFAULT_MINIMUM_SEARCHABLE_OPTIONS } from './config';

const SelectWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	id,
	options,
	disabled,
	readonly,
	value,
	multiple,
	onChange,
	placeholder,
	rawErrors = [],
	uiSchema = {},
	formContext
}: WidgetProps<T, S, F>) => {
	const { enumOptions, enumDisabled, placeholder: optionsPlaceholder } = options;
	const {
		displayValue,
		searchable,
		selectionClearable,
		minHeight,
		maxHeight,
		minWidth,
		maxWidth,
		icon,
		minSearchOptions,
		badge,
		valuePrefix: displayPrefix,
		zIndex: optionZIndex,
		componentSize: optionComponentSize
	} = uiSchema;
	const { componentSize = EComponentSize.Large, dropdownConfig = DEFAULT_DROPDOWN_CONFIG } = formContext as F;
	const [searchTerm, setSearchTerm] = useState<string | null>(null);

	const defaultDropdownOptions = useMemo(() => buildDropdownOptions(enumOptions, enumDisabled), [enumOptions, enumDisabled]);
	const filteredOptions = useMemo(() => {
		if (searchTerm !== null && searchTerm.length > 0) {
			return searchDropdownOptions(searchTerm, defaultDropdownOptions);
		}

		return defaultDropdownOptions;
	}, [searchTerm, defaultDropdownOptions]);

	const emptyValue = useMemo(() => (multiple ? [] : undefined), [multiple]);
	const processedValue = processValue(schema, value);

	const onSearchChange = useCallback(({ detail: searchedLabel }: CustomEvent<string>) => setSearchTerm(searchedLabel), []);
	const onChangeOptionSelected = useCallback(({ detail: selectedOption }: CustomEvent<string>) => {
		onChangeValue(selectedOption);
	}, []);
	const onChangeOptionsSelected = useCallback(({ detail: selectedOptionsMap }: CustomEvent<{ [key: string]: boolean }>) => {
		const selectedOptions = getSelectedOptions(selectedOptionsMap);
		onChangeValue(selectedOptions);
	}, []);
	const onChangeValue = useCallback((newValue: string | string[]) => {
		const processedValue = processValue(schema, newValue);
		onChange(processedValue);
	}, []);

	const hasErrors = useMemo(() => !isEmpty(rawErrors), [rawErrors]);

	const props = {
		id,
		placeholder: placeholder ? placeholder : optionsPlaceholder,
		inputSize: !isEmpty(optionComponentSize) ? optionComponentSize : (componentSize as EComponentSize),
		disabled: disabled || readonly,
		errorState: hasErrors ? EValidationState.Invalid : EValidationState.Valid,
		displayValue: typeof processedValue === 'undefined' ? emptyValue : displayValue?.(processedValue, defaultDropdownOptions),
		displayPrefix,
		options: defaultDropdownOptions,
		filteredOptions,
		onSearchChange,
		searchable,
		zIndex: optionZIndex ?? dropdownConfig.zIndex,
		minHeight: minHeight ?? dropdownConfig.minHeight,
		maxHeight: maxHeight ?? dropdownConfig.maxHeight,
		minWidth: minWidth ?? dropdownConfig.minWidth,
		maxWidth: maxWidth ?? dropdownConfig.maxWidth,
		icon: icon ?? dropdownConfig.icon,
		badge,
		selectionClearable,
		minSearchOptions: minSearchOptions ?? DEFAULT_MINIMUM_SEARCHABLE_OPTIONS
	};

	return (
		<div className={styles.InputContainer}>
			{!multiple && <KvSingleSelectDropdown selectedOption={processedValue} onOptionSelected={onChangeOptionSelected} {...props} />}
			{multiple && <KvMultiSelectDropdown selectedOptions={buildSelectedOptions(processedValue)} onOptionsSelected={onChangeOptionsSelected} {...props} />}
		</div>
	);
};

export default SelectWidget;
