import { ArrayFieldTemplateItemType, ArrayFieldTemplateProps, getTemplate, getUiOptions } from '@rjsf/utils';
import React from 'react';
import AddButton from './AddButton';
import styles from './ArrayFieldTemplate.module.scss';

const ArrayFieldTemplate = ({ idSchema, uiSchema, schema, title, disabled, readonly, required, items, canAdd, registry, onAddClick }: ArrayFieldTemplateProps) => {
	const uiOptions = getUiOptions(uiSchema);
	const ArrayFieldTitleTemplate = getTemplate<'ArrayFieldTitleTemplate'>('ArrayFieldTitleTemplate', registry, uiOptions);
	const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate'>('ArrayFieldDescriptionTemplate', registry, uiOptions);
	const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate'>('ArrayFieldItemTemplate', registry, uiOptions);

	return (
		<div className={styles.ArrayFieldTemplate}>
			<div className={styles.ArrayFieldContainer}>
				<ArrayFieldTitleTemplate idSchema={idSchema} title={title} schema={schema} uiSchema={uiSchema} required={required} registry={registry} />

				<ArrayFieldDescriptionTemplate
					idSchema={idSchema}
					description={uiOptions.description || schema.description}
					schema={schema}
					uiSchema={uiSchema}
					registry={registry}
				/>

				<div className={styles.ArrayItemList} key={`array-item-list-${idSchema.$id}`}>
					{items && items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType) => <ArrayFieldItemTemplate key={key} {...itemProps} />)}
					{canAdd && AddButton({ canAdd, disabled, readonly, uiSchema, onAddClick })}
				</div>
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
