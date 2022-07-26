import { EActionButtonType, EComponentSize } from '@kelvininc/ui-components';
import { utils, WidgetProps } from '@rjsf/core';
import React from 'react';
import { KvActionButtonText } from '../../../stencil-generated';
import styles from './SubmitButton.module.scss';

const { getSubmitButtonOptions } = utils;

const SubmitButton: React.FC<WidgetProps> = props => {
	const { submitText, norender, props: submitButtonProps } = getSubmitButtonOptions(props.uiSchema);

	if (norender) return null;

	return (
		<button tabIndex={-1} className={styles['reset-button-style']} type="submit">
			<KvActionButtonText text={submitText || 'Submit'} size={EComponentSize.Large} type={EActionButtonType.Primary} {...submitButtonProps}></KvActionButtonText>
		</button>
	);
};

export default SubmitButton;
