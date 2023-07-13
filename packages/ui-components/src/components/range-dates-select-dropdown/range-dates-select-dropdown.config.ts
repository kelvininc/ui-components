import { ComputePositionConfig, flip, offset } from '@floating-ui/dom';
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

export const DEFAULT_DROPDOWN_POSITION_OPTIONS: Partial<ComputePositionConfig> = {
	placement: 'left-start',
	middleware: [
		offset(2),
		flip({
			fallbackPlacements: ['left-end', 'bottom-start', 'bottom-end', 'right-start', 'right-end', 'top-start', 'top-end']
		})
	]
};
