import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvToggleButtonGroup } from '../../../stencil-generated';
import React, { useCallback, useMemo } from 'react';
import { buildToggleButtons, buildSelectedToggleButtons, toggleSelectedOptions, buildDisabledToggleButtons, getComponentSize } from './utils';
import { ICheckboxConfig } from './types';
import { isEmpty } from 'lodash';
import { useCurrentDirtyFieldsContext } from '../../contexts/CurrentDirtyFieldsContext';

const CheckboxesWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	schema,
	options,
	disabled,
	value,
	required,
	readonly,
	onChange
}: WidgetProps<T, S, F>) => {
	const { setDirty } = useCurrentDirtyFieldsContext();
	const { enumOptions, enumDisabled, allButton, componentSize, withRadio } = options;
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
			setDirty(id);
			onChange(isEmpty(newValue) ? undefined : newValue);
		},
		[id, selectedOptions, allOptions, config, setDirty, onChange]
	);

	return (
		<KvToggleButtonGroup
			buttons={buttons}
			disabled={disabled}
			size={getComponentSize(componentSize)}
			withRadio={withRadio === true}
			disabledButtons={disabledButtons}
			selectedButtons={selectedButtons}
			onCheckedChange={onCheckedChange}
		/>
	);
};

export default CheckboxesWidget;
