import { FormContextType, RJSFSchema, StrictRJSFSchema, TitleFieldProps, getUiOptions } from '@rjsf/utils';
import { get } from 'lodash';
import React from 'react';
import { KvIcon, KvInfoLabel, KvToggleTip, KvTooltip } from '../../../../stencil-generated';
import { EIconName, ETooltipPosition, stringHelper } from '@kelvininc/ui-components';
import styles from './TitleFieldTemplate.module.scss';
import classNames from 'classnames';
import { getSectionHeadingLevel, useSectionDepth } from '../../contexts';
import { isSectionField } from '../utils';

const TitleFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	id,
	title,
	uiSchema,
	required,
	schema,
	registry
}: TitleFieldProps<T, S, F>): any => {
	const uiOptions = getUiOptions<T, S, F>(uiSchema, registry.globalUiOptions);
	const titleToShow = title;
	const titleCustomClass = get(uiSchema, ['ui:titleCustomClass']);
	const isGroupTitle = isSectionField(schema, uiSchema, registry);
	const Heading = `h${getSectionHeadingLevel(useSectionDepth())}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	return (
		stringHelper.isValidLabel(titleToShow) && (
			<div className={classNames(styles.TitleContainer, titleCustomClass, { [styles.GroupTitle]: isGroupTitle })}>
				{required && <span className={styles.Required}>*</span>}
				{isGroupTitle ? (
					<Heading id={id} className={styles.GroupHeading}>
						{titleToShow}
					</Heading>
				) : (
					<KvTooltip id={id} text={titleToShow || ''} truncate>
						<KvInfoLabel labelTitle={titleToShow || ''} />
					</KvTooltip>
				)}
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
