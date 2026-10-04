import { EActionButtonType, EComponentSize, EIconName } from '@kelvininc/ui-components';
import { ArrayFieldItemButtonsTemplateProps, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import React from 'react';
import { KvActionButtonIcon } from '../../../../stencil-generated';

const ArrayFieldItemButtonsTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	disabled,
	hasMoveDown,
	hasMoveUp,
	hasRemove,
	onMoveDownItem,
	onMoveUpItem,
	onRemoveItem,
	readonly
}: ArrayFieldItemButtonsTemplateProps<T, S, F>) => (
	<>
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
	</>
);

export default ArrayFieldItemButtonsTemplate;
