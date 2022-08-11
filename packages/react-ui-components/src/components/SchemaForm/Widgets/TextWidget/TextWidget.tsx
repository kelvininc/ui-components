import React, { Fragment, useMemo } from 'react';
import { WidgetProps } from '@rjsf/core';
import { JSONSchema7TypeName } from 'json-schema';
import { KvTextField } from '../../../stencil-generated';
import { EInputFieldType, EValidationState } from '@kelvininc/ui-components';

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

	return (
		<Fragment>
			<KvTextField
				id={id}
				label={uiSchema['ui:title'] || schema.title || label}
				examples={examples}
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
