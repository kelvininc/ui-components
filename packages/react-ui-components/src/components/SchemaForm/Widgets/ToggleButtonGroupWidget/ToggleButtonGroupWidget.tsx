import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { ERadioControlType } from '@kelvininc/ui-components';
import { KvToggleButtonGroup } from '../../../../stencil-generated';
import React, { useCallback, useMemo } from 'react';
import { buildToggleButtons, buildSelectedToggleButtons, toggleSelectedOptions, buildDisabledToggleButtons, getComponentSize } from './utils';
import { IToggleButtonGroupConfig } from './types';
import { isEmpty } from 'lodash';
import { useFieldDescription, useFormState } from '../../contexts';
import { useSchemaFormFocusRef } from '../../hooks/entryFocus';

const ToggleButtonGroupWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	label,
	schema,
	options,
	disabled,
	value,
	required,
	readonly,
	onChange
}: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const accessibleDescriptionElements = useFieldDescription(id);
	const focusRef = useSchemaFormFocusRef<HTMLKvToggleButtonGroupElement>(disabled || readonly);
	const { enumOptions, enumDisabled, allButton, componentSize, withRadio } = options;
	const { maxItems, minItems } = schema;

	const selectedOptions = useMemo(() => (Array.isArray(value) ? value : []), [value]);
	const allOptions = useMemo(() => (Array.isArray(enumOptions) ? enumOptions : []), [enumOptions]);
	const disabledOptions = useMemo(() => (Array.isArray(enumDisabled) ? enumDisabled : []), [enumDisabled]);

	const minimumItems = useMemo(() => minItems ?? 0, [minItems]);
	const maximumItems = useMemo(() => maxItems ?? allOptions.length, [maxItems, allOptions.length]);
	const multiple = useMemo(() => minimumItems > 0 || maximumItems > 1, [minItems, maxItems]);
	const config = useMemo<IToggleButtonGroupConfig>(
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
		({ detail: selectedOptionValue }: CustomEvent<string | number>) => {
			const newValue = toggleSelectedOptions(selectedOptionValue, selectedOptions, allOptions, config);
			const finalValue = isEmpty(newValue) ? undefined : newValue;
			trackFieldChange(id, finalValue);
			onChange(finalValue);
		},
		[selectedOptions, allOptions, config, trackFieldChange, id, onChange]
	);

	return (
		<div role="group" aria-label={label.trim() || id}>
			<KvToggleButtonGroup
				ref={focusRef}
				buttons={buttons.map(button => ({ ...button, accessibleDescriptionElements }))}
				disabled={disabled}
				size={getComponentSize(componentSize)}
				withRadio={withRadio === true}
				radioControlType={ERadioControlType.Checkbox}
				disabledButtons={disabledButtons}
				selectedButtons={selectedButtons}
				onCheckedChange={onCheckedChange}
				onFocus={() => markFieldAsTouched(id)}
				onBlur={() => markFieldAsTouched(id)}
			/>
		</div>
	);
};

export default ToggleButtonGroupWidget;
