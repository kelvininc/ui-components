import { EValidationState } from '@kelvininc/ui-components';
import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import { isEmpty, merge } from 'lodash';
import React, { useMemo } from 'react';
import { KvFormHelpText } from '../../../stencil-generated';
import styles from './FieldTemplate.module.scss';
import buildDefaultHelperText from './utils';

const FieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const {
		id,
		children,
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
		registry,
		formContext
	} = props;
	const uiOptions = getUiOptions<T, S, F>(uiSchema);
	const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>('WrapIfAdditionalTemplate', registry, uiOptions);
	const defaultHelperOptions = useMemo(() => merge(formContext, uiOptions), [formContext, uiOptions]);
	const displayedHelper = useMemo(() => rawHelp ?? buildDefaultHelperText(defaultHelperOptions, schema.default), [defaultHelperOptions, schema.default, rawHelp]);

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
				{(!isEmpty(rawErrors) || rawDescription) && (
					<KvFormHelpText
						helpText={isEmpty(rawErrors) ? rawDescription : rawErrors}
						state={isEmpty(rawErrors) ? EValidationState.None : EValidationState.Invalid}
					></KvFormHelpText>
				)}
				{isEmpty(rawErrors) && displayedHelper && <KvFormHelpText helpText={displayedHelper}></KvFormHelpText>}
			</div>
		</WrapIfAdditionalTemplate>
	);
};

export default FieldTemplate;
