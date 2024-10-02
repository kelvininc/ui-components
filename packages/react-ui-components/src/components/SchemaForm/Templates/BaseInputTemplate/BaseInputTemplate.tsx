import { EComponentSize, EInputFieldType, EValidationState } from '@kelvininc/ui-components';
import { isArray, isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { KvTextField } from '../../../../stencil-generated/components';
import styles from './BaseInputTemplate.module.scss';
import { BaseInputTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { INPUT_TYPES } from './BaseInputTemplate.config';
import { JSONSchema7TypeName } from 'json-schema';

const getInputType = (type?: JSONSchema7TypeName | JSONSchema7TypeName[]) => (type && !isArray(type) ? INPUT_TYPES[type] ?? EInputFieldType.Text : EInputFieldType.Text);

const BaseInputTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	placeholder,
	readonly,
	disabled,
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
	const { componentSize: optionComponentSize, useInputMask, inputMaskRegex, minLength, maxLength, max, min, valuePrefix, badge } = uiSchema;
	const { componentSize = EComponentSize.Large } = formContext as F;

	const examples = useMemo(
		() => (schema.examples ? (schema.examples as string[]).concat(schema.default ? ([schema.default] as string[]) : []) : undefined),
		[schema.examples, schema.default]
	);
	const hasErrors = useMemo(() => !isEmpty(rawErrors), [rawErrors]);

	return (
		<div className={styles.InputContainer}>
			<KvTextField
				id={id}
				size={optionComponentSize ?? componentSize}
				examples={examples}
				inputDisabled={disabled || readonly}
				inputReadonly={readonly}
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
