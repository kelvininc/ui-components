import { EComponentSize, EInputFieldType, EValidationState } from '@kelvininc/ui-components';
import { get, isArray, isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { KvTextField } from '../../../stencil-generated';
import styles from './BaseInputTemplate.module.scss';
import { BaseInputTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { INPUT_TYPES } from './BaseInputTemplate.config';
import { JSONSchema7TypeName } from 'json-schema';

const getInputType = (type?: JSONSchema7TypeName | JSONSchema7TypeName[]) => (type && !isArray(type) ? INPUT_TYPES[type] ?? EInputFieldType.Text : EInputFieldType.Text);

const BaseInputTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	placeholder,
	required,
	readonly,
	disabled,
	label,
	value,
	onChange,
	onBlur,
	autofocus,
	options,
	schema,
	rawErrors = [],
	uiSchema = {},
	formContext,
	type
}: BaseInputTemplateProps<T, S, F>) => {
	const _onChange = useCallback((value: CustomEvent<string>) => onChange(value?.detail ? value.detail : options.emptyValue), [onChange, options]);
	const _onBlur = useCallback((value: CustomEvent<string>) => onBlur(id, value.detail), [onBlur, id]);
	const inputType = useMemo(() => type ?? getInputType(schema.type), [type, schema.type]);
	const { optionComponentSize } = uiSchema;

	const componentSize = get(formContext, ['componentSize'], EComponentSize.Large);

	const examples = useMemo(
		() => (schema.examples ? (schema.examples as string[]).concat(schema.default ? ([schema.default] as string[]) : []) : undefined),
		[schema.examples, schema.default]
	);
	const hasErrors = useMemo(() => !isEmpty(rawErrors), [rawErrors]);
	const displayedLabel = useMemo(() => get(uiSchema, ['ui:title']) || schema.title || label, [uiSchema, schema.title, label]);

	const { useInputMask, inputMaskRegex, minLength, maxLength, max, min, valuePrefix, badge } = uiSchema;

	return (
		<div className={styles.InputContainer}>
			<KvTextField
				id={id}
				label={displayedLabel}
				size={!isEmpty(optionComponentSize) ? optionComponentSize : componentSize}
				examples={examples}
				disabled={disabled || readonly}
				readonly={readonly}
				required={required}
				maxLength={schema.maxLength ?? maxLength}
				minLength={schema.minLength ?? minLength}
				min={min}
				max={max}
				forcedFocus={autofocus}
				placeholder={placeholder}
				type={inputType}
				state={hasErrors ? EValidationState.Invalid : EValidationState.Valid}
				useInputMask={useInputMask}
				inputMaskRegex={inputMaskRegex}
				value={value || value === 0 ? value : ''}
				valuePrefix={valuePrefix}
				badge={badge}
				onTextChange={_onChange}
				onTextFieldBlur={_onBlur}
			/>
		</div>
	);
};

export default BaseInputTemplate;
