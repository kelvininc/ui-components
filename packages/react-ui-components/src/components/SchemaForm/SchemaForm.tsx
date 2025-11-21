import { EActionButtonType, EComponentSize, KvActionButtonTextCustomEvent } from '@kelvininc/ui-components';
import Form, { FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { RJSFSchema, StrictRJSFSchema, FormContextType, createSchemaUtils, deepEquals, getSubmitButtonOptions } from '@rjsf/utils';
import classNames from 'classnames';
import { cloneDeep, isEmpty, isEqualWith, merge } from 'lodash';
import React, { ComponentProps, ComponentType, FormEvent, ForwardedRef, forwardRef, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useScroll } from '../../hooks';
import { KvActionButtonText, KvSwitchButton, KvTooltip } from '../../stencil-generated';
import { SCROLL_OFFSET } from './config';
import { FormStateProvider } from './contexts';
import { useFieldTemplateElement } from './hooks/useFieldTemplateElement';
import styles from './SchemaForm.module.scss';
import { generateTheme } from './Theme';
import { EApplyDefaults, SchemaFormContext, SchemaFormProps } from './types';
import { buildDefaultFormStateBehavior, getDefaultValidator, getInitialFormData, normalizeSchema } from '../../utils';

// Custom Theme
export function generateForm<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(): ComponentType<FormProps<T, S, F>> {
	return withTheme<T, S, F>(generateTheme<T, S, F>());
}

export function CustomForm<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
	{ children, ...otherProps }: PropsWithChildren<FormProps<T, S, F>>,
	ref?: ForwardedRef<Form<T, S, F>>
) {
	const ThemedForm = useMemo(() => generateForm<T, S, F>(), []);
	return (
		<ThemedForm {...otherProps} ref={ref}>
			{children}
		</ThemedForm>
	);
}
// Wrapping the component to avoid unnecessary re-rendering and to reduce the number of times the validator will run
const typedMemo: <K extends ComponentType<any>>(c: K, areEqual?: (prev: ComponentProps<K>, next: ComponentProps<K>) => boolean) => K = React.memo;
const CustomFormWithRef = typedMemo(
	forwardRef(CustomForm) as <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
		props: PropsWithChildren<FormProps<T, S, F>> & { ref?: ForwardedRef<Form<T, S, F>> }
	) => ReturnType<typeof CustomForm<T, S, F>>,
	(previousProps, nextProps) => deepEquals(previousProps, nextProps)
);

export function KvSchemaForm<T, S extends StrictRJSFSchema = RJSFSchema>({
	customClass,
	liveValidate,
	formData: formDataProp,
	submittedData,
	uiSchema = {},
	allowDiscardChanges,
	allowResetToDefaults,
	onChange,
	validator: validatorProp,
	formReference,
	disabled,
	applyDefaults = EApplyDefaults.All,
	schema: schemaProp,
	omitExtraData = true,
	liveOmit = true,
	displayErrors,
	showErrorsSwitch = false,
	...otherProps
}: SchemaFormProps<T, S, SchemaFormContext>) {
	const [isValid, setValid] = useState(!liveValidate);
	const [isFormSubmitted, setFormSubmitted] = useState(false);
	const experimental_defaultFormStateBehavior = useMemo(() => buildDefaultFormStateBehavior(applyDefaults), [applyDefaults]);
	const formValidator = useMemo(() => validatorProp ?? getDefaultValidator<T, S, SchemaFormContext>(), [validatorProp]);
	const { schema, uiSchema: normalizedUiSchema } = useMemo(() => normalizeSchema(schemaProp), [schemaProp]);
	const mergedUiSchema = useMemo(() => merge({}, normalizedUiSchema, uiSchema), [normalizedUiSchema, uiSchema]);
	console.log('Merged UI Schema:', { schemaProp, normalizedUiSchema, uiSchema, schema });
	const formData = useMemo(() => cloneDeep(getInitialFormData(schema, formDataProp, formValidator, applyDefaults, false)), [formValidator, schema, formDataProp, applyDefaults]);
	const [hasChanges, setHasChanges] = useState(!isEqualWith(formData, submittedData || {}));
	const [isShowingAllErrors, setShowingAllErrors] = useState(false);

	const formRef = formReference ?? useRef<Form<T, S, SchemaFormContext>>(null);
	const fieldTemplate = useFieldTemplateElement(formRef);
	const { scrollTop } = useScroll(fieldTemplate);
	const isScrolling = useMemo(() => scrollTop - SCROLL_OFFSET > 0, [scrollTop]);
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(uiSchema);
	const hasFooter = useMemo(() => allowDiscardChanges || allowResetToDefaults || !norender, [allowDiscardChanges, norender]);
	const defaults = useMemo<T>(() => {
		const schemaUtils = createSchemaUtils(formValidator, schema);
		return schemaUtils.getDefaultFormState(schema) as T;
	}, [formValidator, schema]);
	const [hasDefaults, setHasDefaults] = useState(!isEmpty(defaults) && !isEqualWith(defaults, formData || {}) && !isEqualWith(defaults, submittedData || {}));

	const onFormChange = useCallback(
		(data: IChangeEvent<T, S, SchemaFormContext>, id?: string) => {
			const { formData: dataFormData = {} as T, errors } = data;
			const hasNewChanges = !isEqualWith(dataFormData, submittedData);
			setHasChanges(hasNewChanges);
			setValid(liveValidate ? hasNewChanges && isEmpty(errors) : true);
			onChange?.(data, id);
		},
		[submittedData, onChange, setValid, setHasChanges]
	);
	const themedProps: FormProps<T, S, SchemaFormContext> = {
		disabled,
		liveValidate,
		schema,
		...otherProps,
		onChange: onFormChange,
		uiSchema: {
			...mergedUiSchema,
			'ui:submitButtonOptions': {
				props: { disabled: false },
				norender: true,
				submitText: ''
			}
		},
		formContext: {
			...otherProps.formContext,
			...uiSchema['ui:options']
		} as SchemaFormContext,
		formData: formData,
		validator: formValidator,
		experimental_defaultFormStateBehavior
	};

	const onSubmitClick = (event: KvActionButtonTextCustomEvent<MouseEvent>) => {
		setFormSubmitted(true);
		if (formRef?.current) {
			otherProps.onSubmit?.(formRef.current.state, event as unknown as FormEvent<any>);
		}
	};

	const discardChanges = () => {
		setValid(!liveValidate);
		setHasChanges(false);
		onChange?.({ formData: submittedData } as IChangeEvent<T, S, SchemaFormContext>);
	};

	const resetToDefaults = () => {
		if (formRef.current) {
			onFormChange({ ...formRef.current.state, formData: defaults } as IChangeEvent<T, S, SchemaFormContext>);
		}
	};

	useEffect(() => {
		const hasNewChanges = !isEqualWith(formData, submittedData || {});
		setHasChanges(hasNewChanges);

		setValid(liveValidate ? hasNewChanges && isValid : true);
	}, [submittedData]);

	useEffect(() => {
		const hasDefaultsToApply = !isEmpty(defaults) && !isEqualWith(defaults, formData || {});
		setHasDefaults(hasDefaultsToApply);
	}, [defaults, formData, setHasDefaults]);

	return (
		<FormStateProvider initialFormData={formData} displayErrors={isFormSubmitted || displayErrors || isShowingAllErrors}>
			<div className={classNames(styles.FormContainer, customClass)}>
				{showErrorsSwitch && (
					<div className={styles.Action}>
						<KvSwitchButton checked={isShowingAllErrors} onSwitchChange={({ detail: newValue }) => setShowingAllErrors(newValue)} size={EComponentSize.Small} />
						<div className={styles.Text}>Show All Errors</div>
					</div>
				)}
				<CustomFormWithRef<T, S, SchemaFormContext> ref={formRef} {...themedProps} />
				{hasFooter && (
					<div className={classNames(styles.FormFooter, { [styles.Scrolling]: isScrolling })}>
						<div className={styles.LeftFooter}>
							{allowResetToDefaults && (
								<KvActionButtonText
									text="Reset to Default"
									disabled={disabled || !hasDefaults}
									size={EComponentSize.Large}
									type={EActionButtonType.Ghost}
									onClickButton={resetToDefaults}
								/>
							)}
						</div>
						<div className={styles.RightFooter}>
							{allowDiscardChanges && (
								<KvActionButtonText
									text="Discard Changes"
									disabled={disabled || !hasChanges}
									size={EComponentSize.Large}
									type={EActionButtonType.Tertiary}
									onClickButton={discardChanges}
								/>
							)}
							{!norender && (
								<KvTooltip text={submitButtonProps?.tooltipText} position={submitButtonProps?.tooltipPosition}>
									<KvActionButtonText
										text={submitText || 'Save'}
										disabled={disabled || !isValid || submitButtonProps?.disabled}
										size={EComponentSize.Large}
										type={EActionButtonType.Primary}
										onClickButton={onSubmitClick}
									/>
								</KvTooltip>
							)}
						</div>
					</div>
				)}
			</div>
		</FormStateProvider>
	);
}
