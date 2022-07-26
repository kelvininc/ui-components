import React, { useMemo } from 'react';
import { WidgetProps } from '@rjsf/core';
import { KvRadio, KvFormLabel } from '../../../stencil-generated';
import styles from './RadioWidget.module.scss';
import classNames from 'classnames';

const RadioWidget = ({ label, required, schema, id, options, value, disabled, readonly, onChange, uiSchema }: WidgetProps) => {
	const { enumOptions, enumDisabled, inline } = options;
	const inlineMemo = useMemo(() => Boolean(inline), [inline]);

	return (
		<>
			{(uiSchema['ui:title'] || schema.title || label) && <KvFormLabel id={`${id}-title`} label={uiSchema['ui:title'] || schema.title || label} required={required} />}
			<div className={classNames(styles['radio-list-container'], { [styles.inline]: inlineMemo })}>
				{Array.isArray(enumOptions) &&
					enumOptions.map((option, i: number) => {
						const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;
						const checked = option.value == value;

						return (
							<KvRadio
								id={option.label}
								key={i}
								label={option.label}
								disabled={disabled || itemDisabled || readonly}
								checked={checked}
								onCheckedChange={_ => onChange(option.value)}
							/>
						);
					})}
			</div>
		</>
	);
};

export default RadioWidget;
