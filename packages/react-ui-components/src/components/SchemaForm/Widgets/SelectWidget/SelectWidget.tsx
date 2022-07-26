import React, { useMemo, useState } from 'react';
import { WidgetProps } from '@rjsf/core';
import { utils } from '@rjsf/core';
import { KvMultiSelectDropdown, KvSingleSelectDropdown } from '../../../stencil-generated';
import { EValidationState } from '@kelvininc/ui-components';
import { JSONSchema7 } from 'json-schema';
import { get } from 'lodash-es';

const { asNumber, guessType } = utils;
const numericTypes = ['number', 'integer'];

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: JSONSchema7, value: any) => {
	// "enum" is a reserved word, so only "type" and "items" can be destructured
	const { type, items } = schema;
	if (value === '') {
		return undefined;
	} else if (type === 'array' && items && numericTypes.includes(get(items, 'type'))) {
		return value.map(asNumber);
	} else if (type === 'boolean') {
		return value === 'true';
	} else if (type === 'number') {
		return asNumber(value);
	}

	// If type is undefined, but an enum is present, try and infer the type from
	// the enum values
	if (schema.enum) {
		if (schema.enum.every((x: any) => guessType(x) === 'number')) {
			return asNumber(value);
		} else if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
			return value === 'true';
		}
	}

	return value;
};

const SelectWidget = ({ schema, id, options, label, required, disabled, readonly, value, multiple, onChange, placeholder, rawErrors = [] }: WidgetProps) => {
	const { enumOptions, enumDisabled } = options;
	const emptyValue = useMemo(() => (multiple ? [] : undefined), [multiple]);
	const args = {
		id,
		label: label || schema.title,
		placeholder: placeholder ? placeholder : undefined,
		required,
		disabled: disabled || readonly,
		errorState: rawErrors.length > 0 ? EValidationState.Invalid : EValidationState.Valid,
		displayValue: typeof value === 'undefined' ? emptyValue : value,
		options: Array.isArray(enumOptions)
			? enumOptions.reduce((acc, { value, label }) => {
					const disabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(value) != -1;
					acc[value] = { value, label, disabled };
					return acc;
			  }, {})
			: []
	};

	const [stateValue, setStateValue] = useState(processValue(schema, value));
	const _onChange = (value: CustomEvent<string | string[]>) => {
		const newValue = processValue(schema, value.detail);
		onChange(newValue);
		setStateValue(newValue);
	};

	return (
		<>
			{!multiple && <KvSingleSelectDropdown {...args} selectedOption={stateValue} onOptionSelected={_onChange} />}
			{multiple && <KvMultiSelectDropdown {...args} selectedOptions={stateValue} onOptionsSelected={_onChange} />}
		</>
	);
};

export default SelectWidget;
