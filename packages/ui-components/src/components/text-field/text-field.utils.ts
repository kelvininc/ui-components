import { COMMON_INPUT_MASK_CONFIG } from './text-field.config';
import { EInputFieldType } from './text-field.types';

export function getInputMaskConfig(type: EInputFieldType): Inputmask.Options {
	if (type === EInputFieldType.Text) {
		return {
			...COMMON_INPUT_MASK_CONFIG
		};
	}

	if (type === EInputFieldType.DateTime) {
		return {
			alias: 'datetime',
			inputFormat: 'dd-mm-yyyy HH:MM:ss',
			displayFormat: 'dd-mm-yyyy 00:00:00',
			placeholder: 'dd-mm-yyyy 00:00:00',
			jitMasking: true,
			showMaskOnHover: false,
			clearMaskOnLostFocus: false
		};
	}

	return {
		alias: 'numeric',
		...COMMON_INPUT_MASK_CONFIG
	};
}

export function isInputMaskCompatibleType(type: EInputFieldType): boolean {
	return [EInputFieldType.Number, EInputFieldType.Text, EInputFieldType.DateTime].includes(type);
}
