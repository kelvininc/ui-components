import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateProps, IdSchema, utils } from '@rjsf/core';
import classNames from 'classnames';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';
import { KvActionButtonIcon, KvActionButtonText } from '../../stencil-generated';
import styles from './ArrayFieldTemplate.module.scss';

const { isMultiSelect, getDefaultRegistry } = utils;

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
	const { schema, registry = getDefaultRegistry() } = props;

	if (isMultiSelect(schema, registry.rootSchema)) {
		return <DefaultFixedArrayFieldTemplate {...props} />;
	} else {
		return <DefaultNormalArrayFieldTemplate {...props} />;
	}
};

type ArrayFieldTitleProps = {
	TitleField: React.FunctionComponent<{ id: string; title: string; required: boolean }>;
	idSchema: IdSchema;
	title: string;
	required: boolean;
};

const ArrayFieldTitle = ({ TitleField, idSchema, title, required }: ArrayFieldTitleProps) => {
	if (!title) {
		return null;
	}

	const id = `${idSchema.$id}__title`;
	return <TitleField id={id} title={title} required={required} />;
};

type ArrayFieldDescriptionProps = {
	DescriptionField: React.FunctionComponent<{ id: string; description: string | React.ReactElement }>;
	idSchema: IdSchema;
	description: string;
};

const ArrayFieldDescription = ({ DescriptionField, idSchema, description }: ArrayFieldDescriptionProps) => {
	if (!description) {
		return null;
	}

	const id = `${idSchema.$id}__description`;
	return <DescriptionField id={id} description={description} />;
};

type ArrayFieldItemProps = {
	children: React.ReactElement;
	className: string;
	disabled: boolean;
	hasMoveDown: boolean;
	hasMoveUp: boolean;
	hasRemove: boolean;
	hasToolbar: boolean;
	index: number;
	onAddIndexClick: (index: number) => (event?: any) => void;
	onDropIndexClick: (index: number) => (event?: any) => void;
	onReorderClick: (index: number, newIndex: number) => (event?: any) => void;
	readonly: boolean;
	key: string;
};

// Used in the two templates
const DefaultArrayItem = ({ children, disabled, hasMoveDown, hasMoveUp, hasRemove, hasToolbar, index, onDropIndexClick, onReorderClick, readonly, key }: ArrayFieldItemProps) => {
	const resetStyle = !get(children, ['props', 'uiSchema', 'ui:fieldset'], false);
	const itemPrefix = get(children, ['props', 'uiSchema', 'ui:itemPrefix']);

	return (
		<fieldset key={key} className={classNames([], { [styles['reset-fieldset-style']]: resetStyle })}>
			<div className={styles['array-item-container']}>
				{itemPrefix && <span className={styles['item-prefix']}>{`${itemPrefix} ${index + 1}`}</span>}
				{children}
				{hasToolbar && (
					<div className={styles['toolbar-container']}>
						{(hasMoveUp || hasMoveDown) && (
							<>
								<KvActionButtonIcon
									icon={EIconName.AlignBottom}
									size={EComponentSize.Large}
									type={EActionButtonType.Tertiary}
									tabIndex={-1}
									disabled={disabled || readonly || !hasMoveUp}
									onClickButton={onReorderClick(index, index - 1)}
								/>
								<KvActionButtonIcon
									icon={EIconName.AlignTop}
									size={EComponentSize.Large}
									type={EActionButtonType.Tertiary}
									tabIndex={-1}
									disabled={disabled || readonly || !hasMoveDown}
									onClickButton={onReorderClick(index, index + 1)}
								/>
							</>
						)}
						{hasRemove && (
							<KvActionButtonIcon
								icon={EIconName.Delete}
								size={EComponentSize.Large}
								type={EActionButtonType.Tertiary}
								tabIndex={-1}
								disabled={disabled || readonly}
								onClickButton={onDropIndexClick(index)}
							/>
						)}
					</div>
				)}
			</div>
		</fieldset>
	);
};

const addButton = ({ canAdd, disabled, readonly, uiSchema, onAddClick }: Partial<ArrayFieldTemplateProps>) =>
	useMemo(() => {
		if (!canAdd) return;
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
		} else {
			return (
				<div className={styles['array-field-add-button-container']}>
					<KvActionButtonIcon {...btnProps} />
				</div>
			);
		}
	}, [canAdd, disabled, readonly, uiSchema]);

const DefaultFixedArrayFieldTemplate = ({
	idSchema,
	uiSchema,
	schema,
	className,
	title,
	disabled,
	readonly,
	required,
	items,
	canAdd,
	onAddClick,
	TitleField
}: ArrayFieldTemplateProps) => {
	return (
		<fieldset className={className}>
			<ArrayFieldTitle key={`array-field-title-${idSchema.$id}`} TitleField={TitleField} idSchema={idSchema} title={uiSchema['ui:title'] || title} required={required} />

			{(uiSchema['ui:description'] || schema.description) && (
				<div className="field-description" key={`field-description-${idSchema.$id}`}>
					{uiSchema['ui:description'] || schema.description}
				</div>
			)}

			<div className={styles['array-item-list']} key={`array-item-list-${idSchema.$id}`}>
				{items && items.map(DefaultArrayItem)}
				{addButton({ canAdd, disabled, readonly, uiSchema, onAddClick })}
			</div>
		</fieldset>
	);
};

const DefaultNormalArrayFieldTemplate = ({
	idSchema,
	uiSchema,
	schema,
	title,
	disabled,
	readonly,
	required,
	items,
	canAdd,
	onAddClick,
	TitleField,
	DescriptionField
}: ArrayFieldTemplateProps) => {
	return (
		<div className={styles['array-field-template']}>
			<div className={styles['array-field-container']}>
				<ArrayFieldTitle key={`array-field-title-${idSchema.$id}`} TitleField={TitleField} idSchema={idSchema} title={uiSchema['ui:title'] || title} required={required} />

				{(uiSchema['ui:description'] || schema.description) && (
					<ArrayFieldDescription
						key={`array-field-description-${idSchema.$id}`}
						DescriptionField={DescriptionField}
						idSchema={idSchema}
						description={uiSchema['ui:description'] || schema.description}
					/>
				)}

				<div className={styles['array-item-list']} key={`array-item-list-${idSchema.$id}`}>
					{items && items.map(DefaultArrayItem)}
					{addButton({ canAdd, disabled, readonly, uiSchema, onAddClick })}
				</div>
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
