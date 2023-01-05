import { COMMON_INPUT_MASK_CONFIG } from './text-field.config';
import { EInputFieldType } from './text-field.types';

export function getInputMaskConfig(type: EInputFieldType): Inputmask.Options {
	if (type !== EInputFieldType.Number) {
		return {
			...COMMON_INPUT_MASK_CONFIG
		};
	}

	return {
		alias: 'numeric',
		...COMMON_INPUT_MASK_CONFIG
	};
}

export function isInputMaskCompatibleType(type: EInputFieldType): boolean {
	return [EInputFieldType.Number, EInputFieldType.Text].includes(type);
}
