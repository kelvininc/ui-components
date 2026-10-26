import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateProps, FormContextType, getUiOptions, isFixedItems, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
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
	onAddClick,
	buttonRef
}: Partial<ArrayFieldTemplateProps<T, S, F>> & { buttonRef?: React.Ref<HTMLKvActionButtonElement> }) => {
	const options = getUiOptions(uiSchema, registry?.globalUiOptions);
	const itemOptions = getUiOptions(schema && isFixedItems(schema) ? uiSchema?.additionalItems : uiSchema?.items, registry?.globalUiOptions);
	const validPrefix = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);
	const prefix = validPrefix(itemOptions.itemPrefix) ?? validPrefix(options.itemPrefix);
	const btnProps = {
		accessibleLabel: prefix ? SCHEMA_FORM_STRINGS.add(prefix) : SCHEMA_FORM_STRINGS.addItem(options.title || schema?.title),
		size: EComponentSize.Large,
		type: EActionButtonType.Tertiary,
		tabIndex: 0,
		menuTabIndex: 0,
		disabled: disabled || readonly,
		onClickButton: onAddClick
	};
	return (
		<div className={styles.AddButtonContainer}>
			<KvActionButton ref={buttonRef} {...btnProps}>
				<KvIcon name={EIconName.Add} />
				<span className={styles.AddButtonText}>{prefix ? SCHEMA_FORM_STRINGS.add(prefix) : SCHEMA_FORM_STRINGS.addItem()}</span>
			</KvActionButton>
		</div>
	);
};

export default AddButton;
