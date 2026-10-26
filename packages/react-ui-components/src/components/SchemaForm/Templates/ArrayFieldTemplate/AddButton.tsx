import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';
import { KvActionButtonIcon, KvActionButtonText } from '../../../../stencil-generated';
import styles from './AddButton.module.scss';
import { SCHEMA_FORM_STRINGS } from '../../strings';

const AddButton = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	disabled,
	readonly,
	uiSchema,
	schema,
	onAddClick
}: Partial<ArrayFieldTemplateProps<T, S, F>>) => {
	const btnProps = {
		icon: EIconName.Add,
		accessibleLabel: uiSchema?.['ui:itemPrefix'] ? SCHEMA_FORM_STRINGS.add(uiSchema['ui:itemPrefix']) : SCHEMA_FORM_STRINGS.addItem(uiSchema?.['ui:title'] || schema?.title),
		size: EComponentSize.Large,
		type: EActionButtonType.Tertiary,
		tabIndex: -1,
		disabled: disabled || readonly,
		onClickButton: onAddClick
	};
	if (uiSchema && uiSchema['ui:itemPrefix']) {
		return <KvActionButtonText text={`Add ${uiSchema['ui:itemPrefix']}`} {...btnProps} />;
	}

	return (
		<div className={styles.AddButtonContainer}>
			<KvActionButtonIcon {...btnProps} />
		</div>
	);
};

export default AddButton;
