import { WidgetProps } from '@rjsf/core';
import { KvFormLabel, KvRadioButtonGroup } from '../../../stencil-generated';
import React, { useCallback, useMemo } from 'react';
import { buildRadioButtons, buildSelectedRadioButtons, toggleSelectedOptions } from './utils';
import { ICheckboxConfig } from './types';
import { isEmpty } from 'lodash-es';

const CheckboxesWidget = ({ schema, label, id, disabled, options, value, required, readonly, onChange, uiSchema }: WidgetProps) => {
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
			disabled,
			required,
			readonly
		}),
		[multiple, allButton, minItems, maxItems, disabled, required, readonly]
	);
	const buttons = useMemo(() => buildRadioButtons(allOptions, disabledOptions, config), [allOptions, disabledOptions, config]);
	const selectedButtons = useMemo(() => buildSelectedRadioButtons(selectedOptions, allOptions, config), [selectedOptions, allOptions, config]);

	const onCheckedChange = useCallback(
		({ detail: selectedOptionValue }: CustomEvent<string>) => {
			const newValue = toggleSelectedOptions(selectedOptionValue, selectedOptions, allOptions, config);
			onChange(isEmpty(newValue) ? undefined : newValue);
		},
		[selectedOptions, allOptions, config]
	);

	return (
		<>
			{(uiSchema['ui:title'] || schema.title || label) && <KvFormLabel id={`${id}-title`} label={uiSchema['ui:title'] || schema.title || label} required={required} />}
			<KvRadioButtonGroup buttons={buttons} selectedButtons={selectedButtons} onCheckedChange={onCheckedChange} disabled={disabled} />
		</>
	);
};

export default CheckboxesWidget;
