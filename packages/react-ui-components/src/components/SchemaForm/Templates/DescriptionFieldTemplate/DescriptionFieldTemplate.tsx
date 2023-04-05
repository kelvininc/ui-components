import React from 'react';
import { DescriptionFieldProps } from '@rjsf/utils';
import { KvInfoLabel } from '../../../stencil-generated';
import styles from './DescriptionFieldTemplate.module.scss';
import { isString } from 'lodash';
import { stringHelper } from '@kelvininc/ui-components';

const DescriptionFieldTemplate = ({ description }: DescriptionFieldProps) => {
	if (isString(description) && stringHelper.isValidLabel(description)) {
		return (
			<div className={styles.DescriptionContainer}>
				<KvInfoLabel description={description} />
			</div>
		);
	}

	return null;
};

export default DescriptionFieldTemplate;
