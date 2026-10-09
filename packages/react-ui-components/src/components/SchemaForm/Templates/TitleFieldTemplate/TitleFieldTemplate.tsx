import { FormContextType, RJSFSchema, StrictRJSFSchema, TitleFieldProps, getUiOptions } from '@rjsf/utils';
import { get } from 'lodash';
import React, { useContext } from 'react';
import { KvInfoLabel, KvTooltip } from '../../../../stencil-generated';
import { stringHelper } from '@kelvininc/ui-components';
import styles from './TitleFieldTemplate.module.scss';
import classNames from 'classnames';
import { getSectionHeadingLevel, SectionHeadingContext, useSectionDepth } from '../../contexts';
import { isSectionField } from '../utils';
import FieldHelp from './FieldHelp';
import { SCHEMA_FORM_STRINGS } from '../../strings';

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
	const subsection = useContext(SectionHeadingContext) === 'subsection';
	return (
		stringHelper.isValidLabel(titleToShow) && (
			<div className={classNames(styles.TitleContainer, titleCustomClass, { [styles.GroupTitle]: isGroupTitle })}>
				{isGroupTitle ? (
					<Heading id={id} className={classNames(styles.GroupHeading, { [styles.SubsectionHeading]: subsection })}>
						{titleToShow}
					</Heading>
				) : (
					<KvTooltip id={id} text={titleToShow || ''} truncate>
						<KvInfoLabel labelTitle={titleToShow || ''} />
					</KvTooltip>
				)}
				{/* Some controls rely on this marker to communicate required state. */}
				{required && <span className={styles.Required}>*</span>}
				<FieldHelp className={styles.ToggleTip} help={uiOptions.help} accessibleLabel={SCHEMA_FORM_STRINGS.helpFor(titleToShow || id)} />
			</div>
		)
	);
};

export default TitleFieldTemplate;
