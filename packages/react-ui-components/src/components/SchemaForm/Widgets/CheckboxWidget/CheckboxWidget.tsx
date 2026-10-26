import React, { useCallback } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvCheckbox } from '../../../../stencil-generated';
import { useFieldDescription, useFormState } from '../../contexts';
import { getComponentSize } from '../ToggleButtonGroupWidget/utils';

const CheckboxWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	label,
	value,
	disabled,
	readonly,
	options,
	onChange
}: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const accessibleDescriptionElements = useFieldDescription(id);
	const { componentSize, checkboxLabel } = options;
	const checked = value === true;

	const handleChange = useCallback(() => {
		const newValue = !checked;
		trackFieldChange(id, newValue);
		onChange(newValue);
	}, [checked, id, trackFieldChange, onChange]);

	return (
		<KvCheckbox
			size={getComponentSize(componentSize)}
			checked={checked}
			accessibleDescriptionElements={accessibleDescriptionElements}
			disabled={disabled || readonly}
			label={(checkboxLabel as string) ?? undefined}
			accessibleLabel={(checkboxLabel as string) || label}
			onClickCheckbox={handleChange}
			onFocus={() => markFieldAsTouched(id)}
			onBlur={() => markFieldAsTouched(id)}
		/>
	);
};

export default CheckboxWidget;
