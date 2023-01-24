import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import Form, { FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { deepEquals, getSubmitButtonOptions } from '@rjsf/utils';
import classNames from 'classnames';
import { cloneDeep, isEmpty, isEqualWith } from 'lodash';
import React, { ComponentProps, ComponentType, ForwardedRef, forwardRef, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { useScroll } from '../../utils';
import { KvActionButtonText } from '../stencil-generated';
import { DEFAULT_VALIDATOR, SCROLL_OFFSET } from './config';
import { useFieldTemplateElement } from './hooks/useFieldTemplateElement';
import styles from './SchemaForm.module.scss';
import Theme from './Theme';
import { SchemaFormProps } from './types';

// Custom Theme
const ThemedForm = withTheme(Theme);
const CustomForm = <T,>({ children, ...otherProps }: PropsWithChildren<FormProps<T>>, ref?: ForwardedRef<Form<T>>) => {
	return (
		<ThemedForm {...otherProps} ref={ref}>
			{children}
		</ThemedForm>
	);
};
// Wrapping the component to avoid unnecessary re-rendering and to reduce the number of times the validator will run
const typedMemo: <K extends ComponentType<any>>(c: K, areEqual?: (prev: ComponentProps<K>, next: ComponentProps<K>) => boolean) => K = React.memo;
const CustomFormWithRef = typedMemo(
	forwardRef(CustomForm) as <H>(props: PropsWithChildren<FormProps<H>> & { ref?: ForwardedRef<Form<H>> }) => ReturnType<typeof CustomForm<H>>,
	(previousProps, nextProps) => deepEquals(previousProps, nextProps)
);

export function KvSchemaForm<T>({
	customClass,
	liveValidate,
	formData: formDataProp,
	submittedData,
	uiSchema = {},
	allowDiscardChanges,
	onChange,
	validator: validatorProp = DEFAULT_VALIDATOR,
	formReference,
	...otherProps
}: SchemaFormProps<T>) {
	const [isValid, setValid] = useState(!liveValidate);
	const [hasChanges, setHasChanges] = useState(!isEqualWith(formDataProp, submittedData));
	const [formData, setFormData] = useState(formDataProp);

	const formRef = formReference ?? useRef<Form<T>>(null);
	const fieldTemplate = useFieldTemplateElement(formRef);
	const { scrollTop } = useScroll(fieldTemplate);
	const isScrolling = useMemo(() => scrollTop - SCROLL_OFFSET > 0, [scrollTop]);
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(uiSchema);
	const hasFooter = useMemo(() => allowDiscardChanges || !norender, [allowDiscardChanges, norender]);
	const themedProps: FormProps<T> = {
		liveValidate,
		...otherProps,
		onChange: (data: IChangeEvent<T>, id?: string) => {
			const { formData: dataFormData = {} as T, errors } = data;
			const hasNewChanges = !isEqualWith(dataFormData, submittedData);
			setFormData(dataFormData);
			setHasChanges(hasNewChanges);
			setValid(liveValidate ? hasNewChanges && isEmpty(errors) : true);

			if (onChange != undefined) {
				onChange(data, id);
			}
		},
		uiSchema: {
			...uiSchema,
			'ui:submitButtonOptions': {
				props: { disabled: false },
				norender: true,
				submitText: ''
			}
		},
		formData: formData,
		validator: validatorProp
	};
	const onSubmitClick = () => {
		if (formRef?.current) {
			formRef.current.submit();
		}
	};

	const discardChanges = () => {
		setFormData(cloneDeep(submittedData) as T);
		setValid(!liveValidate);
		setHasChanges(false);
	};

	useEffect(() => {
		const hasNewChanges = !isEqualWith(formData, submittedData || {});
		setHasChanges(!isEqualWith(formData, submittedData || {}));
		setValid(liveValidate ? hasNewChanges && isValid : true);
	}, [submittedData]);

	useEffect(() => {
		setFormData(cloneDeep(formDataProp) as T);
	}, [formDataProp]);

	return (
		<div className={classNames(styles.FormContainer, customClass)}>
			<CustomFormWithRef ref={formRef} {...themedProps}></CustomFormWithRef>
			{hasFooter && (
				<div className={classNames(styles.FormFooter, { [styles.Scrolling]: isScrolling })}>
					{allowDiscardChanges && (
						<KvActionButtonText
							text="Discard Changes"
							disabled={!hasChanges}
							size={EComponentSize.Large}
							type={EActionButtonType.Tertiary}
							onClickButton={discardChanges}
						/>
					)}
					{!norender && (
						<KvActionButtonText
							text={submitText || 'Save'}
							disabled={!isValid || submitButtonProps?.disabled}
							size={EComponentSize.Large}
							type={EActionButtonType.Primary}
							onClickButton={onSubmitClick}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default KvSchemaForm;
