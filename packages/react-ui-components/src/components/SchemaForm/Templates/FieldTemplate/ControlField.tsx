import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import { EDescriptionPosition } from '../../types';
import { ArrayDescriptionContext, ArrayItemControlsContext, ChoiceControlContext, FieldDescriptionContext, FileFieldErrorsContext } from '../../contexts';
import { useFieldPresentation } from './useFieldPresentation';
import styles from './FieldTemplate.module.scss';
import ChoiceExtras from './ChoiceExtras';
import FieldHelp from '../TitleFieldTemplate/FieldHelp';
import { useTableCell } from '../../contexts/TableContext';
import tableStyles from '../ArrayFieldTemplate/TableLayout.module.scss';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import { showsNotSet } from './utils';

const ControlField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const choiceHost = useRef<HTMLKvRadioListElement | null>(null);
	const cell = useTableCell(props.id);
	const controls = useContext(ArrayItemControlsContext);
	const itemControls = controls?.fieldId === props.id ? controls : null;
	const {
		WrapIfAdditionalTemplate,
		arrayDescriptionContext,
		errorDescription,
		collection,
		fileWidget,
		descriptionPosition,
		titleElement,
		descriptionElement,
		collectionMetadataElement,
		errorsElement,
		helperElement
	} = useFieldPresentation(props);
	const help = collection ? descriptionElement : errorsElement || descriptionElement;
	const footerHelp = cell ? !fileWidget && errorsElement : descriptionPosition !== EDescriptionPosition.Top && help;
	const footerErrors = !cell && collection && !fileWidget && errorsElement;
	const notSetRef = useRef<HTMLSpanElement>(null);
	const notSet = showsNotSet(props) && (
		<span ref={notSetRef} tabIndex={-1} className={styles.NotSet}>
			{SCHEMA_FORM_STRINGS.notSet}
		</span>
	);
	const footerDefault = !cell && !collection && helperElement;
	// The value's status and its default share the footer's right side, across from the description and errors
	const footerAside = !cell && !collection && (notSet || footerDefault);
	const footer = footerAside ? (
		<div className={styles.FieldFooter}>
			<div className={styles.FieldFooterContent}>
				{footerHelp && <div className={styles.FieldFeedback}>{footerHelp}</div>}
				<div className={styles.FieldDefault}>
					{notSet}
					{notSet && footerDefault && (
						<span className={styles.NotSet} aria-hidden="true">
							·
						</span>
					)}
					{footerDefault}
				</div>
			</div>
		</div>
	) : cell && notSet ? (
		// Radios never render in a table cell, so this is a select with a blank placeholder: "Not set" stays under it
		<div className={styles.ChoiceExtras}>
			<div className={styles.ChoiceFeedback}>
				{footerHelp}
				{notSet}
			</div>
		</div>
	) : footerHelp || footerErrors ? (
		<>
			{footerHelp}
			{footerErrors}
		</>
	) : null;
	return (
		<WrapIfAdditionalTemplate {...props}>
			<div
				className={classNames(styles.FieldWrapper, props.classNames, {
					[styles.ItemWithGrip]: itemControls?.before,
					[styles.ItemWithAction]: itemControls?.after
				})}
			>
				{cell ? (
					<div className={tableStyles.CellLabel}>
						<span aria-hidden="true">{cell.column.title}</span>
						{cell.column.required && (
							<span className={tableStyles.Required} aria-hidden="true">
								*
							</span>
						)}
						<FieldHelp help={cell.column.description} accessibleLabel={SCHEMA_FORM_STRINGS.helpFor(cell.accessibleLabel)} />
					</div>
				) : (
					titleElement
				)}
				{!cell && (collection ? collectionMetadataElement : descriptionPosition === EDescriptionPosition.Top && help)}
				<ChoiceControlContext.Provider value={choiceHost}>
					<FieldDescriptionContext.Provider value={errorDescription}>
						<FileFieldErrorsContext.Provider value={fileWidget ? { fieldId: props.id, errors: errorsElement } : null}>
							<ArrayDescriptionContext.Provider value={arrayDescriptionContext}>
								{itemControls ? (
									<div className={styles.ItemControlRow}>
										{itemControls.before}
										<div className={styles.ItemControl}>
											<ArrayItemControlsContext.Provider value={null}>{props.children}</ArrayItemControlsContext.Provider>
										</div>
										{!titleElement && (
											<FieldHelp help={props.rawHelp} accessibleLabel={SCHEMA_FORM_STRINGS.helpFor(props.label.trim() || itemControls.itemName)} />
										)}
										{itemControls.after}
									</div>
								) : (
									props.children
								)}
							</ArrayDescriptionContext.Provider>
						</FileFieldErrorsContext.Provider>
					</FieldDescriptionContext.Provider>
					<ChoiceExtras {...props} notSetRef={notSetRef}>
						{footer}
					</ChoiceExtras>
				</ChoiceControlContext.Provider>
			</div>
		</WrapIfAdditionalTemplate>
	);
};
export default ControlField;
