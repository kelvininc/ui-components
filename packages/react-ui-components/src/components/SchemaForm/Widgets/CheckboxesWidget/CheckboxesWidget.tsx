import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvFormLabel, KvToggleButtonGroup } from '../../../stencil-generated';
import React, { useCallback, useMemo } from 'react';
import { buildToggleButtons, buildSelectedToggleButtons, toggleSelectedOptions, buildDisabledToggleButtons } from './utils';
import { ICheckboxConfig } from './types';
import { get, isEmpty } from 'lodash';

const CheckboxesWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	schema,
	label,
	id,
	options,
	disabled,
	value,
	required,
	readonly,
	onChange,
	uiSchema
}: WidgetProps<T, S, F>) => {
	const { enumOptions, enumDisabled, allButton } = options;
	const { maxItems, minItems } = schema;

	const selectedOptions = useMemo(() => (Array.isArray(value) ? value : []), [value]);
	const allOptions = useMemo(() => (Array.isArray(enumOptions) ? enumOptions : []), [enumOptions]);
	const disabledOptions = useMemo(() => (Array.isArray(enumDisabled) ? enumDisabled : []), [enumDisabled]);

	const minimumItems = useMemo(() => minItems ?? 0, [minItems]);
	const maximumItems = useMemo(() => maxItems ?? allOptions.length, [maxItems, allOptions.length]);
	const multiple = useMemo(() => minimumItems > 0 || maximumItems > 1, [minItems, maxItems]);
	const config = useMemo<ICheckboxConfig>(
		() => ({
			multiple,
			allButton: allButton === true,
			minItems: minimumItems,
			maxItems: maximumItems,
			required,
			readonly
		}),
		[multiple, allButton, minItems, maxItems, required, readonly]
	);
	const buttons = useMemo(() => buildToggleButtons(allOptions, disabledOptions, config), [allOptions, disabledOptions, config]);
	const selectedButtons = useMemo(() => buildSelectedToggleButtons(selectedOptions, allOptions, config), [selectedOptions, allOptions, config]);
	const disabledButtons = useMemo(() => buildDisabledToggleButtons(buttons), [buttons]);

	const onCheckedChange = useCallback(
		({ detail: selectedOptionValue }: CustomEvent<string>) => {
			const newValue = toggleSelectedOptions(selectedOptionValue, selectedOptions, allOptions, config);
			onChange(isEmpty(newValue) ? undefined : newValue);
		},
		[selectedOptions, allOptions, config]
	);

	return (
		<>
			{(get(uiSchema, ['ui:title']) || schema.title || label) && (
				<KvFormLabel id={`${id}-title`} label={get(uiSchema, ['ui:title']) || schema.title || label} required={required} />
			)}
			<KvToggleButtonGroup buttons={buttons} selectedButtons={selectedButtons} onCheckedChange={onCheckedChange} disabled={disabled} disabledButtons={disabledButtons} />
		</>
	);
};

export default CheckboxesWidget;
