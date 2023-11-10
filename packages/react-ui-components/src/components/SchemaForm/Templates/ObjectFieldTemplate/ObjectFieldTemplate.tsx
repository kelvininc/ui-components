import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { FormContextType, ObjectFieldTemplateProps, RJSFSchema, StrictRJSFSchema, canExpand, getTemplate, getUiOptions } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { KvActionButtonIcon } from '../../../stencil-generated';
import styles from './ObjectFieldTemplate.module.scss';
import { DEFAULT_INPUT_CONFIG, DEFAULT_INPUT_INLINE_CONFIG } from './config';

const ObjectFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	description,
	title,
	required,
	properties,
	uiSchema,
	idSchema,
	schema,
	formData,
	onAddClick,
	disabled,
	readonly,
	registry,
	formContext
}: ObjectFieldTemplateProps<T, S, F>) => {
	const { inputConfig = get(uiSchema, ['ui:inline'], false) ? DEFAULT_INPUT_INLINE_CONFIG : DEFAULT_INPUT_CONFIG } = formContext as F;
	const rowWidth = useMemo(() => get(uiSchema, ['ui:inputWidth']) ?? inputConfig.width, [uiSchema, inputConfig]);
	const rowMinWidth = useMemo(() => get(uiSchema, ['ui:inputMinWidth']) ?? inputConfig.minWidth, [uiSchema, inputConfig]);
	const rowMaxWidth = useMemo(() => get(uiSchema, ['ui:inputMaxWidth']) ?? inputConfig.maxWidth, [uiSchema, inputConfig]);

	const inputWidthProps = useMemo(
		() => ({
			width: rowWidth,
			minWidth: rowMinWidth,
			maxWidth: rowMaxWidth
		}),
		[rowWidth, rowMinWidth, rowMaxWidth]
	);
	const uiOptions = getUiOptions(uiSchema);
	const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>('TitleFieldTemplate', registry, uiOptions);
	const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate', T, S, F>('DescriptionFieldTemplate', registry, uiOptions);

	return (
		<>
			{(get(uiSchema, ['ui:title']) || title) && (
				<TitleFieldTemplate id={`${idSchema.$id}-title`} title={uiOptions.title || title} required={required} schema={schema} uiSchema={uiSchema} registry={registry} />
			)}
			<DescriptionFieldTemplate
				id={`${idSchema.$id}-description`}
				description={uiOptions.description || description!}
				schema={schema}
				uiSchema={uiSchema}
				registry={registry}
			/>
			<div className={classNames(styles.PropsContainer, { [styles.Inline]: get(uiSchema, ['ui:inline'], false) })}>
				{properties.map((element, index) => (
					<div key={index} style={{ ...inputWidthProps }} className={classNames(styles.PropRow, { [styles.Hidden]: element.hidden })}>
						{element.content}
					</div>
				))}
				{canExpand(schema, uiSchema, formData) && (
					<div className={styles.AddButtonContainer}>
						<KvActionButtonIcon
							icon={EIconName.Add}
							size={EComponentSize.Large}
							type={EActionButtonType.Primary}
							tabIndex={-1}
							disabled={disabled || readonly}
							onClickButton={onAddClick(schema)}
						/>
					</div>
				)}
			</div>
		</>
	);
};

export default ObjectFieldTemplate;
