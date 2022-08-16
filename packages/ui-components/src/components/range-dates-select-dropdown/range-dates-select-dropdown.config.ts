import { EIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';

export const DEFAULT_START_DATE_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select a start date',
	type: EInputFieldType.Text,
	icon: EIconName.Calendar,
	state: EValidationState.None
};

export const DEFAULT_END_DATE_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select an end date',
	type: EInputFieldType.Text,
	icon: EIconName.Calendar,
	state: EValidationState.None
};
