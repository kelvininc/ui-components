import { EComponentSize, EIconName, EValidationState } from '../../types';
import { IDateTimeInput } from '../date-time-input/date-time-input.types';

export const DEFAULT_LEFT_INPUT_CONFIG: Omit<Partial<IDateTimeInput>, 'value'> = {
	label: 'Change On',
	required: true,
	state: EValidationState.None,
	size: EComponentSize.Large,
	leftIcon: EIconName.Calendar
};

export const DEFAULT_RIGHT_INPUT_CONFIG: Omit<Partial<IDateTimeInput>, 'value'> = {
	label: 'Revert On',
	required: true,
	state: EValidationState.None,
	size: EComponentSize.Large
};

export const DATE_TIME_INPUT_DATE_FORMAT = 'dd-mm-yyyy HH:MM';
export const INPUT_MASK_PLACEHOLDER = 'dd-mm-yyyy 00:00';
export const EMPTY_INPUT_PLACEHOLDER = 'Pick date & time';

export const DATE_FORMAT = 'DD-MM-YYYY HH:mm';
export const CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';
