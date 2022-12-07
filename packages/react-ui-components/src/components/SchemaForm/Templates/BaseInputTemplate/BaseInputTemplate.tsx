import { EInputFieldType, EValidationState } from '@kelvininc/ui-components';
import classNames from 'classnames';
import { get, isArray, isEmpty } from 'lodash-es';
import React, { useCallback, useMemo } from 'react';
import { KvTextField } from '../../../stencil-generated';
import styles from './BaseInputTemplate.module.scss';
import { WidgetProps } from '@rjsf/utils';
import { INPUT_TYPES } from './BaseInputTemplate.config';
import { JSONSchema7TypeName } from 'json-schema';

const getInputType = (type?: JSONSchema7TypeName | JSONSchema7TypeName[]) => (type && !isArray(type) ? INPUT_TYPES[type] ?? EInputFieldType.Text : EInputFieldType.Text);

const BaseInputTemplate = ({
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
	uiSchema,
	type
}: WidgetProps) => {
	const _onChange = useCallback((value: CustomEvent<string>) => onChange(value?.detail ? value.detail : options.emptyValue), [onChange, options]);
	const _onBlur = useCallback((value: CustomEvent<string>) => onBlur(id, value.detail), [onBlur, id]);
	const inputType = useMemo(() => type ?? getInputType(schema.type), [type, schema.type]);
	const examples = useMemo(() => (schema.examples ? (schema.examples as string[]).concat(schema.default ? ([schema.default] as string[]) : []) : undefined), [schema.examples]);
	const hasErrors = useMemo(() => !isEmpty(rawErrors), [rawErrors]);
	const hasDescription = useMemo(() => !!get(schema, 'description', false) || !!get(uiSchema, ['ui:description'], false), [uiSchema, schema.description]);
	const displayedLabel = useMemo(() => get(uiSchema, ['ui:title']) || schema.title || label, [uiSchema, schema.title, label]);
	return (
		<div
			className={classNames(styles.InputContainer, {
				[styles.HasErrors]: hasErrors,
				[styles.HasLabel]: !!displayedLabel && displayedLabel != ' ',
				[styles.HasDescription]: hasDescription
			})}
		>
			<KvTextField
				id={id}
				label={displayedLabel}
				examples={examples}
				disabled={disabled || readonly}
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

export default BaseInputTemplate;
