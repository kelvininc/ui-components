import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldItemTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import classNames from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { KvActionButtonIcon } from '../../../../stencil-generated';
import styles from './ArrayFieldItemTemplate.module.scss';

const ArrayFieldItemTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	children,
	disabled,
	hasToolbar,
	index,
	buttonsProps,
	readonly
}: ArrayFieldItemTemplateProps<T, S, F>) => {
	const fieldset = get(children, ['props', 'uiSchema', 'ui:fieldset'], false);
	const itemPrefix = get(children, ['props', 'uiSchema', 'ui:itemPrefix']);
	const { hasMoveDown, hasMoveUp, hasRemove, onMoveDownItem, onMoveUpItem, onRemoveItem } = buttonsProps;

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
									disabled={disabled || readonly || !hasMoveDown}
									onClickButton={onMoveDownItem}
								/>
								<KvActionButtonIcon
									icon={EIconName.AlignTop}
									size={EComponentSize.Large}
									type={EActionButtonType.Tertiary}
									tabIndex={-1}
									disabled={disabled || readonly || !hasMoveUp}
									onClickButton={onMoveUpItem}
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
								onClickButton={onRemoveItem}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default ArrayFieldItemTemplate;
