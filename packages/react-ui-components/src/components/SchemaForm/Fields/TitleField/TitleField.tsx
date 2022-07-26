import { FieldProps } from '@rjsf/core';
import React from 'react';
import { KvInfoLabel } from '../../../stencil-generated';
import styles from './TitleField.module.scss';

export interface TitleFieldProps extends Partial<FieldProps> {
	title: string;
	required?: boolean;
}

const TitleField = ({ title, uiSchema, required }: Partial<FieldProps>) => (
	<div className={styles['title-container']}>
		{required && <span className={styles['required']}>*</span>}
		<KvInfoLabel labelTitle={(uiSchema && uiSchema['ui:title']) || title} />
	</div>
);

export default TitleField;
