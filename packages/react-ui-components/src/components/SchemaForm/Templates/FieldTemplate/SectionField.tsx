import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useContext } from 'react';
import {
	ArrayDescriptionContext,
	ArrayItemControlsContext,
	SectionDepthContext,
	useSectionDepth,
	claimSectionBoundary,
	getSectionHeadingKind,
	SectionHeadingContext,
	SectionLayoutContext,
	sectionBodyLayout,
	useSectionLayout
} from '../../contexts';
import { EDescriptionPosition } from '../../types';
import { useFieldPresentation } from './useFieldPresentation';
import styles from './SectionField.module.scss';

const SectionField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const depth = useSectionDepth();
	const controls = useContext(ArrayItemControlsContext);
	const itemControls = controls?.fieldId === props.id ? controls : null;
	const itemHeader = itemControls?.header;
	const parentLayout = useSectionLayout();
	const { state: layout, boundary } =
		parentLayout.sectionLevel >= 2 || parentLayout.itemLevel > 0 ? claimSectionBoundary(parentLayout, props.id, 'section') : { state: parentLayout, boundary: null };
	// The form root and a selected option branch, whose selector's label is its heading, open a level even untitled
	const optionBranch = parentLayout.owner?.kind === 'option' && parentLayout.owner.fieldId === props.id;
	const {
		WrapIfAdditionalTemplate,
		arrayDescriptionContext,
		title,
		hasTitle,
		titleId,
		defaultTitle,
		descriptionId,
		errorsId,
		descriptionPosition,
		collection,
		titleElement,
		descriptionElement,
		collectionMetadataElement,
		errorsElement,
		helperElement
	} = useFieldPresentation(props);
	const opensLevel = hasTitle || optionBranch || parentLayout.sectionLevel === 0;
	const describedBy = [(descriptionElement || arrayDescriptionContext.descriptionId) && descriptionId, errorsElement && errorsId].filter(Boolean).join(' ') || undefined;
	const heading = <SectionHeadingContext.Provider value={getSectionHeadingKind(layout, Boolean(itemControls))}>{titleElement}</SectionHeadingContext.Provider>;
	const header =
		itemControls && (titleElement || itemHeader) ? (
			<div className={classNames(styles.ItemHeader, { [styles.FieldsetHeader]: itemControls.fieldset })} data-schema-form-item-header>
				{heading}
				{itemHeader}
			</div>
		) : (
			heading
		);
	const field = (
		<WrapIfAdditionalTemplate {...props}>
			<div
				className={classNames(styles.SectionField, props.classNames)}
				role={hasTitle ? 'group' : undefined}
				aria-labelledby={hasTitle && defaultTitle ? titleId : undefined}
				aria-label={hasTitle && !defaultTitle ? title : undefined}
				aria-describedby={describedBy}
			>
				{collection ? (
					<div className={styles.CollectionHeader}>
						{header}
						{collectionMetadataElement}
					</div>
				) : (
					<>
						{header}
						{descriptionPosition === EDescriptionPosition.Top && descriptionElement}
					</>
				)}
				{errorsElement}
				<SectionDepthContext.Provider value={depth + Number(hasTitle)}>
					<SectionLayoutContext.Provider value={sectionBodyLayout(layout, opensLevel)}>
						<ArrayDescriptionContext.Provider value={arrayDescriptionContext}>
							<ArrayItemControlsContext.Provider value={itemControls ? null : controls}>{props.children}</ArrayItemControlsContext.Provider>
						</ArrayDescriptionContext.Provider>
					</SectionLayoutContext.Provider>
				</SectionDepthContext.Provider>
				{descriptionPosition === EDescriptionPosition.Bottom && descriptionElement}
				{!collection && helperElement}
			</div>
		</WrapIfAdditionalTemplate>
	);
	return boundary ? (
		<div
			className={styles.SectionGuide}
			data-schema-form-boundary={boundary.kind}
			data-schema-form-boundary-field={props.id}
			data-schema-form-boundary-depth={boundary.depth}
			data-schema-form-narrow-inset={boundary.depth > 6 ? 'capped' : undefined}
		>
			{field}
		</div>
	) : (
		field
	);
};
export default SectionField;
