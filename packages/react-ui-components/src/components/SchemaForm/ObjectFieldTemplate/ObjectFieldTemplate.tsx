import React from 'react';
import classNames from 'classnames';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import { utils } from '@rjsf/core';
import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { KvActionButtonIcon } from '../../stencil-generated';
import styles from './ObjectFieldTemplate.module.scss';
import TitleField from '../Fields/TitleField';
import DescriptionField from '../Fields/DescriptionField';

const { canExpand } = utils;

const ObjectFieldTemplate = ({ description, title, required, properties, uiSchema, idSchema, schema, formData, onAddClick, disabled, readonly }: ObjectFieldTemplateProps) => {
	return (
		<>
			{(uiSchema['ui:title'] || title) && <TitleField id={`${idSchema.$id}-title`} title={uiSchema['ui:title'] || title} required={required} />}
			<DescriptionField id={`${idSchema.$id}-description`} description={description} />
			<div className={styles['props-container']}>
				{properties.map((element, index) => (
					<div key={index} className={classNames(styles['prop-row'], { [styles.hidden]: element.hidden })}>
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
