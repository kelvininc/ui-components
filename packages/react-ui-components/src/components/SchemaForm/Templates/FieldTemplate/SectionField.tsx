import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { ArrayDescriptionContext, ArrayItemControlsContext, SectionDepthContext, useSectionDepth } from '../../contexts';
import { EDescriptionPosition } from '../../types';
import { useFieldPresentation } from './useFieldPresentation';
import styles from './SectionField.module.scss';

const SectionField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const depth = useSectionDepth();
	const controls = useContext(ArrayItemControlsContext);
	const itemControls = controls?.fieldId === props.id ? controls : null;
	const itemHeader = itemControls?.header;
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
		titleElement,
		descriptionElement,
		errorsElement,
		helperElement
	} = useFieldPresentation(props);
	const describedBy = [(descriptionElement || arrayDescriptionContext.descriptionId) && descriptionId, errorsElement && errorsId].filter(Boolean).join(' ') || undefined;
	return (
		<WrapIfAdditionalTemplate {...props}>
			<div
				className={classNames(styles.SectionField, props.classNames)}
				role={hasTitle ? 'group' : undefined}
				aria-labelledby={hasTitle && defaultTitle ? titleId : undefined}
				aria-label={hasTitle && !defaultTitle ? title : undefined}
				aria-describedby={describedBy}
			>
				{itemControls && (titleElement || itemHeader) ? (
					<div className={classNames(styles.ItemHeader, { [styles.FieldsetHeader]: itemControls.fieldset })} data-schema-form-item-header>
						{titleElement}
						{itemHeader}
					</div>
				) : (
					titleElement
				)}
				{descriptionPosition === EDescriptionPosition.Top && descriptionElement}
				{errorsElement}
				<SectionDepthContext.Provider value={depth + Number(hasTitle)}>
					<ArrayDescriptionContext.Provider value={arrayDescriptionContext}>
						<ArrayItemControlsContext.Provider value={itemControls ? null : controls}>{props.children}</ArrayItemControlsContext.Provider>
					</ArrayDescriptionContext.Provider>
				</SectionDepthContext.Provider>
				{descriptionPosition === EDescriptionPosition.Bottom && descriptionElement}
				{helperElement}
			</div>
		</WrapIfAdditionalTemplate>
	);
};
export default SectionField;
