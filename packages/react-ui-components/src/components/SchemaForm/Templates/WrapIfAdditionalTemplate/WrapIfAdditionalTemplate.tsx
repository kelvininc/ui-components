import { EActionButtonType, EComponentSize, EIconName, EInputFieldType } from '@kelvininc/ui-components';
import { ADDITIONAL_PROPERTY_FLAG, FormContextType, RJSFSchema, StrictRJSFSchema, WrapIfAdditionalTemplateProps } from '@rjsf/utils';
import React from 'react';
import { KvActionButtonIcon, KvTextField } from '../../../../stencil-generated/components';
import styles from './WrapIfAdditionalTemplate.module.scss';

const WrapIfAdditionalTemplate = <T, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
	children,
	disabled,
	id,
	label,
	onDropPropertyClick,
	onKeyChange,
	readonly,
	required,
	schema
}: WrapIfAdditionalTemplateProps<T, S, F>): any => {
	const keyLabel = `${label} Key`;
	const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);

	if (!additional) {
		return children;
	}

	const handleBlur = (value: CustomEvent<string>) => onKeyChange(value.detail);

	return (
		<div key={`${id}-key`} className={styles.NewKeyContainer}>
			<div className={styles.InputContainer}>
				<KvTextField
					id={`${id}-key`}
					label={keyLabel}
					inputDisabled={disabled || readonly}
					inputRequired={required}
					type={EInputFieldType.Text}
					value={label}
					onTextFieldBlur={!readonly ? handleBlur : undefined}
				/>
			</div>
			<div className={styles.InputContainer}>{children}</div>
			<div className={styles.DeleteButton}>
				<KvActionButtonIcon
					icon={EIconName.Delete}
					size={EComponentSize.Large}
					type={EActionButtonType.Danger}
					tabIndex={-1}
					disabled={disabled || readonly}
					onClickButton={onDropPropertyClick(label)}
				/>
			</div>
		</div>
	);
};

export default WrapIfAdditionalTemplate;
