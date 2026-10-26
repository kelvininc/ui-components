import { EComponentSize } from '@kelvininc/ui-components';
import { FormContextType, RJSFSchema, StrictRJSFSchema, WidgetProps } from '@rjsf/utils';
import classNames from 'classnames';
import React from 'react';
import { RadioChoice } from '../RadioChoice';
import styles from './RadioWidget.module.scss';

const RadioWidget = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: WidgetProps<T, S, F>) => (
	<RadioChoice {...props} size={EComponentSize.Small} className={classNames(styles.RadioListContainer, { [styles.Inline]: Boolean(props.options.inline) })} />
);
export default RadioWidget;
