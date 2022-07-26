import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import Form, { FormProps, IChangeEvent, utils, withTheme } from '@rjsf/core';
import classNames from 'classnames';
import { cloneDeep, isEmpty, isEqualWith } from 'lodash-es';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useScroll } from '../../utils';
import { KvActionButtonText } from '../stencil-generated';
import { useFieldTemplateElement } from './hooks/useFieldTemplateElement';
import styles from './SchemaForm.module.scss';
import Theme from './Theme';

const ThemedForm = withTheme(Theme);
const { getSubmitButtonOptions } = utils;
const SCROLL_OFFSET = 10;

export interface SchemaForm<T> extends Form<T> {
	formElement: HTMLDivElement;
}

export interface SchemaFormProps<T> extends FormProps<T> {
	submittedData?: T;
	allowDiscardChanges?: boolean;
}

export function KvSchemaForm<T>({
	liveValidate,
	formData: formDataProp = {} as T,
	submittedData = {} as T,
	uiSchema = {},
	allowDiscardChanges,
	onChange,
	...otherProps
}: SchemaFormProps<T>) {
	const [isValid, setValid] = useState(!liveValidate);
	const [hasChanges, setHasChanges] = useState(!isEqualWith(formDataProp, submittedData));
	const [formData, setFormData] = useState(formDataProp || ({} as T));

	const formRef = useRef<SchemaForm<T>>(null);
	const fieldTemplate = useFieldTemplateElement(formRef);
	const { scrollTop } = useScroll(fieldTemplate);
	const isScrolling = useMemo(() => scrollTop - SCROLL_OFFSET > 0, [scrollTop]);
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(uiSchema);
	const hasFooter = useMemo(() => allowDiscardChanges || !norender, [allowDiscardChanges, norender]);

	const themedProps = {
		liveValidate,
		...otherProps,
		ref: formRef,
		onChange: (data: IChangeEvent<T>) => {
			const { formData: dataFormData = {} as T, errors } = data;
			const hasNewChanges = !isEqualWith(dataFormData, submittedData);
			setFormData(dataFormData);
			setHasChanges(hasNewChanges);
			setValid(liveValidate ? hasNewChanges && isEmpty(errors) : true);

			if (onChange != undefined) {
				onChange(data);
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
		formData: formData
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
		<div className={classNames(styles['form-container'], { [styles['no-footer']]: !hasFooter })}>
			<ThemedForm {...themedProps}>
				{hasFooter && (
					<div className={classNames(styles['form-footer'], { [styles.scrolling]: isScrolling })}>
						{allowDiscardChanges && (
							<KvActionButtonText
								text="Discard Changes"
								disabled={!hasChanges}
								size={EComponentSize.Large}
								type={EActionButtonType.Tertiary}
								onClickButton={discardChanges}
							></KvActionButtonText>
						)}
						{!norender && (
							<button tabIndex={-1} disabled={!isValid || submitButtonProps?.disabled} className={styles['reset-button-style']} type="submit">
								<KvActionButtonText
									text={submitText || 'Save'}
									disabled={!isValid || submitButtonProps?.disabled}
									size={EComponentSize.Large}
									type={EActionButtonType.Primary}
								></KvActionButtonText>
							</button>
						)}
					</div>
				)}
			</ThemedForm>
		</div>
	);
}

export default KvSchemaForm;
