import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateProps, IdSchema, utils } from '@rjsf/core';
import React from 'react';
import { KvActionButtonIcon } from '../../stencil-generated';
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
	TitleField: any;
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
	DescriptionField: any;
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

// Used in the two templates
const DefaultArrayItem = (props: any) => {
	return (
		<div key={props.key} className={styles['array-item-container']}>
			{props.children}
			{props.hasToolbar && (
				<div className={styles['toolbar-container']}>
					{(props.hasMoveUp || props.hasMoveDown) && (
						<KvActionButtonIcon
							icon={EIconName.AlignBottom}
							size={EComponentSize.Large}
							type={EActionButtonType.Secondary}
							tabIndex={-1}
							disabled={props.disabled || props.readonly || !props.hasMoveUp}
							onClick={props.onReorderClick(props.index, props.index - 1)}
						/>
					)}

					{(props.hasMoveUp || props.hasMoveDown) && (
						<KvActionButtonIcon
							icon={EIconName.AlignTop}
							size={EComponentSize.Large}
							type={EActionButtonType.Secondary}
							tabIndex={-1}
							disabled={props.disabled || props.readonly || !props.hasMoveDown}
							onClick={props.onReorderClick(props.index, props.index + 1)}
						/>
					)}

					{props.hasRemove && (
						<KvActionButtonIcon
							icon={EIconName.Delete}
							size={EComponentSize.Large}
							type={EActionButtonType.Danger}
							tabIndex={-1}
							disabled={props.disabled || props.readonly}
							onClick={props.onDropIndexClick(props.index)}
						/>
					)}
				</div>
			)}
		</div>
	);
};

const DefaultFixedArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
	return (
		<fieldset className={props.className}>
			<ArrayFieldTitle
				key={`array-field-title-${props.idSchema.$id}`}
				TitleField={props.TitleField}
				idSchema={props.idSchema}
				title={props.uiSchema['ui:title'] || props.title}
				required={props.required}
			/>

			{(props.uiSchema['ui:description'] || props.schema.description) && (
				<div className="field-description" key={`field-description-${props.idSchema.$id}`}>
					{props.uiSchema['ui:description'] || props.schema.description}
				</div>
			)}

			<div className={styles['array-item-list']} key={`array-item-list-${props.idSchema.$id}`}>
				{props.items && props.items.map(DefaultArrayItem)}
			</div>

			{props.canAdd && (
				<KvActionButtonIcon
					icon={EIconName.Add}
					size={EComponentSize.Large}
					type={EActionButtonType.Primary}
					tabIndex={-1}
					disabled={props.disabled || props.readonly}
					onClick={props.onAddClick}
				/>
			)}
		</fieldset>
	);
};

const DefaultNormalArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
	return (
		<div className={styles['array-field-template']}>
			<div className={styles['array-field-container']}>
				<ArrayFieldTitle
					key={`array-field-title-${props.idSchema.$id}`}
					TitleField={props.TitleField}
					idSchema={props.idSchema}
					title={props.uiSchema['ui:title'] || props.title}
					required={props.required}
				/>

				{(props.uiSchema['ui:description'] || props.schema.description) && (
					<ArrayFieldDescription
						key={`array-field-description-${props.idSchema.$id}`}
						DescriptionField={props.DescriptionField}
						idSchema={props.idSchema}
						description={props.uiSchema['ui:description'] || props.schema.description}
					/>
				)}

				<div key={`array-item-list-${props.idSchema.$id}`}>
					{props.items && props.items.map(p => DefaultArrayItem(p))}

					{props.canAdd && (
						<div className={styles['array-field-add-button-container']}>
							<KvActionButtonIcon
								icon={EIconName.Add}
								size={EComponentSize.Large}
								type={EActionButtonType.Primary}
								tabIndex={-1}
								disabled={props.disabled || props.readonly}
								onClick={props.onAddClick}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ArrayFieldTemplate;
