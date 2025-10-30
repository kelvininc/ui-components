import React, { useCallback, useMemo } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvRadio } from '../../../../stencil-generated';
import styles from './RadioWidget.module.scss';
import classNames from 'classnames';
import { useFormState } from '../../contexts';

const RadioWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
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

					return (
						<div
							key={i}
							className={classNames(styles.RadioOption, { [styles.Checked]: checked, [styles.Disabled]: isDisabled })}
							onClick={_ => handleChange(option.value, checked)}
							onFocus={() => markFieldAsTouched(id)}
							onBlur={() => markFieldAsTouched(id)}
						>
							<KvRadio id={option.label} label={option.label} disabled={isDisabled} checked={checked} />
						</div>
					);
				})}
		</div>
	);
};

export default RadioWidget;
