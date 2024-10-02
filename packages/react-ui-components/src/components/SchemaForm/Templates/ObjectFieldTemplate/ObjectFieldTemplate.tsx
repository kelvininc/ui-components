import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { FormContextType, ObjectFieldTemplateProps, RJSFSchema, StrictRJSFSchema, canExpand } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { KvActionButtonIcon } from '../../../../stencil-generated/components';
import styles from './ObjectFieldTemplate.module.scss';
import { DEFAULT_INPUT_CONFIG, DEFAULT_INPUT_INLINE_CONFIG } from './config';

const ObjectFieldTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	properties,
	uiSchema,
	schema,
	formData,
	onAddClick,
	disabled,
	readonly,
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
	return (
		<>
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
