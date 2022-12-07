import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ObjectFieldTemplateProps, utils } from '@rjsf/core';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { KvActionButtonIcon } from '../../stencil-generated';
import { INPUT_INLINE_WIDTH } from '../config';
import DescriptionField from '../Fields/DescriptionField';
import TitleField from '../Fields/TitleField';
import styles from './ObjectFieldTemplate.module.scss';

const { canExpand } = utils;

const ObjectFieldTemplate = ({ description, title, required, properties, uiSchema, idSchema, schema, formData, onAddClick, disabled, readonly }: ObjectFieldTemplateProps) => {
	const propRowWidth = useMemo(() => (uiSchema['ui:inline'] ? uiSchema['ui:inputWidth'] || INPUT_INLINE_WIDTH : '100%'), [uiSchema]);
	return (
		<>
			{(uiSchema['ui:title'] || title) && <TitleField id={`${idSchema.$id}-title`} title={uiSchema['ui:title'] || title} required={required} />}
			<DescriptionField id={`${idSchema.$id}-description`} description={description} />
			<div className={classNames(styles['props-container'], { [styles.inline]: uiSchema['ui:inline'] })}>
				{properties.map((element, index) => (
					<div key={index} style={{ width: propRowWidth }} className={classNames(styles['prop-row'], { [styles.hidden]: element.hidden })}>
						{element.content}
					</div>
				))}
				{canExpand(schema, uiSchema, formData) && (
					<div className={styles['add-button-container']}>
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
