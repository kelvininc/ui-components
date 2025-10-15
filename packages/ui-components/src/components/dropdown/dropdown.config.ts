import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';
import { EComponentSize } from '../../types';

export const DROPDOWN_DEFAULT_PLACEHOLDER = 'Select an option';

export const DEFAULT_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select an option',
	type: EInputFieldType.Text,
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const DEFAULT_DROPDOWN_OFFSET = 8;

export const HELP_TEXT_HEIGHT_PX = 24;
