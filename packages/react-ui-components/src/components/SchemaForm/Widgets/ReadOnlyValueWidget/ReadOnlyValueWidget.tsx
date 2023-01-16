import { WidgetProps } from '@rjsf/utils';
import { get } from 'lodash';
import React from 'react';
import { getMatchingOption } from './helper';
import styles from './ReadOnlyValueWidget.module.scss';

const ReadOnlyValueWidget = ({ value, options }: WidgetProps) => {
	const { enumOptions } = options;
	const selectedOption = getMatchingOption(value, enumOptions);
	return <>{value && <span className={styles.ValueLabel}>{get(selectedOption, 'label', value)}</span>}</>;
};

export default ReadOnlyValueWidget;
