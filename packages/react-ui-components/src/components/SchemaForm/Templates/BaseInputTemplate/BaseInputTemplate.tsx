import { EComponentSize, EIconName, EInputFieldType, EValidationState } from '@kelvininc/ui-components';
import { isArray } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { KvTextField } from '../../../../stencil-generated';
import styles from './BaseInputTemplate.module.scss';
import { BaseInputTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { INPUT_TYPES } from './BaseInputTemplate.config';
import { JSONSchema7TypeName } from 'json-schema';
import { useFieldDescription, useFieldErrors, useFormState } from '../../contexts';
import { useSchemaFormFocusRef } from '../../hooks/entryFocus';
import { useTableCell } from '../../contexts/TableContext';

const getInputType = (type?: JSONSchema7TypeName | JSONSchema7TypeName[]) => (type && !isArray(type) ? INPUT_TYPES[type] ?? EInputFieldType.Text : EInputFieldType.Text);

const BaseInputTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	label,
	placeholder,
	readonly,
	disabled,
	value,
	onChange,
	onFocus,
	onBlur,
	autofocus,
	options,
	schema,
	rawErrors = [],
	uiSchema = {},
	formContext,
	type
}: BaseInputTemplateProps<T, S, F>) => {
	const { trackFieldChange, markFieldAsTouched } = useFormState();
	const cell = useTableCell(id);
	const accessibleDescriptionElements = useFieldDescription(id);
	const focusRef = useSchemaFormFocusRef<HTMLKvTextFieldElement>(disabled || readonly);

	const baseType = useMemo(() => type ?? getInputType(schema.type), [type, schema.type]);

	const isPasswordField = useMemo(() => {
		return baseType === EInputFieldType.Password;
	}, [baseType]);

	const [showPassword, setShowPassword] = useState(false);

	const _onChange = useCallback(
		(event: CustomEvent<string>) => {
			const newValue = event?.detail ? event.detail : options.emptyValue;
			trackFieldChange(id, newValue);
			onChange(newValue);
		},
		[onChange, options, trackFieldChange, id]
	);

	const _onBlur = useCallback(
		(event: CustomEvent<string>) => {
			markFieldAsTouched(id);
			onBlur(id, event.detail);
		},
		[onBlur, markFieldAsTouched, id]
	);

	const _onFocus = useCallback(
		(event: CustomEvent<string>) => {
			markFieldAsTouched(id);
			onFocus(id, event.detail);
		},
		[onFocus, markFieldAsTouched, id]
	);

	const inputType = useMemo(() => {
		if (isPasswordField && showPassword) {
			return EInputFieldType.Text;
		}
		return baseType;
	}, [isPasswordField, showPassword, baseType]);

	const togglePasswordVisibility = useCallback(() => {
		setShowPassword(prev => !prev);
	}, []);

	const passwordIcon = useMemo(() => {
		if (!isPasswordField) return undefined;
		return showPassword ? EIconName.EyeClosed : EIconName.Eye;
	}, [isPasswordField, showPassword]);

	const { componentSize: optionComponentSize, useInputMask, inputMaskRegex, valuePrefix, badge } = uiSchema;
	const { componentSize = EComponentSize.Large } = formContext as F;
	const { maximum = uiSchema.max, minimum = uiSchema.min, maxLength = uiSchema.maxLength, minLength = uiSchema.minLength } = schema;

	const examples = useMemo(
		() => (schema.examples ? (schema.examples as string[]).concat(schema.default ? ([schema.default] as string[]) : []) : undefined),
		[schema.examples, schema.default]
	);

	const shouldUseInputMask = useMemo(
		() => (uiSchema.useInputMask === undefined && inputType === EInputFieldType.Number ? false : uiSchema.useInputMask),
		[uiSchema.useInputMask, inputType]
	);

	const hasErrors = useFieldErrors(id, rawErrors);

	return (
		<div className={styles.InputContainer}>
			<KvTextField
				ref={focusRef}
				id={id}
				accessibleLabel={cell?.accessibleLabel ?? label}
				accessibleDescriptionElements={accessibleDescriptionElements}
				size={optionComponentSize ?? componentSize}
				examples={examples}
				inputDisabled={disabled || readonly}
				inputReadonly={readonly}
				maxLength={maxLength}
				minLength={minLength}
				min={minimum}
				max={maximum}
				forcedFocus={autofocus}
				placeholder={placeholder}
				type={inputType}
				state={hasErrors ? EValidationState.Invalid : EValidationState.Valid}
				useInputMask={shouldUseInputMask}
				inputMaskRegex={inputMaskRegex}
				value={value || value === 0 ? value : ''}
				valuePrefix={valuePrefix}
				badge={badge}
				actionIcon={passwordIcon}
				onTextChange={_onChange}
				onTextFieldBlur={_onBlur}
				onTextFieldFocus={_onFocus}
				onRightActionClick={isPasswordField ? togglePasswordVisibility : undefined}
			/>
		</div>
	);
};

export default BaseInputTemplate;
