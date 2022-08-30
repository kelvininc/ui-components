import { EValidationState } from '@kelvininc/ui-components';
import { AjvError, ErrorListProps } from '@rjsf/core';
import { isEmpty } from 'lodash-es';
import React from 'react';
import { KvFormHelpText } from '../../stencil-generated';
import styles from './ErrorList.module.scss';

const ErrorList = ({ errors }: ErrorListProps) => {
	const errorsHash: { [prop: string]: string[] } = errors.reduce<Record<string, string[]>>((acc, error: AjvError) => {
		if (isEmpty(acc[error.property])) {
			acc[error.property] = [`${error.property} ${error.message}`];
		} else {
			acc[error.property].push(`${error.property} ${error.message}`);
		}
		return acc;
	}, {});

	return (
		<div className={styles['error-list-container']}>
			<KvFormHelpText helpText={['ERRORS LIST:']}></KvFormHelpText>
			{Object.keys(errorsHash).map((fieldName: string) => {
				return <KvFormHelpText key={fieldName} helpText={errorsHash[fieldName]} state={EValidationState.Invalid}></KvFormHelpText>;
			})}
		</div>
	);
};

export default ErrorList;
