import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import { EDescriptionPosition } from '../../types';
import { ArrayDescriptionContext, ArrayItemControlsContext, ChoiceControlContext, FieldDescriptionContext } from '../../contexts';
import { useFieldPresentation } from './useFieldPresentation';
import styles from './FieldTemplate.module.scss';
import ChoiceExtras from './ChoiceExtras';
import FieldHelp from '../TitleFieldTemplate/FieldHelp';
import { useTableCell } from '../../contexts/TableContext';
import tableStyles from '../ArrayFieldTemplate/TableLayout.module.scss';
import { SCHEMA_FORM_STRINGS } from '../../strings';

const ControlField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const choiceHost = useRef<HTMLKvRadioListElement | null>(null);
	const cell = useTableCell(props.id);
	const controls = useContext(ArrayItemControlsContext);
	const itemControls = controls?.fieldId === props.id ? controls : null;
	const { WrapIfAdditionalTemplate, arrayDescriptionContext, errorDescription, descriptionPosition, titleElement, descriptionElement, errorsElement, helperElement } =
		useFieldPresentation(props);
	const help = errorsElement || descriptionElement;
	return (
		<WrapIfAdditionalTemplate {...props}>
			<div className={classNames(styles.FieldWrapper, props.classNames)}>
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
				{!cell && descriptionPosition === EDescriptionPosition.Top && help}
				<ChoiceControlContext.Provider value={choiceHost}>
					<FieldDescriptionContext.Provider value={errorDescription}>
						<ArrayDescriptionContext.Provider value={arrayDescriptionContext}>
							{itemControls ? (
								<div className={styles.ItemControlRow}>
									{itemControls.before}
									<div className={styles.ItemControl}>
										<ArrayItemControlsContext.Provider value={null}>{props.children}</ArrayItemControlsContext.Provider>
									</div>
									{!titleElement && <FieldHelp help={props.rawHelp} />}
									{itemControls.after}
								</div>
							) : (
								props.children
							)}
						</ArrayDescriptionContext.Provider>
					</FieldDescriptionContext.Provider>
					<ChoiceExtras {...props} />
				</ChoiceControlContext.Provider>
				{cell ? errorsElement : descriptionPosition !== EDescriptionPosition.Top && help}
				{!cell && helperElement}
			</div>
		</WrapIfAdditionalTemplate>
	);
};
export default ControlField;
