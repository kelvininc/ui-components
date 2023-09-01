import { getUTF8StringLength } from '../../utils/string.helper';
import { COMMON_INPUT_MASK_CONFIG, DATE_TIME_INPUT_MASK_CONFIG } from './text-field.config';
import { EInputFieldType, IInputMaskInstanceRef } from './text-field.types';

export function getInputMaskConfig(type: EInputFieldType): Inputmask.Options {
	if (type === EInputFieldType.Text) {
		return COMMON_INPUT_MASK_CONFIG;
	}

	if (type === EInputFieldType.DateTime) {
		return DATE_TIME_INPUT_MASK_CONFIG;
	}

	return {
		alias: 'numeric',
		...COMMON_INPUT_MASK_CONFIG
	};
}

export function isInputMaskCompatibleType(type: EInputFieldType): boolean {
	return [EInputFieldType.Number, EInputFieldType.Text, EInputFieldType.DateTime].includes(type);
}

export function buildInputMask(input: HTMLInputElement, inputType: EInputFieldType, options: Inputmask.Options, maxLength?: number): IInputMaskInstanceRef {
	// @ts-ignore the types library for Inputmask has the callback type definition for onBeforePaste incorrect, it should return string | false
	return Inputmask({
		...getInputMaskConfig(inputType),
		...options,
		onBeforePaste: (fieldValue: string) => {
			if (!maxLength) return fieldValue;
			return getUTF8StringLength(fieldValue) <= maxLength ? fieldValue : false;
		}
	}).mask(input) as IInputMaskInstanceRef;
}

export function getValueAsString(newValue: string | number | null): string {
	return typeof newValue === 'number' ? newValue.toString() : (newValue || '').toString();
}
