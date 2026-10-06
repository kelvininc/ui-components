import { ArrayFieldTemplateItemType, ArrayFieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import React from 'react';
import AddButton from './AddButton';
import styles from './ArrayFieldTemplate.module.scss';
import { defaultArrayDescriptionTemplate } from '../../rjsf/arrayTemplate';
import { ArrayItemsContext, useArrayDescription } from '../../contexts';
import { useArrayFocus } from '../../hooks/useArrayFocus';

const ArrayFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	idSchema,
	uiSchema,
	schema,
	disabled,
	readonly,
	items,
	formData,
	canAdd,
	registry,
	onAddClick
}: ArrayFieldTemplateProps<T, S, F>) => {
	const uiOptions = getUiOptions(uiSchema, registry.globalUiOptions);
	const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>('ArrayFieldDescriptionTemplate', registry, uiOptions);
	const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>('ArrayFieldItemTemplate', registry, uiOptions);
	const descriptionContext = useArrayDescription();
	const fieldOwnsDescription = descriptionContext?.fieldId === idSchema.$id && getTemplate('FieldTemplate', registry, uiOptions) === descriptionContext?.fieldTemplate;
	const descriptionId = fieldOwnsDescription && descriptionContext?.fieldId === idSchema.$id ? descriptionContext.descriptionId : undefined;
	const focus = useArrayFocus(
		items.length,
		canAdd,
		Boolean(disabled || readonly),
		uiOptions.title?.trim() || schema.title?.trim() || 'Items',
		Array.isArray(formData) ? formData.length : items.length,
		Array.isArray(schema.items) ? schema.items.length : 0
	);
	const addItem: typeof onAddClick = event => {
		if (disabled || readonly) return;
		focus.requestFocus('add', items.length);
		onAddClick(event);
	};

	return (
		<div className={styles.ArrayFieldTemplate} data-schema-form-list={idSchema.$id}>
			<div className={styles.ArrayFieldContainer}>
				{(!fieldOwnsDescription || ArrayFieldDescriptionTemplate !== defaultArrayDescriptionTemplate) && (
					<div id={descriptionId} className={styles.ArrayDescription}>
						<ArrayFieldDescriptionTemplate
							idSchema={idSchema}
							description={uiOptions.description ?? schema.description}
							schema={schema}
							uiSchema={uiSchema}
							registry={registry}
						/>
					</div>
				)}

				<div ref={focus.listRef} className={styles.ArrayItemList}>
					<ArrayItemsContext.Provider value={focus.items}>
						{items && items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => <ArrayFieldItemTemplate key={key} {...itemProps} />)}
					</ArrayItemsContext.Provider>
					{canAdd && (
						<AddButton buttonRef={focus.addRef} disabled={disabled} readonly={readonly} uiSchema={uiSchema} schema={schema} registry={registry} onAddClick={addItem} />
					)}
				</div>
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
