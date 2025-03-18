import { FormContextType, RJSFSchema, StrictRJSFSchema, TitleFieldProps, getUiOptions } from '@rjsf/utils';
import { get } from 'lodash';
import React from 'react';
import { KvIcon, KvInfoLabel, KvToggleTip } from '../../../stencil-generated';
import { EIconName, ETooltipPosition, stringHelper } from '@kelvininc/ui-components';
import styles from './TitleFieldTemplate.module.scss';
import classNames from 'classnames';

const TitleFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({ title, uiSchema, required, schema }: TitleFieldProps<T, S, F>): any => {
	const uiOptions = getUiOptions<T, S, F>(uiSchema);
	const titleToShow = get(uiSchema, ['ui:title'], title);
	const titleCustomClass = get(uiSchema, ['ui:titleCustomClass']);
	const isGroupTitle = schema.type === 'object';
	return (
		stringHelper.isValidLabel(titleToShow) && (
			<div className={classNames(styles.TitleContainer, titleCustomClass, { [styles.GroupTitle]: isGroupTitle })}>
				{required && <span className={styles.Required}>*</span>}
				<KvInfoLabel labelTitle={titleToShow || ''} />
				{uiOptions.help && (
					<KvToggleTip className={styles.ToggleTip} text={uiOptions.help} position={ETooltipPosition.Right}>
						<KvIcon name={EIconName.Info} slot="open-element-slot" />
					</KvToggleTip>
				)}
			</div>
		)
	);
};

export default TitleFieldTemplate;
