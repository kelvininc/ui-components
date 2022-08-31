import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';

export const DROPDOWN_DEFAULT_PLACEHOLDER = 'Select an option';

export const DEFAULT_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select an option',
	type: EInputFieldType.Text,
	state: EValidationState.None
};
