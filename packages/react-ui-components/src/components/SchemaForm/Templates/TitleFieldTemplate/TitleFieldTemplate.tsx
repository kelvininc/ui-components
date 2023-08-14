import { FormContextType, RJSFSchema, StrictRJSFSchema, TitleFieldProps } from '@rjsf/utils';
import { get } from 'lodash';
import React from 'react';
import { KvInfoLabel } from '../../../stencil-generated';
import { stringHelper } from '@kelvininc/ui-components';
import styles from './TitleFieldTemplate.module.scss';

const TitleFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ title, uiSchema, required }: TitleFieldProps<T, S, F>): any => {
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
