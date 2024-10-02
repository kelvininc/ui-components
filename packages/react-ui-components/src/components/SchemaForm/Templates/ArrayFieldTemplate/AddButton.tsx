import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';
import { KvActionButtonIcon, KvActionButtonText } from '../../../../stencil-generated/components';
import styles from './AddButton.module.scss';

const AddButton = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	disabled,
	readonly,
	uiSchema,
	onAddClick
}: Partial<ArrayFieldTemplateProps<T, S, F>>) => {
	const btnProps = {
		icon: EIconName.Add,
		size: EComponentSize.Large,
		type: EActionButtonType.Secondary,
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
