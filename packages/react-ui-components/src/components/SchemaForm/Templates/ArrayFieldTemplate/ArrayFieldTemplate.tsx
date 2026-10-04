import { ArrayFieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import React from 'react';
import AddButton from './AddButton';
import styles from './ArrayFieldTemplate.module.scss';

const ArrayFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	fieldPathId,
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

	return (
		<div className={styles.ArrayFieldTemplate}>
			<div className={styles.ArrayFieldContainer}>
				<ArrayFieldDescriptionTemplate
					fieldPathId={fieldPathId}
					description={uiOptions.description || schema.description}
					schema={schema}
					uiSchema={uiSchema}
					registry={registry}
				/>

				<div className={styles.ArrayItemList} key={`array-item-list-${fieldPathId.$id}`}>
					{items}
					{canAdd && AddButton({ canAdd, disabled, readonly, uiSchema, onAddClick })}
				</div>
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
