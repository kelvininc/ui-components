import React, { useMemo } from 'react';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import { KvRadio, KvFormLabel } from '../../../stencil-generated';
import styles from './RadioWidget.module.scss';
import classNames from 'classnames';
import { get } from 'lodash';

const RadioWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	label,
	required,
	schema,
	id,
	options,
	value,
	disabled,
	readonly,
	onChange,
	uiSchema
}: WidgetProps<T, S, F>) => {
	const { enumOptions, enumDisabled, inline } = options;
	const inlineMemo = useMemo(() => Boolean(inline), [inline]);

	return (
		<>
			{(get(uiSchema, ['ui:title']) || schema.title || label) && (
				<KvFormLabel id={`${id}-title`} label={get(uiSchema, ['ui:title']) || schema.title || label} required={required} />
			)}
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
								onClick={_ => onChange(option.value)}
							>
								<KvRadio id={option.label} label={option.label} disabled={isDisabled} checked={checked} />
							</div>
						);
					})}
			</div>
		</>
	);
};

export default RadioWidget;
