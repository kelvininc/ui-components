import React, { useCallback, useMemo } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvRadioListItem } from '../../../../stencil-generated';
import styles from './RadioListWidget.module.scss';
import classNames from 'classnames';
import { get } from 'lodash';
import { useFormState } from '../../contexts';

const RadioListWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	options,
	value,
	disabled,
	readonly,
	formContext,
	onChange
}: WidgetProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const { enumOptions, enumDisabled, inline } = options;
	const inlineMemo = useMemo(() => Boolean(inline), [inline]);
	const { allowClearInputs } = formContext as F;

	const handleChange = useCallback(
		(optionValue: any, checked: boolean) => {
			const newValue = allowClearInputs && checked ? undefined : optionValue;
			trackFieldChange(id, newValue);
			onChange(newValue);
		},
		[onChange, allowClearInputs, trackFieldChange, id]
	);

	return (
		<div className={classNames(styles.RadioListContainer, { [styles.Inline]: inlineMemo })}>
			{Array.isArray(enumOptions) &&
				enumOptions.map((option, i: number) => {
					const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;
					const checked = option.value == value;
					const isDisabled = disabled || itemDisabled || readonly;
					const description = get(option, 'schema.description', '');

					return (
						<KvRadioListItem
							key={i}
							optionId={option.label}
							label={option.label}
							disabled={isDisabled}
							checked={checked}
							description={description}
							onOptionClick={(_value: unknown) => handleChange(option.value, checked)}
							onFocus={() => markFieldAsTouched(id)}
							onBlur={() => markFieldAsTouched(id)}
						/>
					);
				})}
		</div>
	);
};

export default RadioListWidget;
