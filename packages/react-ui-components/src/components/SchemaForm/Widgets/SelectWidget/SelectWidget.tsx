import { EComponentSize, EValidationState } from '@kelvininc/ui-components';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { KvMultiSelectDropdown, KvSingleSelectDropdown } from '../../../../stencil-generated';
import styles from './SelectWidget.module.scss';
import { buildDropdownOptions, buildSelectedOptions, getOptionKey, getSelectedOptions, processValue, resolveDropdownConfig, toOptionKey } from './utils';
import { getSelectedOptionIndex, resolveAllowClearInputs } from '../utils';
import { DEFAULT_MINIMUM_SEARCHABLE_OPTIONS } from './config';
import { useSchemaFormFocusRef } from '../../hooks/entryFocus';
import { useFieldDescription, useFieldErrors, useFormState } from '../../contexts';
import { useTableCell } from '../../contexts/TableContext';

const SelectWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	id,
	label,
	required,
	options,
	disabled,
	readonly,
	value,
	multiple,
	onChange,
	placeholder,
	rawErrors = [],
	uiSchema = {},
	formContext,
	registry
}: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const cell = useTableCell(id);
	const accessibleDescriptionElements = useFieldDescription(id);
	const focusRef = useSchemaFormFocusRef<HTMLKvSingleSelectDropdownElement | HTMLKvMultiSelectDropdownElement>(disabled || readonly);
	const { enumOptions, enumDisabled, enumDescriptions, placeholder: optionsPlaceholder } = options;
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
		componentSize: optionComponentSize,
		multiSubOptions,
		clearSelectionLabel,
		selectionAll,
		selectAllLabel,
		maxSelectable
	} = uiSchema;
	const { componentSize = EComponentSize.Large, dropdownConfig: contextDropdownConfig } = formContext as F;
	const dropdownConfig = resolveDropdownConfig(contextDropdownConfig);
	const customTree = !isEmpty(multiSubOptions);
	const optionValues = useMemo(() => (Array.isArray(enumOptions) ? enumOptions.map(option => option.value) : []), [enumOptions]);
	const valuesByKey = useMemo(() => Object.fromEntries(optionValues.map((value, index) => [getOptionKey(index), value])), [optionValues]);

	const defaultDropdownOptions = useMemo(
		() => buildDropdownOptions({ options: enumOptions, disabledOptions: enumDisabled, descriptions: enumDescriptions, multiSubOptions, schema }),
		[enumOptions, enumDisabled, enumDescriptions, multiSubOptions, schema]
	);
	const displayOptions = useMemo(
		() =>
			displayValue
				? buildDropdownOptions({ options: enumOptions, disabledOptions: enumDisabled, descriptions: enumDescriptions, multiSubOptions, schema, legacyKeys: true })
				: defaultDropdownOptions,
		[displayValue, enumOptions, enumDisabled, enumDescriptions, multiSubOptions, schema, defaultDropdownOptions]
	);
	const emptyValue = Object.prototype.hasOwnProperty.call(options, 'emptyValue') ? options.emptyValue : multiple ? [] : undefined;
	const processedValue = customTree ? processValue(schema, value) : value;
	const selectedKey = (value: unknown) => {
		const index = getSelectedOptionIndex(optionValues, value);
		return index === -1 ? undefined : getOptionKey(index);
	};
	const selectedOption = customTree ? toOptionKey(processedValue) : selectedKey(value);
	const selectedKeys = customTree ? processedValue : Array.isArray(value) ? value.map(selectedKey).filter(key => key !== undefined) : [];

	const onChangeValue = useCallback(
		(newValue: unknown) => {
			trackFieldChange(id, newValue);
			onChange(newValue);
		},
		[id, onChange, trackFieldChange]
	);
	const onChangeOptionSelected = useCallback(
		({ detail: selectedOption }: CustomEvent<string>) => {
			if (selectedOption == null) onChangeValue(emptyValue);
			else if (customTree) onChangeValue(processValue(schema, selectedOption));
			else if (Object.prototype.hasOwnProperty.call(valuesByKey, selectedOption)) onChangeValue(valuesByKey[selectedOption]);
		},
		[onChangeValue, emptyValue, customTree, schema, valuesByKey]
	);
	const onChangeOptionsSelected = useCallback(
		({ detail: selectedOptionsMap }: CustomEvent<{ [key: string]: boolean }>) => {
			const selectedOptions = getSelectedOptions(selectedOptionsMap);
			const values = customTree
				? processValue(schema, selectedOptions)
				: selectedOptions.filter(key => Object.prototype.hasOwnProperty.call(valuesByKey, key)).map(key => valuesByKey[key]);
			onChangeValue(values.length ? values : emptyValue);
		},
		[onChangeValue, emptyValue, customTree, schema, valuesByKey]
	);

	const hasErrors = useFieldErrors(id, rawErrors);

	const props = {
		id,
		accessibleLabel: cell?.accessibleLabel ?? label,
		required,
		inputConfig: { accessibleDescriptionElements },
		placeholder: placeholder ? placeholder : optionsPlaceholder,
		inputSize: !isEmpty(optionComponentSize) ? optionComponentSize : (componentSize as EComponentSize),
		disabled: disabled || readonly,
		errorState: hasErrors ? EValidationState.Invalid : EValidationState.Valid,
		displayValue: typeof processedValue === 'undefined' ? undefined : displayValue?.(processedValue, displayOptions),
		displayPrefix,
		options: defaultDropdownOptions,
		searchable,
		zIndex: optionZIndex ?? dropdownConfig.zIndex,
		minHeight: minHeight ?? dropdownConfig.minHeight,
		maxHeight: maxHeight ?? dropdownConfig.maxHeight,
		minWidth: minWidth ?? dropdownConfig.minWidth,
		maxWidth: maxWidth ?? dropdownConfig.maxWidth,
		icon: icon ?? dropdownConfig.icon,
		badge,
		selectionClearable: (options.allowClearInputs as boolean | undefined) ?? resolveAllowClearInputs(uiSchema, registry) ?? selectionClearable,
		clearSelectionLabel,
		selectionAll,
		selectAllLabel,
		maxSelectable,
		minSearchOptions: minSearchOptions ?? DEFAULT_MINIMUM_SEARCHABLE_OPTIONS
	};

	return (
		<div className={styles.InputContainer}>
			{!multiple && (
				<KvSingleSelectDropdown
					ref={focusRef}
					selectedOption={selectedOption}
					onOptionSelected={onChangeOptionSelected}
					{...props}
					onFocus={() => markFieldAsTouched(id)}
					onBlur={() => markFieldAsTouched(id)}
				/>
			)}
			{multiple && (
				<KvMultiSelectDropdown
					ref={focusRef}
					selectedOptions={buildSelectedOptions(selectedKeys)}
					onOptionsSelected={onChangeOptionsSelected}
					{...props}
					onFocus={() => markFieldAsTouched(id)}
					onBlur={() => markFieldAsTouched(id)}
				/>
			)}
		</div>
	);
};

export default SelectWidget;
