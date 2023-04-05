import { TitleFieldProps } from '@rjsf/utils';
import { get } from 'lodash';
import React from 'react';
import { KvInfoLabel } from '../../../stencil-generated';
import { stringHelper } from '@kelvininc/ui-components';
import styles from './TitleFieldTemplate.module.scss';

const TitleFieldTemplate = ({ title, uiSchema, required }: TitleFieldProps): any => {
	const titleToShow = get(uiSchema, ['ui:title'], title);
	return (
		stringHelper.isValidLabel(titleToShow) && (
			<div className={styles.TitleContainer}>
				{required && <span className={styles.Required}>*</span>}
				<KvInfoLabel labelTitle={titleToShow || ''} />
			</div>
		)
	);
};

export default TitleFieldTemplate;
