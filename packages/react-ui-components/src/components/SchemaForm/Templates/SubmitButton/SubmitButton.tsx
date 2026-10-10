import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import { FormContextType, getSubmitButtonOptions, RJSFSchema, StrictRJSFSchema, SubmitButtonProps } from '@rjsf/utils';
import React from 'react';
import { KvActionButtonText } from '../../../../stencil-generated';
import styles from './SubmitButton.module.scss';
import { SCHEMA_FORM_STRINGS } from '../../strings';

const SubmitButton = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: SubmitButtonProps<T, S, F>) => {
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(props.uiSchema);

	if (norender) return null;

	return (
		<button tabIndex={-1} className={styles.ResetButtonStyle} type="submit">
			<KvActionButtonText
				text={submitText || SCHEMA_FORM_STRINGS.submit}
				size={EComponentSize.Large}
				type={EActionButtonType.Primary}
				{...submitButtonProps}
			></KvActionButtonText>
		</button>
	);
};

export default SubmitButton;
