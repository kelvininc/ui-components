import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateProps, FormContextType, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';
import { KvActionButton, KvIcon } from '../../../../stencil-generated';
import styles from './AddButton.module.scss';
import { SCHEMA_FORM_STRINGS } from '../../strings';

const AddButton = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	disabled,
	readonly,
	uiSchema,
	schema,
	registry,
	onAddClick
}: Partial<ArrayFieldTemplateProps<T, S, F>>) => {
	const options = getUiOptions(uiSchema, registry?.globalUiOptions);
	const prefix = typeof options.itemPrefix === 'string' && options.itemPrefix.trim() ? options.itemPrefix : undefined;
	const btnProps = {
		accessibleLabel: prefix ? SCHEMA_FORM_STRINGS.add(prefix) : SCHEMA_FORM_STRINGS.addItem(options.title || schema?.title),
		size: EComponentSize.Large,
		type: EActionButtonType.Tertiary,
		tabIndex: -1,
		menuTabIndex: -1,
		disabled: disabled || readonly,
		onClickButton: onAddClick
	};
	return (
		<div className={styles.AddButtonContainer}>
			<KvActionButton {...btnProps}>
				<KvIcon name={EIconName.Add} />
				<span className={styles.AddButtonText}>{prefix ? SCHEMA_FORM_STRINGS.add(prefix) : SCHEMA_FORM_STRINGS.addItem()}</span>
			</KvActionButton>
		</div>
	);
};

export default AddButton;
