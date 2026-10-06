import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import Form, { FormProps, FormState, IChangeEvent, withTheme } from '@rjsf/core';
import {
	RJSFSchema,
	StrictRJSFSchema,
	FormContextType,
	UiSchema,
	ValidationData,
	createSchemaUtils,
	deepEquals,
	getSubmitButtonOptions,
	toErrorList,
	validationDataMerge
} from '@rjsf/utils';
import classNames from 'classnames';
import { cloneDeep, isEmpty } from 'lodash';
import React, { ComponentProps, ComponentType, ForwardedRef, forwardRef, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useScroll } from '../../hooks';
import { KvActionButtonText, KvSwitchButton, KvTooltip } from '../../stencil-generated';
import { SCROLL_OFFSET } from './config';
import { FormStateProvider } from './contexts';
import { useFieldTemplateElement } from './hooks/useFieldTemplateElement';
import styles from './SchemaForm.module.scss';
import { generateTheme } from './Theme';
import { EApplyDefaults, SchemaFormContext, SchemaFormProps } from './types';
import { buildDefaultFormStateBehavior, getDefaultValidator, getInitialFormData, normalizeSchema } from '../../utils';
import { humanizeSchemaErrors, pruneOptionErrors, sanitizeExtraErrors } from './rjsf/errors';
import { areValidationConfigsEqual, getValidationConfig } from './rjsf/Form';
import withGuardedTheme from './rjsf/withTheme';
import { areSettingsEqual, mergeUiSchemas } from './rjsf/merge';

function useStableValue<V>(value: V, equal: (previous: V, next: V) => boolean = areSettingsEqual): V {
	const [previous, setPrevious] = useState(value);
	if (!equal(previous, value)) {
		setPrevious(() => value);
		return value;
	}
	return previous;
}

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
function StatefulCustomForm<T, S extends StrictRJSFSchema, F extends FormContextType>(props: FormProps<T, S, F>, ref: ForwardedRef<Form<T, S, F>>) {
	const ThemedForm = useMemo(() => withGuardedTheme<T, S, F>(generateTheme<T, S, F>()), []);
	return <ThemedForm {...props} ref={ref} />;
}
// Wrapping the component to avoid unnecessary re-rendering and to reduce the number of times the validator will run
const typedMemo: <K extends ComponentType<any>>(c: K, areEqual?: (prev: ComponentProps<K>, next: ComponentProps<K>) => boolean) => K = React.memo;
const CustomFormWithRef = typedMemo(
	forwardRef(StatefulCustomForm) as <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
		props: PropsWithChildren<FormProps<T, S, F>> & { ref?: ForwardedRef<Form<T, S, F>> }
	) => ReturnType<typeof CustomForm<T, S, F>>,
	(previousProps, nextProps) => previousProps.validator === nextProps.validator && areSettingsEqual(previousProps, nextProps)
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
	extraErrors: extraErrorsProp,
	extraErrorsBlockSubmit,
	transformErrors: transformErrorsProp,
	humanizeErrors = true,
	...otherProps
}: SchemaFormProps<T, S, SchemaFormContext>) {
	const [isValid, setValid] = useState(!liveValidate);
	const [isFormSubmitted, setFormSubmitted] = useState(false);
	const [fieldStatesResetKey, setFieldStatesResetKey] = useState(0);
	const sanitized = useMemo(() => sanitizeExtraErrors<T>(extraErrorsProp), [extraErrorsProp]);
	const extraErrors = useStableValue(sanitized);
	const serverErrors = useMemo(() => toErrorList(extraErrors), [extraErrors]);
	const experimental_defaultFormStateBehavior = useMemo(() => buildDefaultFormStateBehavior(applyDefaults), [applyDefaults]);
	const formValidator = useMemo(() => validatorProp ?? getDefaultValidator<T, S, SchemaFormContext>(), [validatorProp]);
	const { schema: normalizedSchema, uiSchema: normalizedUiSchema } = useMemo(() => normalizeSchema(schemaProp), [schemaProp]);
	const schema = useStableValue(normalizedSchema);
	const transformErrors = useCallback<NonNullable<FormProps<T, S, SchemaFormContext>['transformErrors']>>(
		(errors, errorsUiSchema) => {
			const pruned = pruneOptionErrors(errors, schema);
			const messages = humanizeErrors ? humanizeSchemaErrors(pruned) : pruned;
			return transformErrorsProp?.(messages, errorsUiSchema) ?? messages;
		},
		[schema, humanizeErrors, transformErrorsProp]
	);
	const mergedUiSchema = useStableValue(
		useMemo(() => mergeUiSchemas<T, S, SchemaFormContext>(normalizedUiSchema as UiSchema<T, S, SchemaFormContext>, uiSchema), [normalizedUiSchema, uiSchema])
	);
	const formUiSchema = useStableValue({ ...mergedUiSchema, 'ui:submitButtonOptions': { props: { disabled: false }, norender: true, submitText: '' } });
	const formData = useMemo(() => cloneDeep(getInitialFormData(schema, formDataProp, formValidator, applyDefaults, false)), [formValidator, schema, formDataProp, applyDefaults]);
	// Preserve current edits across settings updates. Ordinary widget changes stay inside
	// RJSF, so echoing props doesn't erase the errors those widgets raise through onChange.
	const inputs = useStableValue(
		{
			...otherProps,
			onChange,
			submittedData,
			schema,
			uiSchema: formUiSchema,
			formData: formDataProp,
			validator: formValidator,
			transformErrors,
			liveValidate,
			disabled,
			omitExtraData,
			liveOmit,
			extraErrors,
			extraErrorsBlockSubmit,
			experimental_defaultFormStateBehavior
		},
		(previous, next) => previous.validator === next.validator && areSettingsEqual(previous, next)
	);
	const [dataState, setDataState] = useState({ inputs, boundary: formData, edited: formData, formData });
	let currentFormData = dataState.formData;
	if (dataState.inputs !== inputs) {
		const externalChanged = !deepEquals(dataState.inputs.formData, formDataProp);
		const pristine = deepEquals(dataState.edited, dataState.boundary);
		currentFormData = externalChanged || pristine ? formData : dataState.edited;
		setDataState({ inputs, boundary: formData, edited: currentFormData, formData: currentFormData });
	}

	const savedData = submittedData === undefined ? ({} as T) : submittedData;
	const [hasChanges, setHasChanges] = useState(!deepEquals(formData, savedData));
	const [isShowingAllErrors, setShowingAllErrors] = useState(false);

	const localFormRef = useRef<Form<T, S, SchemaFormContext>>(null);
	const formRef = formReference ?? localFormRef;
	const fieldTemplate = useFieldTemplateElement(formRef);
	const { scrollTop } = useScroll(fieldTemplate);
	const isScrolling = useMemo(() => scrollTop - SCROLL_OFFSET > 0, [scrollTop]);
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(uiSchema);
	const hasFooter = allowDiscardChanges || allowResetToDefaults || !norender;
	const defaults = useMemo<T>(() => {
		const schemaUtils = createSchemaUtils(formValidator, schema);
		return schemaUtils.getDefaultFormState(schema) as T;
	}, [formValidator, schema]);
	const [hasDefaults, setHasDefaults] = useState(!isEmpty(defaults) && !deepEquals(defaults, formData));
	const syncStatus = useCallback(
		(data: IChangeEvent<T, S, SchemaFormContext> & Partial<Pick<FormState<T, S, SchemaFormContext>, 'schemaValidationErrors'>>) => {
			const changed = !deepEquals(data.formData, submittedData === undefined ? {} : submittedData);
			// Count server messages individually: an identical validator message still blocks.
			const counts = new Map<string, number>();
			const key = ({ property, message }: (typeof serverErrors)[number]) => JSON.stringify([property, message]);
			serverErrors.forEach(error => counts.set(key(error), (counts.get(key(error)) ?? 0) + 1));
			const hasFieldErrors = toErrorList(data.errorSchema).some(error => {
				const count = counts.get(key(error)) ?? 0;
				if (count) counts.set(key(error), count - 1);
				return !count;
			});
			const blocked = Boolean(data.schemaValidationErrors?.length || hasFieldErrors || (extraErrorsBlockSubmit && serverErrors.length));
			setHasChanges(changed);
			setHasDefaults(!isEmpty(defaults) && !deepEquals(defaults, data.formData));
			setValid(!liveValidate || (changed && (otherProps.noValidate || !blocked)));
		},
		[submittedData, defaults, liveValidate, otherProps.noValidate, serverErrors, extraErrorsBlockSubmit]
	);

	const onFormChange = useCallback(
		(data: IChangeEvent<T, S, SchemaFormContext>, id?: string) => {
			setDataState(previous => ({ ...previous, edited: data.formData }));
			syncStatus(data);
			onChange?.(data, id);
		},
		[onChange, syncStatus]
	);
	const onFormSubmit = useCallback<NonNullable<FormProps<T, S, SchemaFormContext>['onSubmit']>>(
		(data, event) => {
			setFormSubmitted(true);
			setDataState(previous => ({ ...previous, edited: data.formData }));
			syncStatus(data);
			otherProps.onSubmit?.(data, event);
		},
		[syncStatus, otherProps.onSubmit]
	);
	const onFormError = useCallback<NonNullable<FormProps<T, S, SchemaFormContext>['onError']>>(
		errors => {
			setFormSubmitted(true);
			otherProps.onError?.(errors);
		},
		[otherProps.onError]
	);
	const themedProps: FormProps<T, S, SchemaFormContext> = {
		disabled,
		liveValidate,
		schema,
		...otherProps,
		omitExtraData,
		liveOmit,
		extraErrors,
		extraErrorsBlockSubmit,
		transformErrors,
		onChange: onFormChange,
		onSubmit: onFormSubmit,
		onError: onFormError,
		uiSchema: formUiSchema,
		formContext: {
			...otherProps.formContext,
			...uiSchema['ui:options']
		} as SchemaFormContext,
		formData: currentFormData,
		validator: formValidator,
		experimental_defaultFormStateBehavior
	};

	const stableThemedProps = useStableValue(themedProps, (previous, next) => previous.validator === next.validator && areSettingsEqual(previous, next));
	const validationConfig = useStableValue(getValidationConfig(stableThemedProps), areValidationConfigsEqual);
	const committedValidationConfig = useRef(validationConfig);

	const onSubmitClick = () => {
		setFormSubmitted(true);
		formRef.current?.submit();
	};

	const discardChanges = () => {
		const restoredData = cloneDeep(getInitialFormData(schema, submittedData, formValidator, applyDefaults, false));
		setDataState(previous => ({ ...previous, edited: restoredData, formData: restoredData }));
		setValid(!liveValidate);
		setHasChanges(false);
		setFormSubmitted(false);
		setFieldStatesResetKey(key => key + 1);
		onChange?.({ formData: submittedData } as IChangeEvent<T, S, SchemaFormContext>);
	};

	const resetToDefaults = () => {
		if (formRef.current) {
			setDataState(previous => ({ ...previous, edited: defaults, formData: defaults }));
			const validation: ValidationData<T> = otherProps.noValidate ? { errors: [], errorSchema: {} } : formRef.current.validate(defaults);
			onFormChange({
				...formRef.current.state,
				formData: defaults,
				schemaValidationErrors: validation.errors,
				schemaValidationErrorSchema: validation.errorSchema,
				...validationDataMerge(validation, extraErrors)
			} as IChangeEvent<T, S, SchemaFormContext>);
		}
	};

	const previousSubmittedData = useRef(submittedData);
	useEffect(() => {
		if (!deepEquals(previousSubmittedData.current, submittedData)) {
			previousSubmittedData.current = submittedData;
			setFormSubmitted(false);
		}
	}, [submittedData]);

	/** Refresh from committed props and current edits, without RJSF's cached retrievedSchema.
	 * That cache merges old error trees, retaining cleared server errors. Refreshing drops
	 * errors custom widgets supply through onChange; schema and server errors are rebuilt.
	 */
	useEffect(() => {
		const form = formRef.current;
		if (!form) return;
		const refreshValidation = !areValidationConfigsEqual(committedValidationConfig.current, validationConfig);
		let active = true;
		const isCurrent = (props: FormProps<T, S, SchemaFormContext>) =>
			areValidationConfigsEqual(getValidationConfig(props), validationConfig) && deepEquals(props.formData, currentFormData);
		form.setState(
			(state, props) => (active && isCurrent(props) && refreshValidation ? form.getStateFromProps(props, state.formData) : null),
			() => {
				if (active && isCurrent(form.props)) {
					committedValidationConfig.current = validationConfig;
					syncStatus(form.state as IChangeEvent<T, S, SchemaFormContext>);
				}
			}
		);
		return () => {
			active = false;
		};
	}, [formRef, stableThemedProps, validationConfig, syncStatus]);

	return (
		<FormStateProvider initialFormData={formData} displayErrors={isFormSubmitted || displayErrors || isShowingAllErrors} resetKey={fieldStatesResetKey}>
			<div className={classNames(styles.FormContainer, customClass)}>
				{showErrorsSwitch && (
					<div className={styles.Action}>
						<KvSwitchButton
							accessibleLabel="Show All Errors"
							checked={isShowingAllErrors}
							onSwitchChange={({ detail: newValue }) => setShowingAllErrors(newValue)}
							size={EComponentSize.Small}
						/>
						<div className={styles.Text}>Show All Errors</div>
					</div>
				)}
				<CustomFormWithRef<T, S, SchemaFormContext> ref={formRef} {...stableThemedProps} />
				{hasFooter && (
					<div className={classNames(styles.FormFooter, { [styles.Scrolling]: isScrolling })}>
						<div className={styles.LeftFooter}>
							{allowResetToDefaults && (
								<KvActionButtonText
									text="Reset to Default"
									disabled={disabled || !hasDefaults}
									size={EComponentSize.Large}
									type={EActionButtonType.Tertiary}
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
