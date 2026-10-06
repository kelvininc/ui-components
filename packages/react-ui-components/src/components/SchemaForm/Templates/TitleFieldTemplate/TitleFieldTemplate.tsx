import { FormContextType, RJSFSchema, StrictRJSFSchema, TitleFieldProps, getUiOptions } from '@rjsf/utils';
import { get } from 'lodash';
import React from 'react';
import { KvInfoLabel, KvTooltip } from '../../../../stencil-generated';
import { stringHelper } from '@kelvininc/ui-components';
import styles from './TitleFieldTemplate.module.scss';
import classNames from 'classnames';
import { getSectionHeadingLevel, useSectionDepth } from '../../contexts';
import { isSectionField } from '../utils';
import FieldHelp from './FieldHelp';

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
				<FieldHelp className={styles.ToggleTip} help={uiOptions.help} />
			</div>
		)
	);
};

export default TitleFieldTemplate;
