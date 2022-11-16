import React from 'react';
import { WidgetProps } from '@rjsf/core';
import styles from './ReadOnlyValueWidget.module.scss';

const ReadOnlyValueWidget = ({ value }: WidgetProps) => {
	return <>{value && <span className={styles['value-label']}>{value}</span>}</>;
};

export default ReadOnlyValueWidget;
