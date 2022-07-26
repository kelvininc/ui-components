import { EActionButtonType, EComponentSize, EIconName, EInputFieldType } from '@kelvininc/ui-components';
import { utils } from '@rjsf/core';
import { JSONSchema7 } from 'json-schema';
import React from 'react';
import { KvActionButtonIcon, KvTextField } from '../../stencil-generated';
import styles from './FieldTemplate.module.scss';

const { ADDITIONAL_PROPERTY_FLAG } = utils;

type WrapIfAdditionalProps = {
	children: React.ReactElement;
	classNames: string;
	disabled: boolean;
	id: string;
	label: string;
	onDropPropertyClick: (index: string) => (event?: any) => void;
	onKeyChange: (index: string) => (event?: any) => void;
	readonly: boolean;
	required: boolean;
	schema: JSONSchema7;
};

const WrapIfAdditional = ({ children, disabled, id, label, onDropPropertyClick, onKeyChange, readonly, required, schema }: WrapIfAdditionalProps) => {
	const keyLabel = `${label} Key`;
	const additional = schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);

	if (!additional) {
		return children;
	}

	const handleBlur = (value: CustomEvent<string>) => onKeyChange(value.detail);

	return (
		<div key={`${id}-key`} className={styles['new-key-container']}>
			<div className={styles['input-container']}>
				<KvTextField
					id={`${id}-key`}
					label={keyLabel}
					disabled={disabled || readonly}
					required={required}
					type={EInputFieldType.Text}
					value={label}
					onTextFieldBlur={!readonly ? handleBlur : undefined}
				/>
			</div>
			<div className={styles['input-container']}>{children}</div>
			<div className={styles['delete-button']}>
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

export default WrapIfAdditional;
