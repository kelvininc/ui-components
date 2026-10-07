import { EActionButtonType, EComponentSize, EIconName, IActionMenuItem } from '@kelvininc/ui-components';
import { ArrayFieldTemplateItemType, FieldProps, FormContextType, getTemplate, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import { KvActionButtonIcon, KvActionMenu } from '../../../../stencil-generated';
import { ArrayItemControlsContext, ArrayItemLayoutContext, ArrayItemsContext } from '../../contexts';
import { EntryFocusProvider, focusFromHolder, focusHost, useEntryFocus } from '../../hooks/entryFocus';
import { mergeUiSchemas } from '../../rjsf/merge';
import { isBuiltinSchemaField } from '../../rjsf/SchemaField';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import FieldTemplate from '../FieldTemplate';
import { isSectionField } from '../utils';
import styles from './ArrayFieldItemTemplate.module.scss';
import { TableContext, TableRowContext } from '../../contexts/TableContext';
import { tableStyle } from '../ArrayFieldTemplate/TableLayout';
import tableStyles from '../ArrayFieldTemplate/TableLayout.module.scss';

const validName = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);

const ArrayFieldItemTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	children,
	disabled,
	hasMoveDown,
	hasMoveUp,
	hasRemove,
	index,
	onDropIndexClick,
	onReorderClick,
	readonly,
	registry,
	schema,
	uiSchema
}: ArrayFieldTemplateItemType<T, S, F>) => {
	const layout = useContext(ArrayItemLayoutContext);
	const table = useContext(TableContext);
	const arrayFocus = useContext(ArrayItemsContext);
	const entry = useEntryFocus();
	const menuRef = useRef<HTMLKvActionMenuElement>(null);
	const removeRef = useRef<HTMLKvActionButtonIconElement>(null);
	const itemRef = useRef<HTMLDivElement>(null);
	const options = getUiOptions(uiSchema, registry.globalUiOptions);
	const fixedPosition = index < (layout?.fixedItems ?? 0);
	const prefix = validName(options.itemPrefix) || (!fixedPosition ? layout?.itemPrefix : undefined);
	const name = prefix || validName(options.title) || validName(schema.title) || (table ? SCHEMA_FORM_STRINGS.row : SCHEMA_FORM_STRINGS.item);
	const itemName = fixedPosition ? name : `${name} ${index + 1}`;
	const section = !table && isSectionField(schema, uiSchema, registry);
	const field = children as React.ReactElement<FieldProps<T, S, F>>;
	// Empty schemas and hidden widgets bypass the field layout, so they need the fallback controls.
	const defaultTemplate =
		Object.keys(schema).length > 0 && options.widget !== 'hidden' && getTemplate('FieldTemplate', registry, options) === FieldTemplate && isBuiltinSchemaField(field.type);
	const inactive = Boolean(disabled || readonly);
	const focusAction = useCallback((current: () => boolean) => focusHost(menuRef.current ?? removeRef.current, current), []);
	useLayoutEffect(
		() =>
			arrayFocus?.registerItem(index, {
				action: focusAction,
				control: async current => {
					if (await entry.focus(current)) return true;
					if (await focusAction(current)) return true;
					focusFromHolder(itemRef.current, itemName, undefined, current);
					return Boolean(itemRef.current?.matches(':focus'));
				}
			}),
		[arrayFocus, index, entry.focus, focusAction, itemName]
	);
	const moves = layout ? layout.orderable && !fixedPosition : hasMoveUp || hasMoveDown;
	const actions: IActionMenuItem[] = [
		...(moves
			? [
					{ id: 'move-up', label: SCHEMA_FORM_STRINGS.moveUpLabel, icon: EIconName.ArrowUpward, disabled: inactive || !hasMoveUp },
					{ id: 'move-down', label: SCHEMA_FORM_STRINGS.moveDownLabel, icon: EIconName.ArrowDownward, disabled: inactive || !hasMoveDown }
			  ]
			: []),
		...(section && hasRemove
			? [{ id: 'remove', label: SCHEMA_FORM_STRINGS.remove(itemName), icon: EIconName.Delete, destructive: true, separatorBefore: moves, disabled: inactive }]
			: [])
	];
	const onItemSelected = (event: CustomEvent<string>) => {
		if (inactive) return;
		if (event.detail === 'move-up' && moves && hasMoveUp) {
			arrayFocus?.requestFocus('move-up', index);
			onReorderClick(index, index - 1)(event);
		}
		if (event.detail === 'move-down' && moves && hasMoveDown) {
			arrayFocus?.requestFocus('move-down', index);
			onReorderClick(index, index + 1)(event);
		}
		if (event.detail === 'remove' && section && hasRemove) {
			arrayFocus?.requestFocus('remove', index);
			onDropIndexClick(index)(event);
		}
	};
	const menu = actions.length ? (
		<KvActionMenu
			ref={menuRef}
			accessibleLabel={section ? SCHEMA_FORM_STRINGS.itemActions(itemName) : SCHEMA_FORM_STRINGS.reorder(itemName)}
			items={actions}
			icon={section ? EIconName.More : EIconName.DragDrop}
			size={table?.size ?? EComponentSize.Large}
			triggerTabIndex={0}
			disabled={inactive}
			onItemSelected={onItemSelected}
		/>
	) : null;
	const before = !table && !section && (layout?.reserveGrip ?? moves) ? <div className={styles.ActionSlot}>{menu}</div> : undefined;
	const after =
		!section && (layout?.removable ?? hasRemove) ? (
			<div className={styles.ActionSlot}>
				{hasRemove && (
					<KvActionButtonIcon
						ref={removeRef}
						icon={EIconName.Delete}
						accessibleLabel={SCHEMA_FORM_STRINGS.remove(itemName)}
						size={table?.size ?? EComponentSize.Large}
						type={EActionButtonType.Tertiary}
						tabIndex={0}
						menuTabIndex={0}
						disabled={inactive}
						onClickButton={event => {
							if (inactive) return;
							arrayFocus?.requestFocus('remove', index);
							onDropIndexClick(index)(event);
						}}
					/>
				)}
			</div>
		) : undefined;
	const hiddenTitle = section && typeof options.title === 'string' && !options.title.trim();
	const itemUiSchema = mergeUiSchemas(uiSchema, {
		'ui:title': hiddenTitle ? options.title : itemName,
		...(!section ? { 'ui:label': options.label !== false && (fixedPosition || (layout?.fixedItems ?? 0) > 0) } : {})
	});
	const body = layout ? React.cloneElement(field, { uiSchema: itemUiSchema, title: itemName }) : field;
	const controls = { fieldId: field.props.idSchema.$id, fieldset: Boolean(options.fieldset), before, after, header: section ? menu : undefined };
	const rowHeaderId = table ? `${table.id}-row-${index}` : '';

	return (
		<div
			ref={itemRef}
			className={classNames({ [styles.ObjectItem]: section, [styles.FieldsetStyle]: options.fieldset && !table, [tableStyles.TableRow]: table })}
			role={table ? 'row' : undefined}
			aria-describedby={table ? `${rowHeaderId}-errors` : undefined}
			style={table ? tableStyle(table) : undefined}
			data-grip={table?.reserveGrip || undefined}
			data-schema-form-list-item={index}
			data-schema-form-item-kind={table ? 'table' : section ? 'section' : 'control'}
		>
			{table && (
				<span id={rowHeaderId} role="rowheader" aria-colindex={1} className={tableStyles.Hidden}>
					{itemName}
				</span>
			)}
			<EntryFocusProvider value={entry.register}>
				<ArrayItemsContext.Provider value={null}>
					<ArrayItemLayoutContext.Provider value={null}>
						<TableContext.Provider value={null}>
							<TableRowContext.Provider value={table ? { fieldId: field.props.idSchema.$id, itemName, rowHeaderId, table } : null}>
								{table ? (
									<>
										{body}
										<div
											role="cell"
											aria-colindex={table.columns.length + 2}
											aria-labelledby={`${table.id}-actions ${rowHeaderId}`}
											className={tableStyles.TableActions}
										>
											{menu && <div className={tableStyles.TableGrip}>{menu}</div>}
											{after}
										</div>
									</>
								) : defaultTemplate ? (
									<ArrayItemControlsContext.Provider value={controls}>{body}</ArrayItemControlsContext.Provider>
								) : (
									<div className={styles.FallbackRow}>
										{before}
										<div className={styles.ItemBody}>{body}</div>
										{section ? menu : after}
									</div>
								)}
							</TableRowContext.Provider>
						</TableContext.Provider>
					</ArrayItemLayoutContext.Provider>
				</ArrayItemsContext.Provider>
			</EntryFocusProvider>
		</div>
	);
};
export default ArrayFieldItemTemplate;
