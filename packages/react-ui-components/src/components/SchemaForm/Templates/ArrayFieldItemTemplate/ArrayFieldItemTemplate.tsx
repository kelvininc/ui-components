import { EActionButtonType, EComponentSize, EIconName, IActionMenuItem } from '@kelvininc/ui-components';
import { ArrayFieldTemplateItemType, FieldProps, FormContextType, getTemplate, getUiOptions, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import React, { useContext } from 'react';
import { KvActionButtonIcon, KvActionMenu } from '../../../../stencil-generated';
import { ArrayItemControlsContext, ArrayItemLayoutContext } from '../../contexts';
import { mergeUiSchemas } from '../../rjsf/merge';
import { isBuiltinSchemaField } from '../../rjsf/SchemaField';
import { SCHEMA_FORM_STRINGS } from '../../strings';
import FieldTemplate from '../FieldTemplate';
import { isSectionField } from '../utils';
import styles from './ArrayFieldItemTemplate.module.scss';

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
	const options = getUiOptions(uiSchema, registry.globalUiOptions);
	const fixedPosition = index < (layout?.fixedItems ?? 0);
	const prefix = validName(options.itemPrefix) || (!fixedPosition ? layout?.itemPrefix : undefined);
	const name = prefix || validName(options.title) || validName(schema.title) || SCHEMA_FORM_STRINGS.item;
	const itemName = fixedPosition ? name : `${name} ${index + 1}`;
	const section = isSectionField(schema, uiSchema, registry);
	const field = children as React.ReactElement<FieldProps<T, S, F>>;
	// Native SchemaField returns null for an empty schema, so those rows need the fallback controls.
	const defaultTemplate = Object.keys(schema).length > 0 && getTemplate('FieldTemplate', registry, options) === FieldTemplate && isBuiltinSchemaField(field.type);
	const inactive = Boolean(disabled || readonly);
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
		if (event.detail === 'move-up' && moves && hasMoveUp) onReorderClick(index, index - 1)(event);
		if (event.detail === 'move-down' && moves && hasMoveDown) onReorderClick(index, index + 1)(event);
		if (event.detail === 'remove' && section && hasRemove) onDropIndexClick(index)(event);
	};
	const menu = actions.length ? (
		<KvActionMenu
			accessibleLabel={section ? SCHEMA_FORM_STRINGS.itemActions(itemName) : SCHEMA_FORM_STRINGS.reorder(itemName)}
			items={actions}
			icon={section ? EIconName.More : EIconName.DragDrop}
			size={EComponentSize.Large}
			triggerTabIndex={-1}
			disabled={inactive}
			onItemSelected={onItemSelected}
		/>
	) : null;
	const before = !section && (layout?.reserveGrip ?? moves) ? <div className={styles.ActionSlot}>{menu}</div> : undefined;
	const after =
		!section && (layout?.removable ?? hasRemove) ? (
			<div className={styles.ActionSlot}>
				{hasRemove && (
					<KvActionButtonIcon
						icon={EIconName.Delete}
						accessibleLabel={SCHEMA_FORM_STRINGS.remove(itemName)}
						size={EComponentSize.Large}
						type={EActionButtonType.Tertiary}
						tabIndex={-1}
						menuTabIndex={-1}
						disabled={inactive}
						onClickButton={onDropIndexClick(index)}
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

	return (
		<div
			className={classNames({ [styles.ObjectItem]: section, [styles.FieldsetStyle]: options.fieldset })}
			data-schema-form-list-item={index}
			data-schema-form-item-kind={section ? 'section' : 'control'}
		>
			<ArrayItemLayoutContext.Provider value={null}>
				{defaultTemplate ? (
					<ArrayItemControlsContext.Provider value={controls}>{body}</ArrayItemControlsContext.Provider>
				) : (
					<div className={styles.FallbackRow}>
						{before}
						<div className={styles.ItemBody}>{body}</div>
						{section ? menu : after}
					</div>
				)}
			</ArrayItemLayoutContext.Provider>
		</div>
	);
};
export default ArrayFieldItemTemplate;
