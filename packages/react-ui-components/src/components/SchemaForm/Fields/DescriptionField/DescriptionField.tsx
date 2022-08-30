import React from 'react';
import { FieldProps } from '@rjsf/core';
import { KvInfoLabel } from '../../../stencil-generated';
import styles from './DescriptionField.module.scss';

export interface DescriptionFieldProps extends Partial<FieldProps> {
	description?: string;
}

const DescriptionField = ({ description }: Partial<FieldProps>) => {
	if (description) {
		return (
			<div className={styles['description-container']}>
				<KvInfoLabel labelTitle="" description={description} />
			</div>
		);
	}

	return null;
};

export default DescriptionField;
