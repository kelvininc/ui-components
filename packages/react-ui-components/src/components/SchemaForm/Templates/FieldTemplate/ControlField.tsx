import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useContext, useRef } from 'react';
import { EDescriptionPosition } from '../../types';
import { ArrayDescriptionContext, ArrayItemControlsContext, ChoiceControlContext, FieldDescriptionContext } from '../../contexts';
import { useFieldPresentation } from './useFieldPresentation';
import styles from './FieldTemplate.module.scss';
import ChoiceExtras from './ChoiceExtras';
import FieldHelp from '../TitleFieldTemplate/FieldHelp';

const ControlField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const choiceHost = useRef<HTMLKvRadioListElement | null>(null);
	const controls = useContext(ArrayItemControlsContext);
	const itemControls = controls?.fieldId === props.id ? controls : null;
	const { WrapIfAdditionalTemplate, arrayDescriptionContext, errorDescription, descriptionPosition, titleElement, descriptionElement, errorsElement, helperElement } =
		useFieldPresentation(props);
	const help = errorsElement || descriptionElement;
	return (
		<WrapIfAdditionalTemplate {...props}>
			<div className={classNames(styles.FieldWrapper, props.classNames)}>
				{titleElement}
				{descriptionPosition === EDescriptionPosition.Top && help}
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
				{descriptionPosition !== EDescriptionPosition.Top && help}
				{helperElement}
			</div>
		</WrapIfAdditionalTemplate>
	);
};
export default ControlField;
