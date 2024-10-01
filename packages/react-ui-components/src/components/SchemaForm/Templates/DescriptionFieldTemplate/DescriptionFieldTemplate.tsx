import React from 'react';
import { DescriptionFieldProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { KvInfoLabel } from '../../../../stencil-generated/components';
import styles from './DescriptionFieldTemplate.module.scss';
import { isString } from 'lodash';
import { stringHelper } from '@kelvininc/ui-components';

const DescriptionFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ description }: DescriptionFieldProps<T, S, F>) => {
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
