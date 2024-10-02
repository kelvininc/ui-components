import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { KvActionButtonIcon } from '../../../../stencil-generated/components';
import styles from './ArrayFieldItemTemplate.module.scss';

const ArrayFieldItemTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	children,
	disabled,
	hasMoveDown,
	hasMoveUp,
	hasRemove,
	hasToolbar,
	index,
	onDropIndexClick,
	onReorderClick,
	readonly
}: ArrayFieldTemplateItemType<T, S, F>) => {
	const fieldset = get(children, ['props', 'uiSchema', 'ui:fieldset'], false);
	const itemPrefix = get(children, ['props', 'uiSchema', 'ui:itemPrefix']);

	return (
		<div className={classNames({ [styles.FieldsetStyle]: fieldset })}>
			<div className={styles.ArrayItemContainer}>
				{itemPrefix && <span className={styles.ItemPrefix}>{`${itemPrefix} ${index + 1}`}</span>}
				{children}
				{hasToolbar && (
					<div className={styles.ToolbarContainer}>
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
		</div>
	);
};
export default ArrayFieldItemTemplate;
