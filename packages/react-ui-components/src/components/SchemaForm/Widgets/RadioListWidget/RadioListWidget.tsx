import React, { useCallback, useMemo } from 'react';
import { EnumOptionsType, FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvRadioListItem } from '../../../stencil-generated';
import styles from './RadioListWidget.module.scss';
import classNames from 'classnames';
import { get } from 'lodash';
import { useCurrentDirtyFieldsContext } from '../../contexts/CurrentDirtyFieldsContext';

const RadioListWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	options,
	value,
	disabled,
	readonly,
	onChange
}: WidgetProps<T, S, F>) => {
	const { enumOptions, enumDisabled, inline } = options;
	const inlineMemo = useMemo(() => Boolean(inline), [inline]);
	const { setDirty } = useCurrentDirtyFieldsContext();

	const onOptionClick = useCallback(
		(option: EnumOptionsType<S>) => {
			onChange(option.value);
			setDirty(id);
		},
		[id, onChange, setDirty]
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
							onOptionClick={(_value: unknown) => onOptionClick(option)}
						/>
					);
				})}
		</div>
	);
};

export default RadioListWidget;
