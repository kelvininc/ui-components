import { ArrayFieldItemTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash';
import React from 'react';
import styles from './ArrayFieldItemTemplate.module.scss';

const ArrayFieldItemTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	children,
	buttonsProps,
	hasToolbar,
	index,
	registry,
	uiSchema
}: ArrayFieldItemTemplateProps<T, S, F>) => {
	const fieldset = get(uiSchema, ['ui:fieldset'], false);
	const itemPrefix = get(uiSchema, ['ui:itemPrefix']);
	const Buttons = getTemplate<'ArrayFieldItemButtonsTemplate', T, S, F>('ArrayFieldItemButtonsTemplate', registry, getUiOptions(uiSchema));

	return (
		<div className={classNames({ [styles.FieldsetStyle]: fieldset })}>
			<div className={styles.ArrayItemContainer}>
				{itemPrefix && <span className={styles.ItemPrefix}>{`${itemPrefix} ${index + 1}`}</span>}
				{children}
				{hasToolbar && (
					<div className={styles.ToolbarContainer}>
						<Buttons {...buttonsProps} />
					</div>
				)}
			</div>
		</div>
	);
};
export default ArrayFieldItemTemplate;
