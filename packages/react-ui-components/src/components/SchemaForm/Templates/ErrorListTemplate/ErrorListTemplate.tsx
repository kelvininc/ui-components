import { EValidationState } from '@kelvininc/ui-components';
import { ErrorListProps, FormContextType, RJSFSchema, RJSFValidationError, StrictRJSFSchema } from '@rjsf/utils';
import { isEmpty } from 'lodash';
import React from 'react';
import { KvFormHelpText } from '../../../../stencil-generated/components';
import styles from './ErrorListTemplate.module.scss';

const ErrorListTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ errors }: ErrorListProps<T, S, F>) => {
	const errorsHash: { [prop: string]: string[] } = errors.reduce<Record<string, string[]>>((acc, error: RJSFValidationError) => {
		if (!error.property) return acc;
		if (isEmpty(acc[error.property])) {
			acc[error.property] = [`${error.property} ${error.message}`];
		} else {
			acc[error.property].push(`${error.property} ${error.message}`);
		}
		return acc;
	}, {});

	return (
		<div className={styles.ErrorListContainer}>
			<KvFormHelpText helpText={['ERRORS LIST:']}></KvFormHelpText>
			{Object.keys(errorsHash).map((fieldName: string) => {
				return <KvFormHelpText key={fieldName} helpText={errorsHash[fieldName]} state={EValidationState.Invalid}></KvFormHelpText>;
			})}
		</div>
	);
};

export default ErrorListTemplate;
