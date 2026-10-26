import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import classNames from 'classnames';
import React from 'react';
import { RadioChoice } from '../RadioChoice';
import styles from './RadioListWidget.module.scss';

const RadioListWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: WidgetProps<T, S, F>) => (
	<RadioChoice {...props} descriptions className={classNames(styles.RadioListContainer, { [styles.Inline]: Boolean(props.options.inline) })} />
);
export default RadioListWidget;
