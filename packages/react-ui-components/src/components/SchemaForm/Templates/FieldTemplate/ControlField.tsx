import { FieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useRef } from 'react';
import { EDescriptionPosition } from '../../types';
import { ArrayDescriptionContext, ChoiceControlContext, FieldDescriptionContext } from '../../contexts';
import { useFieldPresentation } from './useFieldPresentation';
import styles from './FieldTemplate.module.scss';
import ChoiceExtras from './ChoiceExtras';

const ControlField = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(props: FieldTemplateProps<T, S, F>) => {
	const choiceHost = useRef<HTMLKvRadioListElement | null>(null);
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
						<ArrayDescriptionContext.Provider value={arrayDescriptionContext}>{props.children}</ArrayDescriptionContext.Provider>
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
