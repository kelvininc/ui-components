import { ArrayFieldTemplateItemType, ArrayFieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import React from 'react';
import AddButton from './AddButton';
import styles from './ArrayFieldTemplate.module.scss';

const ArrayFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	idSchema,
	uiSchema,
	schema,
	disabled,
	readonly,
	items,
	canAdd,
	registry,
	onAddClick
}: ArrayFieldTemplateProps<T, S, F>) => {
	const uiOptions = getUiOptions(uiSchema);
	const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>('ArrayFieldDescriptionTemplate', registry, uiOptions);
	const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>('ArrayFieldItemTemplate', registry, uiOptions);

	return (
		<div className={styles.ArrayFieldTemplate}>
			<div className={styles.ArrayFieldContainer}>
				<ArrayFieldDescriptionTemplate
					idSchema={idSchema}
					description={uiOptions.description || schema.description}
					schema={schema}
					uiSchema={uiSchema}
					registry={registry}
				/>

				<div className={styles.ArrayItemList} key={`array-item-list-${idSchema.$id}`}>
					{items && items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => <ArrayFieldItemTemplate key={key} {...itemProps} />)}
					{canAdd && AddButton({ canAdd, disabled, readonly, uiSchema, onAddClick })}
				</div>
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
