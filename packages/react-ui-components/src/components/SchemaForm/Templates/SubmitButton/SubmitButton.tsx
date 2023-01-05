import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import { getSubmitButtonOptions, SubmitButtonProps } from '@rjsf/utils';
import React from 'react';
import { KvActionButtonText } from '../../../stencil-generated';
import styles from './SubmitButton.module.scss';

const SubmitButton: React.ComponentType<SubmitButtonProps> = (props: SubmitButtonProps) => {
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(props.uiSchema);

	if (norender) return null;

	return (
		<button tabIndex={-1} className={styles.ResetButtonStyle} type="submit">
			<KvActionButtonText text={submitText || 'Submit'} size={EComponentSize.Large} type={EActionButtonType.Primary} {...submitButtonProps}></KvActionButtonText>
		</button>
	);
};

export default SubmitButton;
