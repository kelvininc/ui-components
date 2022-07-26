import React, { Fragment } from 'react';
import { WidgetProps } from '@rjsf/core';
import { KvTextField } from '../../../stencil-generated';
import { EInputFieldType, EValidationState } from '@kelvininc/ui-components';

const TextWidget = ({ id, placeholder, required, readonly, disabled, type, label, value, onChange, onBlur, autofocus, options, schema, rawErrors = [], uiSchema }: WidgetProps) => {
	const _onChange = (value: CustomEvent<string>) => onChange(value.detail === '' ? options.emptyValue : value.detail);
	const _onBlur = (value: CustomEvent<string>) => onBlur(id, value.detail);

	let inputType;
	switch (type || schema.type) {
		case 'number':
		case 'integer':
			inputType = EInputFieldType.Number;
		case 'boolean':
			inputType = EInputFieldType.Radio;
		default:
			inputType = EInputFieldType.Text;
			break;
	}

	return (
		<Fragment>
			<KvTextField
				id={id}
				label={uiSchema['ui:title'] || schema.title || label}
				examples={schema.examples ? (schema.examples as string[]).concat(schema.default ? ([schema.default] as string[]) : []) : undefined}
				disabled={disabled}
				uneditable={readonly}
				required={required}
				forcedFocus={autofocus}
				placeholder={placeholder}
				type={inputType}
				state={rawErrors.length > 0 ? EValidationState.Invalid : EValidationState.Valid}
				value={value || value === 0 ? value : ''}
				onTextChange={_onChange}
				onTextFieldBlur={_onBlur}
			/>
		</Fragment>
	);
};

export default TextWidget;
