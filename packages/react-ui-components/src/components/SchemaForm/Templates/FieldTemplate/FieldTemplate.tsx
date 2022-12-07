import { EValidationState } from '@kelvininc/ui-components';
import { FieldTemplateProps, getTemplate, getUiOptions } from '@rjsf/utils';
import { isEmpty } from 'lodash-es';
import React from 'react';
import { KvFormHelpText } from '../../../stencil-generated';
import styles from './FieldTemplate.module.scss';

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
	schema,
	uiSchema,
	registry
}: FieldTemplateProps) => {
	const uiOptions = getUiOptions(uiSchema);
	const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate'>('WrapIfAdditionalTemplate', registry, uiOptions);
	return (
		<WrapIfAdditionalTemplate
			classNames={classNames}
			disabled={disabled}
			id={id}
			label={label}
			onDropPropertyClick={onDropPropertyClick}
			onKeyChange={onKeyChange}
			readonly={readonly}
			required={required}
			schema={schema}
			uiSchema={uiSchema}
			registry={registry}
		>
			<div className={styles.FieldWrapper}>
				{children}
				{(!isEmpty(rawErrors) || (displayLabel && rawDescription)) && (
					<KvFormHelpText
						helpText={isEmpty(rawErrors) ? rawDescription : rawErrors}
						state={isEmpty(rawErrors) ? EValidationState.None : EValidationState.Invalid}
					></KvFormHelpText>
				)}
				{isEmpty(rawErrors) && rawHelp && <KvFormHelpText helpText={rawHelp}></KvFormHelpText>}
			</div>
		</WrapIfAdditionalTemplate>
	);
};

export default FieldTemplate;
