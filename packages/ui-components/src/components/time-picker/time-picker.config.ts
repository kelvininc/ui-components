import { ComputePositionConfig, offset, size, MiddlewareState } from '@floating-ui/dom';
import { EIconName } from '../icon/icon.types';
import { EInputFieldType, EValidationState, ITextField } from '../text-field/text-field.types';

export const TIME_RANGE_PICKER_DROPDOWN_INPUT_OFFSET = 8;

export const DEFAULT_TIME_RANGE_PICKER_INPUT_CONFIG: Partial<ITextField> = {
	placeholder: 'Select a date',
	type: EInputFieldType.Text,
	icon: EIconName.Calendar,
	state: EValidationState.None
};

export const DEFAULT_TIME_RANGE_DROPDOWN_POSITION_OPTIONS: Partial<ComputePositionConfig> = {
	placement: 'bottom-end',
	middleware: [
		offset(TIME_RANGE_PICKER_DROPDOWN_INPUT_OFFSET),
		size({
			apply({ elements }: MiddlewareState) {
				Object.assign(elements.floating.style, {
					width: 'max-content'
				});
			}
		})
	]
};

export const DEFAULT_SELECTED_TIME_KEY = 'last-24-h';
export enum ETimePickerView {
	RelativeTimePicker = 'relativeTimePicker',
	AbsoluteTimePicker = 'absoluteTimePicker',
	FullView = 'fullView'
}
export const FULL_RANGE_SIZE = 2;
export const APPLY_BUTTON_ERROR_TOOLTIP_TEXT = 'Both time inputs must be filled.';
