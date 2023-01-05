import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ObjectFieldTemplateProps, canExpand, getTemplate, getUiOptions } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash-es';
import React, { useMemo } from 'react';
import { KvActionButtonIcon } from '../../../stencil-generated';
import { INPUT_INLINE_WIDTH } from '../../config';
import styles from './ObjectFieldTemplate.module.scss';

const ObjectFieldTemplate = ({
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
	registry
}: ObjectFieldTemplateProps) => {
	const rowWidth = useMemo(() => (get(uiSchema, ['ui:inline'], false) ? get(uiSchema, ['ui:inputWidth']) || INPUT_INLINE_WIDTH : '100%'), [uiSchema]);
	const uiOptions = getUiOptions(uiSchema);
	const TitleFieldTemplate = getTemplate<'TitleFieldTemplate'>('TitleFieldTemplate', registry, uiOptions);
	const DescriptionFieldTemplate = getTemplate<'DescriptionFieldTemplate'>('DescriptionFieldTemplate', registry, uiOptions);

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
					<div key={index} style={{ width: rowWidth }} className={classNames(styles.PropRow, { [styles.Hidden]: element.hidden })}>
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