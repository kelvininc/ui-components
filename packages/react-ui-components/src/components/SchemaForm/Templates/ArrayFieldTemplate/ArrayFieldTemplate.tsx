import { ArrayFieldTemplateItemType, ArrayFieldTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import React, { useId } from 'react';
import classNames from 'classnames';
import AddButton from './AddButton';
import styles from './ArrayFieldTemplate.module.scss';
import { defaultArrayDescriptionTemplate } from '../../rjsf/arrayTemplate';
import { ArrayItemsContext, useArrayDescription } from '../../contexts';
import { useArrayFocus } from '../../hooks/useArrayFocus';
import { TableContext } from '../../contexts/TableContext';
import { getTableColumns } from '../utils';
import DefaultArrayFieldItemTemplate from '../ArrayFieldItemTemplate';
import { TableHeader } from './TableLayout';
import tableStyles from './TableLayout.module.scss';

const ArrayFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	idSchema,
	uiSchema,
	schema,
	title,
	disabled,
	readonly,
	items,
	formData,
	canAdd,
	registry,
	onAddClick
}: ArrayFieldTemplateProps<T, S, F>) => {
	const uiOptions = getUiOptions(uiSchema, registry.globalUiOptions);
	const listName = uiOptions.title?.trim() || schema.title?.trim() || title?.trim() || 'Items';
	const tableId = useId();
	const ArrayFieldDescriptionTemplate = getTemplate<'ArrayFieldDescriptionTemplate', T, S, F>('ArrayFieldDescriptionTemplate', registry, uiOptions);
	const ArrayFieldItemTemplate = getTemplate<'ArrayFieldItemTemplate', T, S, F>('ArrayFieldItemTemplate', registry, uiOptions);
	const columns =
		uiOptions.layout !== 'sections' &&
		schema.items &&
		!Array.isArray(schema.items) &&
		typeof schema.items !== 'boolean' &&
		ArrayFieldItemTemplate === DefaultArrayFieldItemTemplate
			? getTableColumns(schema.items as S, uiSchema?.items, registry)
			: undefined;
	const table = columns ? { id: tableId, columns, reserveGrip: uiOptions.orderable !== false, removable: uiOptions.removable !== false } : null;
	const descriptionContext = useArrayDescription();
	const fieldOwnsDescription = descriptionContext?.fieldId === idSchema.$id && getTemplate('FieldTemplate', registry, uiOptions) === descriptionContext?.fieldTemplate;
	const descriptionId = fieldOwnsDescription && descriptionContext?.fieldId === idSchema.$id ? descriptionContext.descriptionId : undefined;
	const focus = useArrayFocus(
		items.length,
		canAdd,
		Boolean(disabled || readonly),
		listName,
		Array.isArray(formData) ? formData.length : items.length,
		Array.isArray(schema.items) ? schema.items.length : 0
	);
	const addItem: typeof onAddClick = event => {
		if (disabled || readonly) return;
		focus.requestFocus('add', items.length);
		onAddClick(event);
	};
	const addButton = canAdd && (
		<AddButton buttonRef={focus.addRef} disabled={disabled} readonly={readonly} uiSchema={uiSchema} schema={schema} registry={registry} onAddClick={addItem} />
	);

	return (
		<div className={classNames(styles.ArrayFieldTemplate, { [tableStyles.TableContainer]: table })} data-schema-form-list={idSchema.$id}>
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

				<div
					ref={focus.listRef}
					className={classNames(styles.ArrayItemList, { [tableStyles.TableList]: table })}
					role={table ? 'table' : undefined}
					aria-label={table ? listName : undefined}
					aria-colcount={table ? columns!.length + 2 : undefined}
				>
					{table && <TableHeader table={table} />}
					<ArrayItemsContext.Provider value={focus.items}>
						<TableContext.Provider value={table}>
							{items && items.map(({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => <ArrayFieldItemTemplate key={key} {...itemProps} />)}
						</TableContext.Provider>
					</ArrayItemsContext.Provider>
					{!table && addButton}
				</div>
				{table && addButton}
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
