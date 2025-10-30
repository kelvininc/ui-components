import { EValidationState } from '@kelvininc/ui-components';
import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import { get, isEmpty, merge } from 'lodash';
import React, { useMemo } from 'react';
import { KvFormHelpText } from '../../../../stencil-generated';
import styles from './FieldTemplate.module.scss';
import buildDefaultHelperText from './utils';
import { EDescriptionPosition } from '../../types';
import classNames from 'classnames';
import { useFormState } from '../../contexts';

const FieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const {
		id,
		children,
		rawErrors = [],
		rawDescription,
		classNames: customClasses,
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
	const { isFieldTouched, isFormSubmitted } = useFormState();
	const uiOptions = getUiOptions<T, S, F>(uiSchema);
	const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, uiOptions);
	const WrapIfAdditionalTemplate = getTemplate<'WrapIfAdditionalTemplate', T, S, F>('WrapIfAdditionalTemplate', registry, uiOptions);
	const defaultHelperOptions = useMemo(() => merge(formContext, uiOptions), [formContext, uiOptions]);
	const displayedHelper = useMemo(() => buildDefaultHelperText(defaultHelperOptions, schema.default), [defaultHelperOptions, schema.default]);
	const descriptionPosition = useMemo(
		() => (uiOptions.descriptionPosition as EDescriptionPosition) ?? (schema.type === 'object' ? EDescriptionPosition.Top : EDescriptionPosition.Bottom),
		[]
	);
	const title = get(uiSchema, ['ui:title'], schema.title ?? label);

	// Show errors if the field has been touched OR if the form has been submitted
	const shouldShowErrors = isFieldTouched(id) || isFormSubmitted;
	const displayedErrors = shouldShowErrors ? rawErrors : [];

	return (
		<WrapIfAdditionalTemplate
			classNames={customClasses}
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
				{title && (
					<TitleFieldTemplate id={`${id}-title`} title={title} schema={schema} uiSchema={uiSchema} registry={registry} required={required && schema.type !== 'object'} />
				)}
				{descriptionPosition === EDescriptionPosition.Bottom && children}
				{(!isEmpty(displayedErrors) || rawDescription) && (
					<div className={classNames({ [styles.TopDescription]: descriptionPosition === EDescriptionPosition.Top })}>
						<KvFormHelpText
							helpText={isEmpty(displayedErrors) ? rawDescription : displayedErrors}
							state={isEmpty(displayedErrors) ? EValidationState.None : EValidationState.Invalid}
						></KvFormHelpText>
					</div>
				)}
				{descriptionPosition === EDescriptionPosition.Top && <div className={styles.WithTopDescription}>{children}</div>}
				{displayedHelper && <KvFormHelpText helpText={displayedHelper}></KvFormHelpText>}
			</div>
		</WrapIfAdditionalTemplate>
	);
};

export default FieldTemplate;
