import { EInputFieldType, EValidationState } from '@kelvininc/ui-components';
import { WidgetProps } from '@rjsf/core';
import classNames from 'classnames';
import { JSONSchema7TypeName } from 'json-schema';
import { isEmpty } from 'lodash-es';
import React, { useMemo } from 'react';
import { KvTextField } from '../../../stencil-generated';
import styles from './TextWidget.module.scss';

const getInputType = (type?: JSONSchema7TypeName | JSONSchema7TypeName[]) => {
	switch (type) {
		case 'number':
		case 'integer':
			return EInputFieldType.Number;
		case 'boolean':
			return EInputFieldType.Radio;
		default:
			return EInputFieldType.Text;
	}
};

const TextWidget = ({ id, placeholder, required, readonly, disabled, label, value, onChange, onBlur, autofocus, options, schema, rawErrors = [], uiSchema }: WidgetProps) => {
	const _onChange = (value: CustomEvent<string>) => onChange(value.detail === '' ? options.emptyValue : value.detail);
	const _onBlur = (value: CustomEvent<string>) => onBlur(id, value.detail);
	const inputType = useMemo(() => getInputType(schema.type), [schema.type]);
	const examples = useMemo(() => (schema.examples ? (schema.examples as string[]).concat(schema.default ? ([schema.default] as string[]) : []) : undefined), [schema.examples]);
	const hasErrors = useMemo(() => !isEmpty(rawErrors), [rawErrors]);
	const displayedLabel = useMemo(() => uiSchema['ui:title'] || schema.title || label, [uiSchema, schema.title, label]);

	return (
		<div className={classNames(styles['input-container'], { [styles['has-errors']]: hasErrors, [styles['has-label']]: !!displayedLabel })}>
			<KvTextField
				id={id}
				label={displayedLabel}
				examples={examples}
				disabled={disabled}
				readonly={readonly}
				required={required}
				forcedFocus={autofocus}
				placeholder={placeholder}
				type={inputType}
				state={hasErrors ? EValidationState.Invalid : EValidationState.Valid}
				value={value || value === 0 ? value : ''}
				onTextChange={_onChange}
				onTextFieldBlur={_onBlur}
			/>
		</div>
	);
};

export default TextWidget;
