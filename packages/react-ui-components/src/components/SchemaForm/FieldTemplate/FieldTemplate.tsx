import { EValidationState } from '@kelvininc/ui-components';
import { FieldTemplateProps } from '@rjsf/core';
import { isEmpty } from 'lodash-es';
import React from 'react';
import { KvFormHelpText } from '../../stencil-generated';
import styles from './FieldTemplate.module.scss';
import WrapIfAdditional from './WrapIfAdditional';

const FieldTemplate = ({
	id,
	children,
	displayLabel,
	rawErrors = [],
	rawHelp,
	rawDescription,
	classNames,
	disabled,
	label,
	onDropPropertyClick,
	onKeyChange,
	readonly,
	required,
	schema
}: FieldTemplateProps) => {
	return (
		<WrapIfAdditional
			classNames={classNames}
			disabled={disabled}
			id={id}
			label={label}
			onDropPropertyClick={onDropPropertyClick}
			onKeyChange={onKeyChange}
			readonly={readonly}
			required={required}
			schema={schema}
		>
			<div className={styles['field-wrapper']}>
				{children}
				{(!isEmpty(rawErrors) || (displayLabel && rawDescription)) && (
					<KvFormHelpText
						helpText={isEmpty(rawErrors) ? rawDescription : rawErrors}
						state={isEmpty(rawErrors) ? EValidationState.None : EValidationState.Invalid}
					></KvFormHelpText>
				)}
				{isEmpty(rawErrors) && rawHelp && <KvFormHelpText helpText={rawHelp}></KvFormHelpText>}
			</div>
		</WrapIfAdditional>
	);
};

export default FieldTemplate;
